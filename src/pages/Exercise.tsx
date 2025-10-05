import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, TrendingUp, Flame, Activity, Loader2, Trash2, Plus, Calendar as CalendarIcon, Timer } from 'lucide-react';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { WorkoutTimer } from '@/components/WorkoutTimer';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { Crown, PlayCircle, Lock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ManualWorkout {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
}

const Exercise = () => {
  const { trainingPlan, loading, fetchPlans } = useWeeklyPlans();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  const [manualWorkouts, setManualWorkouts] = useState<ManualWorkout[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('cardio');
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutCalories, setWorkoutCalories] = useState('200');

  // Load completed days from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('completed_workout_days');
    if (stored) {
      try {
        setCompletedDays(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading completed days:', e);
      }
    }
  }, []);

  // Load manual workouts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('manual_workouts');
    if (stored) {
      try {
        setManualWorkouts(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading manual workouts:', e);
      }
    }
  }, []);

  const handleToggleComplete = (day: string) => {
    const newCompleted = { ...completedDays };
    if (newCompleted[day]) {
      delete newCompleted[day];
      toast({ title: 'Unmarked', description: `${day} marked as incomplete.` });
    } else {
      newCompleted[day] = true;
      toast({ title: 'Completed!', description: `${day} workout marked as complete.` });
    }
    
    setCompletedDays(newCompleted);
    localStorage.setItem('completed_workout_days', JSON.stringify(newCompleted));
  };

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
      
      // Also remove from completed days
      const newCompleted = { ...completedDays };
      delete newCompleted[day];
      setCompletedDays(newCompleted);
      localStorage.setItem('completed_workout_days', JSON.stringify(newCompleted));
      
      toast({ title: 'Deleted', description: `Removed ${day} workout.` });
      fetchPlans();
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete workout day.' });
    }
  };

  const addManualWorkout = () => {
    if (!workoutName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a workout name.' });
      return;
    }

    const newWorkout: ManualWorkout = {
      id: crypto.randomUUID(),
      name: workoutName,
      type: workoutType,
      duration: parseInt(workoutDuration),
      calories: parseInt(workoutCalories),
      date: new Date().toISOString(),
    };

    const updated = [...manualWorkouts, newWorkout];
    setManualWorkouts(updated);
    localStorage.setItem('manual_workouts', JSON.stringify(updated));

    // Reset form
    setWorkoutName('');
    setWorkoutType('cardio');
    setWorkoutDuration('30');
    setWorkoutCalories('200');

    toast({ title: 'Logged!', description: 'Workout added to manual log.' });
  };

  const deleteManualWorkout = (id: string) => {
    const updated = manualWorkouts.filter(w => w.id !== id);
    setManualWorkouts(updated);
    localStorage.setItem('manual_workouts', JSON.stringify(updated));
    toast({ title: 'Deleted', description: 'Workout removed from log.' });
  };

  const getTodayWorkouts = () => {
    const today = new Date().toDateString();
    return manualWorkouts.filter(w => new Date(w.date).toDateString() === today);
  };

  const getThisWeekWorkouts = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    return manualWorkouts.filter(w => new Date(w.date) >= startOfWeek);
  };

  // Calculate weekly stats from completed AI plan days
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = trainingPlan?.days ? Object.keys(trainingPlan.days).length : 0;

  // Calculate manual workout stats
  const weekWorkouts = getThisWeekWorkouts();
  const manualWorkoutCount = weekWorkouts.length;
  const manualCalories = weekWorkouts.reduce((sum, w) => sum + w.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Exercise Tracker
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Track AI plans or log manual workouts</p>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI Plan Progress</p>
                  <p className="text-3xl font-black">{completedCount}/{totalDays} days</p>
                </div>
              </div>
            </div>
            <div className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Manual Logs</p>
                  <p className="text-3xl font-black">{manualWorkoutCount} workouts</p>
                </div>
              </div>
            </div>
            <div 
              className="group relative p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 border-2 border-pink-500/30 dark:border-pink-500/30 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              onClick={() => navigate('/timer')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Timer className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Workout Timer</p>
                  <p className="text-3xl font-black">Open Timer →</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ai-plan" className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2">
            <TabsTrigger value="ai-plan">
              <CalendarIcon className="w-4 h-4 mr-2" />
              AI Plan
            </TabsTrigger>
            <TabsTrigger value="manual-log">
              <Plus className="w-4 h-4 mr-2" />
              Manual Log
            </TabsTrigger>
          </TabsList>

          {/* AI Plan Tab */}
          <TabsContent value="ai-plan" className="mt-6">
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
                  {DAYS.map((day) => {
                    const dayPlan = trainingPlan.days[day];
                    if (!dayPlan) return null;
                    
                    return (
                      <Card key={day} className="p-4 bg-card border-primary/10 hover:border-primary/30 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{day}</h3>
                              <p className="text-sm text-primary font-semibold">{dayPlan.focus}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id={`complete-${day}`}
                                  checked={!!completedDays[day]}
                                  onCheckedChange={() => handleToggleComplete(day)}
                                  aria-label={`Mark ${day} as complete`}
                                />
                                <label htmlFor={`complete-${day}`} className="text-xs text-muted-foreground cursor-pointer">
                                  Done
                                </label>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteDay(day)} aria-label={`Delete ${day} workout`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {dayPlan.exercises && dayPlan.exercises.length > 0 && (
                            <div className="space-y-1.5">
                                {dayPlan.exercises.map((ex: any, idx: number) => (
                                  <div key={idx} className="text-sm p-2 bg-muted/50 rounded">
                                    <div className="font-medium">{ex.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {ex.sets} sets × {ex.reps} reps
                                      {ex.rest_sec && ` • ${ex.rest_sec}s rest`}
                                    </div>
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
            ) : (
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No Training Plan Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Visit MKRO Coach to get a personalized AI-generated training plan.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/coach')} variant="default" size="lg">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Go to MKRO Coach
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Manual Log Tab */}
          <TabsContent value="manual-log" className="mt-6 space-y-6">
            {/* Premium Workout Library */}
            {isPremium && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Premium Workout Library</h2>
                      <p className="text-sm text-muted-foreground">Expert-led video workouts</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group relative p-4 bg-background rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-purple-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-bold mb-1">HIIT Blast - 20 Min</h3>
                      <p className="text-sm text-muted-foreground mb-2">High-intensity fat burning workout</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Cardio</Badge>
                        <Badge variant="secondary">Advanced</Badge>
                      </div>
                    </div>

                    <div className="group relative p-4 bg-background rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-bold mb-1">Strength Builder - 30 Min</h3>
                      <p className="text-sm text-muted-foreground mb-2">Full body strength training</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Strength</Badge>
                        <Badge variant="secondary">Intermediate</Badge>
                      </div>
                    </div>

                    <div className="group relative p-4 bg-background rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-emerald-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-bold mb-1">Yoga Flow - 25 Min</h3>
                      <p className="text-sm text-muted-foreground mb-2">Flexibility and mindfulness</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Flexibility</Badge>
                        <Badge variant="secondary">All Levels</Badge>
                      </div>
                    </div>

                    <div className="group relative p-4 bg-background rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-amber-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-bold mb-1">Core Crusher - 15 Min</h3>
                      <p className="text-sm text-muted-foreground mb-2">Targeted abs & core workout</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Core</Badge>
                        <Badge variant="secondary">Intermediate</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Workout Library - Locked for Free Users */}
            {!isPremium && (
              <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border-slate-500/20">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-500/20 mx-auto mb-4 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Premium Workout Library</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Unlock access to expert-led video workouts covering HIIT, strength training, yoga, and more.
                  </p>
                  <Button 
                    onClick={() => navigate('/premium')}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Add Workout Form */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Log New Workout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workout Name</label>
                  <Input 
                    placeholder="e.g., Morning Run" 
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={workoutType} onValueChange={setWorkoutType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calories Burned</label>
                  <Input 
                    type="number" 
                    placeholder="200" 
                    value={workoutCalories}
                    onChange={(e) => setWorkoutCalories(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addManualWorkout} className="mt-4 w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Log Workout
              </Button>
            </Card>

            {/* Today's Workouts */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Today's Workouts</h3>
              {getTodayWorkouts().length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No workouts logged today</p>
              ) : (
                <div className="space-y-2">
                  {getTodayWorkouts().map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium">{workout.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workout.type} • {workout.duration}min • {workout.calories}kcal
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteManualWorkout(workout.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* This Week's History */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">This Week's History</h3>
              {getThisWeekWorkouts().length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No workouts logged this week</p>
              ) : (
                <div className="space-y-2">
                  {getThisWeekWorkouts().map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium">{workout.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workout.type} • {workout.duration}min • {workout.calories}kcal • {new Date(workout.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteManualWorkout(workout.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Exercise;