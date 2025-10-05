import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description?: string;
}

const UpgradePrompt = ({ feature, description }: UpgradePromptProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Upgrade to Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          {description || `${feature} is available with Premium subscription.`}
        </p>
        <Button className="w-full" onClick={() => navigate('/premium')}>
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;