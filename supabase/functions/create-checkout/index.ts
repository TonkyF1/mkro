import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const rawStripeKeys: Array<[string, string | undefined]> = [
  ["STRIPE_TEST", Deno.env.get("STRIPE_TEST")],
  ["STRIPE TEST", Deno.env.get("STRIPE TEST")],
  ["STRIPE_SECRET_KEY", Deno.env.get("STRIPE_SECRET_KEY")],
  ["STRIPE_SECRET", Deno.env.get("STRIPE_SECRET")],
  ["STRIPE_API", Deno.env.get("STRIPE_API")],
  ["STRIPE API", Deno.env.get("STRIPE API")],
];
const resolvedStripe = rawStripeKeys.find(([_, v]) => !!(v && v.trim()));
const stripeKeyRaw = resolvedStripe?.[1] || "";
const stripeKey = stripeKeyRaw.trim().replace(/^['"]|['"]$/g, "");
if (!stripeKey || !stripeKey.startsWith("sk_")) {
  console.error(
    "Stripe secret key is missing or invalid. Checked env vars:",
    rawStripeKeys.map(([n, v]) => `${n}:${v ? "set" : "missing"}`).join(", ")
  );
}
const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!stripeKey || !stripeKey.startsWith("sk_")) {
      console.error("Stripe key invalid or missing. Using env:", resolvedStripe?.[0] || "<none>");
      return new Response(
        JSON.stringify({ error: "Server misconfigured: Stripe secret key missing or invalid" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { priceId, planType } = await req.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Price ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Creating checkout for user ${user.id}, plan: ${planType}`);

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, name")
      .eq("user_id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);

      console.log(`Created new Stripe customer: ${customerId}`);
    }

    const origin = req.headers.get("origin") || "https://clemkvxneggnokmvgmbj.supabase.co";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/profile?success=true`,
      cancel_url: `${origin}/profile?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });

    console.log(`Checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});