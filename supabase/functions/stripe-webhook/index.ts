import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_API") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No stripe signature found");
      return new Response(JSON.stringify({ error: "No signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Webhook received: ${event.type}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const customerEmail = session.customer_email || session.customer_details?.email;
          
          if (customerEmail) {
            const { data: profile, error: fetchError } = await supabase
              .from("profiles")
              .select("user_id")
              .eq("user_id", session.client_reference_id || "")
              .single();

            if (fetchError) {
              console.error("Error fetching profile:", fetchError);
            } else {
              const { error: updateError } = await supabase
                .from("profiles")
                .update({
                  subscription_status: "premium",
                  is_premium: true,
                  stripe_customer_id: session.customer as string,
                  stripe_subscription_id: subscription.id,
                  subscription_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
                })
                .eq("user_id", profile.user_id);

              if (updateError) {
                console.error("Error updating profile:", updateError);
              } else {
                console.log("Profile updated to premium");
              }
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status === "active" ? "premium" : "expired",
            is_premium: subscription.status === "active",
            subscription_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating subscription:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", subscription.id);

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "free",
            is_premium: false,
            subscription_expiry: null,
            stripe_subscription_id: null,
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error deleting subscription:", error);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded:", invoice.id);

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_status: "premium",
              is_premium: true,
              subscription_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (error) {
            console.error("Error updating payment:", error);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed:", invoice.id);

        if (invoice.subscription) {
          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_status: "expired",
              is_premium: false,
            })
            .eq("stripe_subscription_id", invoice.subscription as string);

          if (error) {
            console.error("Error updating failed payment:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});