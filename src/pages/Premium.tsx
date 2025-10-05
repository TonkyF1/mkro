import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  MessageSquare,
  BookOpen,
  Mail,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Premium = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';
  
  // Get trial status
  const trialPromptsUsed = profile?.trial_prompts_used || 0;
  const trialPromptsRemaining = Math.max(0, 20 - trialPromptsUsed);
  const isInTrial = trialPromptsRemaining > 0 && !isPremium;

  // Stripe Price IDs
  const MONTHLY_PRICE_ID = 'price_1SEzLaE64grEUO7BtHwPEdmk'; // £9.99/month
  const YEARLY_PRICE_ID = 'price_1SEzPDE64grEUO7BYfGK8Wdp'; // £69.99/year

  const handleUpgrade = async (priceId: string, planType: 'monthly' | 'yearly') => {
    console.log('🔵 Button clicked!', { planType, priceId, authLoading, user: !!user });
    
    if (authLoading) {
      console.log('🔴 Blocked: Auth loading');
      toast({ title: 'Please wait', description: 'Checking your session…' });
      return;
    }

    if (!user) {
      console.log('🔴 Blocked: No user');
      toast({
        title: 'Sign in required',
        description: 'Please sign in to upgrade to Premium',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    console.log('✅ Starting checkout process...');
    setLoading(planType);

    try {
      console.log('📞 Calling create-checkout function...', { priceId, planType });
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      console.log('🔑 Access token exists:', !!accessToken);
      
      const response = await fetch('https://clemkvxneggnokmvgmbj.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? `Bearer ${accessToken}` : '',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZW1rdnhuZWdnbm9rbXZnbWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTE3ODIsImV4cCI6MjA3NDY2Nzc4Mn0.wYsFizNIe8WhpLuip5Bcd3KpxYAn3X4Mmq9AEe3hKk4',
        },
        body: JSON.stringify({ priceId, planType }),
      });
      
      console.log('📡 Response status:', response.status);
      const json = await response.json();
      console.log('📦 Response data:', json);
      
      if (response.ok && json?.url) {
        console.log('✅ Redirecting to Stripe:', json.url);
        window.location.href = json.url;
        return;
      }

      console.error('❌ No checkout URL returned', json);
      toast({
        title: 'Checkout Error',
        description: json.error || 'Could not start checkout. Please try again.',
        variant: 'destructive',
      });
    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  if (isPremium) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  const features = [
    { icon: BookOpen, text: 'Unlimited recipe access' },
    { icon: TrendingUp, text: 'Full nutrition tracking & history' },
    { icon: MessageSquare, text: 'Advanced AI Coach with deep insights' },
    { icon: Zap, text: 'Premium workout library with videos' },
    { icon: Mail, text: 'Weekly AI-powered reports & tips' },
    { icon: Sparkles, text: 'Priority support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              MKRO Premium
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full power of AI-driven nutrition, training, and health optimization
          </p>
          {isInTrial && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">
                Free Trial Active: {trialPromptsRemaining} AI prompts remaining
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative overflow-hidden border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                {!isPremium && <Badge variant="outline">Current</Badge>}
              </div>
              <CardDescription className="text-3xl font-bold text-foreground">
                £0<span className="text-sm font-normal text-muted-foreground">/forever</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInTrial && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">
                      {trialPromptsRemaining} AI Coach prompts remaining
                    </span>
                  </div>
                </div>
              )}
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">20 AI Coach prompts free trial</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Limited recipe access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic nutrition tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic workout tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-purple-600 text-primary-foreground px-4 py-1 text-sm font-bold rounded-bl-lg">
              MOST POPULAR
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  MKRO Premium
                </CardTitle>
              </div>
              <div className="space-y-2">
                <CardDescription className="text-3xl font-bold text-foreground">
                  £9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </CardDescription>
                <CardDescription className="text-sm text-muted-foreground">
                  or £69.99/year (Save 30%)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {isPremium ? (
                <Button className="w-full" size="lg" disabled>
                  <Crown className="mr-2 h-5 w-5" />
                  Active Premium Member
                </Button>
              ) : (
                <div className="space-y-3">
                  {isInTrial && (
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      Continue after your {trialPromptsRemaining} free prompts
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    size="lg"
                    onClick={() => handleUpgrade(MONTHLY_PRICE_ID, 'monthly')}
                    disabled={authLoading || loading === 'monthly'}
                  >
                    {loading === 'monthly' ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-5 w-5" />
                    )}
                    Upgrade - £9.99/month
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                    onClick={() => handleUpgrade(YEARLY_PRICE_ID, 'yearly')}
                    disabled={authLoading || loading === 'yearly'}
                  >
                    {loading === 'yearly' ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Crown className="mr-2 h-5 w-5" />
                    )}
                    Upgrade - £69.99/year (Save 30%)
                  </Button>
                  <p className="text-center text-xs text-muted-foreground pt-2">
                    Start with {isInTrial ? `${trialPromptsRemaining} remaining free prompts` : '20 free AI Coach prompts'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, debit cards, and digital wallets through Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Will I lose my data if I cancel?</h3>
              <p className="text-sm text-muted-foreground">
                No, your data is always safe. You'll just lose access to premium features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Premium;