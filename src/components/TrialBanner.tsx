import React from 'react';
import { useTrial } from '@/hooks/useTrial';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export const TrialBanner = () => {
  const { isInTrial, daysLeft, isDevelopmentMode } = useTrial();

  if (isDevelopmentMode || !isInTrial) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary">
            <Clock className="w-3 h-3 mr-1" />
            Free Trial
          </Badge>
          <span className="text-sm text-foreground">
            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;