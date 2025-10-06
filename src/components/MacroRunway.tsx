import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MacroRunwayProps {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const MacroRunway = ({ consumed, targets }: MacroRunwayProps) => {
  const calculateRemaining = (consumed: number, target: number) => {
    return Math.max(0, target - consumed);
  };

  const calculatePercentage = (consumed: number, target: number) => {
    return Math.min(100, (consumed / target) * 100);
  };

  const getStatus = (consumed: number, target: number) => {
    const percentage = (consumed / target) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'close';
    return 'good';
  };

  const macros = [
    {
      name: 'Calories',
      consumed: consumed.calories,
      target: targets.calories,
      unit: 'kcal',
      color: 'from-primary to-accent',
    },
    {
      name: 'Protein',
      consumed: consumed.protein,
      target: targets.protein,
      unit: 'g',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Carbs',
      consumed: consumed.carbs,
      target: targets.carbs,
      unit: 'g',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Fats',
      consumed: consumed.fats,
      target: targets.fats,
      unit: 'g',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Today's Macro Runway</h3>
        <Badge variant="secondary" className="ml-auto">Live</Badge>
      </div>

      <div className="space-y-6">
        {macros.map((macro) => {
          const remaining = calculateRemaining(macro.consumed, macro.target);
          const percentage = calculatePercentage(macro.consumed, macro.target);
          const status = getStatus(macro.consumed, macro.target);

          return (
            <div key={macro.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{macro.name}</span>
                  {status === 'over' && (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                  {status === 'close' && (
                    <TrendingDown className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    <span className={status === 'over' ? 'text-destructive' : ''}>
                      {macro.consumed}
                    </span>
                    <span className="text-muted-foreground"> / {macro.target} {macro.unit}</span>
                  </p>
                  {status === 'over' ? (
                    <p className="text-xs text-destructive">
                      {macro.consumed - macro.target} {macro.unit} over
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {remaining} {macro.unit} remaining
                    </p>
                  )}
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={`h-3 ${status === 'over' ? 'bg-destructive/20' : ''}`}
              />
              {status === 'over' && (
                <p className="text-xs text-destructive">
                  Consider lighter options for remaining meals
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">
          Runway updates in real-time as you log meals
        </p>
      </div>
    </Card>
  );
};
