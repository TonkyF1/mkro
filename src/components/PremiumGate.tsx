import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Sparkles } from 'lucide-react';

interface PremiumGateProps {
  feature: string;
  description?: string;
  children?: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  feature, 
  description,
  children 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="max-w-lg w-full border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Premium Feature
            </CardTitle>
            <CardDescription className="text-lg">
              {feature}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {description || `Unlock ${feature} and all premium features with MKRO Premium.`}
          </p>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Unlimited AI Coach access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Full nutrition tracking & history</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Premium workout library</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Weekly AI reports & insights</span>
            </div>
          </div>

          {children}

          <Button 
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            size="lg"
            onClick={() => navigate('/premium')}
          >
            <Crown className="mr-2 h-5 w-5" />
            Upgrade to Premium
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  );
};