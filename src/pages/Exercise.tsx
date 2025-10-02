import React from 'react';
import ExerciseTracker from '@/components/ExerciseTracker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, TrendingUp, Flame, Activity, Loader2, Trash2 } from 'lucide-react';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Exercise = () => {
  const { trainingPlan, loading, fetchPlans } = useWeeklyPlans();
  const { toast } = useToast();

  const handleDeleteDay = async (day: string) => {
    if (!trainingPlan?.id) return;
    try {
      const updatedDays = { ...(trainingPlan.days || {}) } as any;
      delete updatedDays[day];
      const { error } = await supabase
        .from('weekly_training_plans')
        .update({ days: updatedDays })
        .eq('id', trainingPlan.id);
      if (error) throw error;
      toast({ title: 'Deleted', description: `Removed ${day} workout.` });
      fetchPlans();
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete workout day.' });
    }
  };

  const handleDeleteExercise = async (day: string, idx: number) => {
    if (!trainingPlan?.id) return;
    try {
      const updatedDays: any = { ...(trainingPlan.days || {}) };
      const exercises = Array.isArray(updatedDays[day]?.exercises) ? [...updatedDays[day].exercises] : [];
      exercises.splice(idx, 1);
      updatedDays[day] = { ...(updatedDays[day] || {}), exercises };
      const { error } = await supabase
        .from('weekly_training_plans')
        .update({ days: updatedDays })
        .eq('id', trainingPlan.id);
      if (error) throw error;
      toast({ title: 'Deleted', description: `Removed exercise from ${day}.` });
      fetchPlans();
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete exercise.' });
    }
  };

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
        ) : trainingPlan?.days && Object.keys(trainingPlan.days).length > 0 ? (
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Weekly Training Plan</h2>
                <p className="text-sm text-muted-foreground">Generated by MKRO Coach</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAYS.map(day => {
                const dayPlan = trainingPlan.days[day];
                if (!dayPlan) return null;
                
                return (
                  <Card key={day} className="p-4 bg-card border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{day}</h3>
                          <p className="text-sm text-primary font-semibold">{dayPlan.focus}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDay(day)} aria-label={`Delete ${day} workout`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {dayPlan.exercises && dayPlan.exercises.length > 0 && (
                        <div className="space-y-1.5">
                            {dayPlan.exercises.map((ex: any, idx: number) => (
                              <div key={idx} className="text-sm p-2 bg-muted/50 rounded flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-medium">{ex.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {ex.sets} sets × {ex.reps} reps
                                    {ex.rest_sec && ` • ${ex.rest_sec}s rest`}
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteExercise(day, idx)} aria-label="Delete exercise">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                      
                      {dayPlan.warmup && (
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          <span className="font-semibold">Warmup:</span> {dayPlan.warmup}
                        </div>
                      )}
                      
                      {dayPlan.cooldown && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-semibold">Cooldown:</span> {dayPlan.cooldown}
                        </div>
                      )}
                    </div>
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
