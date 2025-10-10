import React from 'react';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplet } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

export const HydrationTracker = () => {
  const today = new Date().toISOString().split('T')[0];
  const { totalMl, isLoading, addLog } = useHydration(today);
  const { profile } = useUserProfile();

  const target = profile?.hydration_target_ml || 2000;
  const percentage = Math.min(100, (totalMl / target) * 100);

  const quickAdd = (ml: number) => {
    addLog(ml);
  };

  if (isLoading) {
    return <div>Loading hydration...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="w-5 h-5" />
          Hydration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">{totalMl}ml / {target}ml</span>
            <span className="text-sm font-bold">{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => quickAdd(250)} variant="outline" size="sm">
            +250ml
          </Button>
          <Button onClick={() => quickAdd(500)} variant="outline" size="sm">
            +500ml
          </Button>
          <Button onClick={() => quickAdd(750)} variant="outline" size="sm">
            +750ml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydrationTracker;