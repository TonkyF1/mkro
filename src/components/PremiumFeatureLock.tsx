import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureLockProps {
  feature: string;
  compact?: boolean;
}

export const PremiumFeatureLock = ({ feature, compact = false }: PremiumFeatureLockProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Lock className="w-4 h-4 text-amber-500" />
        <span className="text-muted-foreground">Premium Feature</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-amber-600 hover:text-amber-700"
          onClick={() => navigate('/premium')}
        >
          Unlock
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-4 p-6 text-center z-10">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg">
        <Crown className="w-8 h-8 text-white" />
      </div>
      <div className="space-y-2">
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
          Premium Feature
        </Badge>
        <h3 className="text-xl font-bold">{feature}</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Upgrade to Premium to unlock this feature and many more
        </p>
      </div>
      <Button
        className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 min-h-[44px]"
        onClick={() => navigate('/premium')}
      >
        <Crown className="w-4 h-4" />
        Upgrade to Premium
      </Button>
    </div>
  );
};
