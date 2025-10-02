import React from 'react';
import ExerciseTracker from '@/components/ExerciseTracker';
import { Card } from '@/components/ui/card';
import { Dumbbell, TrendingUp, Flame, Activity, Loader2 } from 'lucide-react';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Exercise = () => {
  const { trainingPlan, loading } = useWeeklyPlans();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Exercise Tracker
              </h1>
              <p className="text-muted-foreground">Track your workouts and build strength</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">0 workouts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="text-2xl font-bold">0 kcal</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Days</p>
                  <p className="text-2xl font-bold">0 days</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Weekly Training Plan from Coach */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your training plan...</p>
          </Card>
        ) : trainingPlan?.days ? (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-primary" />
              Weekly Training Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS.map(day => {
                const dayPlan = trainingPlan.days[day];
                if (!dayPlan) return null;
                
                return (
                  <Card key={day} className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <h3 className="font-bold text-lg mb-1">{day}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{dayPlan.focus}</p>
                    <div className="space-y-1 text-sm">
                      {dayPlan.exercises?.map((ex: any, idx: number) => (
                        <div key={idx} className="text-muted-foreground">
                          {ex.name} {ex.reps}x{ex.sets}
                        </div>
                      ))}
                    </div>
                    {dayPlan.warmup && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                        Warmup: {dayPlan.warmup}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </Card>
        ) : null}

        {/* Exercise Tracker Component */}
        <ExerciseTracker />
      </div>
    </div>
  );
};

export default Exercise;
