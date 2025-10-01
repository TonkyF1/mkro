import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Dumbbell, Bot, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ParsedWorkout } from '@/utils/coachResponseParser';

interface Exercise {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories?: number;
  date: string;
}

interface WeeklyWorkout {
  day: string;
  exercises: Exercise[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ExerciseTracker = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyWorkout[]>(
    DAYS.map(day => ({ day, exercises: [] }))
  );
  const [aiWorkoutPlan, setAiWorkoutPlan] = useState<ParsedWorkout[]>([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'cardio',
    duration: 0,
    calories: 0,
  });

  // Load AI workout plan and auto-populate weekly plan
  useEffect(() => {
    const loadAIWorkoutPlan = () => {
      const stored = localStorage.getItem('mkro_workout_plan');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ParsedWorkout[];
          setAiWorkoutPlan(parsed);
          
          // Auto-populate weekly plan from AI recommendations
          // Group by day number first
          if (parsed.length > 0) {
            const newWeeklyPlan = DAYS.map((day, idx) => ({ 
              day: `Day ${idx + 1}`, 
              exercises: [] as Exercise[] 
            }));
            
            parsed.forEach((workout, index) => {
              let dayIndex = -1;
              
              // Use dayNumber if available, otherwise try day name
              if (workout.dayNumber && workout.dayNumber >= 1 && workout.dayNumber <= 7) {
                dayIndex = workout.dayNumber - 1;
              } else if (workout.day) {
                // Try to extract day number from day string like "Day 1", "Day 2"
                const dayNumMatch = workout.day.match(/day\s*(\d+)/i);
                if (dayNumMatch) {
                  const num = parseInt(dayNumMatch[1]);
                  if (num >= 1 && num <= 7) {
                    dayIndex = num - 1;
                  }
                }
              }
              
              // If no day match, distribute sequentially (max 7 days)
              if (dayIndex === -1 && index < 7) {
                dayIndex = index;
              }
              
              // Add to weekly plan if we found a valid day
              if (dayIndex >= 0 && dayIndex < 7) {
                const exercise: Exercise = {
                  id: `ai-${Date.now()}-${index}`,
                  name: workout.name,
                  type: workout.type,
                  duration: workout.duration,
                  date: '', // Will be set when logging
                };
                newWeeklyPlan[dayIndex].exercises.push(exercise);
              }
            });
            
            setWeeklyPlan(newWeeklyPlan);
          }
        } catch (e) {
          console.error('Error parsing AI workout plan:', e);
        }
      }
    };

    loadAIWorkoutPlan();
    window.addEventListener('storage', loadAIWorkoutPlan);
    
    return () => {
      window.removeEventListener('storage', loadAIWorkoutPlan);
    };
  }, []);

  const addAIWorkoutToLog = (workout: ParsedWorkout) => {
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: workout.name,
      type: workout.type,
      duration: workout.duration,
      date: new Date().toISOString().split('T')[0],
    };

    setExercises([...exercises, exercise]);
    toast({
      title: 'Exercise Added',
      description: `${exercise.name} has been logged from your MKRO plan!`,
    });
  };

  const clearAIWorkoutPlan = () => {
    localStorage.removeItem('mkro_workout_plan');
    setAiWorkoutPlan([]);
    setWeeklyPlan(DAYS.map(day => ({ day, exercises: [] })));
    toast({
      title: "AI Plan Cleared",
      description: "The MKRO Coach workout plan has been removed.",
    });
  };

  const addExerciseToWeeklyPlan = (dayIndex: number) => {
    if (!newExercise.name || newExercise.duration <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise,
      date: '',
    };

    const updatedPlan = [...weeklyPlan];
    updatedPlan[dayIndex].exercises.push(exercise);
    setWeeklyPlan(updatedPlan);
    setNewExercise({ name: '', type: 'cardio', duration: 0, calories: 0 });
    
    toast({
      title: 'Exercise Added to Plan',
      description: `${exercise.name} added to ${DAYS[dayIndex]}'s plan!`,
    });
  };

  const removeFromWeeklyPlan = (dayIndex: number, exerciseId: string) => {
    const updatedPlan = [...weeklyPlan];
    updatedPlan[dayIndex].exercises = updatedPlan[dayIndex].exercises.filter(
      ex => ex.id !== exerciseId
    );
    setWeeklyPlan(updatedPlan);
    toast({
      title: 'Exercise Removed',
      description: 'Exercise removed from weekly plan.',
    });
  };

  const exerciseTypes = [
    'cardio',
    'strength',
    'flexibility',
    'sports',
    'walking',
    'running',
    'cycling',
    'swimming',
    'yoga',
    'pilates',
  ];

  const addExercise = () => {
    if (!newExercise.name || newExercise.duration <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise,
      date: new Date().toISOString().split('T')[0],
    };

    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', type: 'cardio', duration: 0, calories: 0 });
    
    toast({
      title: 'Exercise Added',
      description: `${exercise.name} has been logged successfully!`,
    });
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    toast({
      title: 'Exercise Removed',
      description: 'Exercise has been removed from your log.',
    });
  };

  const getTodayExercises = () => {
    const today = new Date().toISOString().split('T')[0];
    return exercises.filter(ex => ex.date === today);
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekExercises = exercises.filter(ex => ex.date >= weekStartStr);
    const totalDuration = weekExercises.reduce((sum, ex) => sum + ex.duration, 0);
    const totalCalories = weekExercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);
    
    return { totalDuration, totalCalories, count: weekExercises.length };
  };

  const todayExercises = getTodayExercises();
  const weeklyStats = getWeeklyStats();

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="today" className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4" />
          Today's Log
        </TabsTrigger>
        <TabsTrigger value="weekly" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Weekly Plan
        </TabsTrigger>
      </TabsList>

      {/* Today's Log Tab */}
      <TabsContent value="today" className="mt-6 space-y-6">
        {/* Weekly Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Weekly Exercise Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{weeklyStats.count}</p>
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{weeklyStats.totalDuration}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{weeklyStats.totalCalories}</p>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>
          </div>
        </Card>

        {/* Add New Exercise */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Log Exercise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                placeholder="e.g., Morning Run"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="exercise-type">Type</Label>
              <Select 
                value={newExercise.type} 
                onValueChange={(value) => setNewExercise({ ...newExercise, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={newExercise.duration || ''}
                onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="calories">Calories (optional)</Label>
              <Input
                id="calories"
                type="number"
                placeholder="200"
                value={newExercise.calories || ''}
                onChange={(e) => setNewExercise({ ...newExercise, calories: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={addExercise} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </Card>

        {/* Today's Exercises */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Exercises</h3>
          {todayExercises.length > 0 ? (
            <div className="space-y-3">
              {todayExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{exercise.type}</Badge>
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.duration} min {exercise.calories ? `• ${exercise.calories} cal` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No exercises logged today. Start by adding one above!</p>
          )}
        </Card>
      </TabsContent>

      {/* Weekly Plan Tab */}
      <TabsContent value="weekly" className="mt-6 space-y-6">
        {/* AI Workout Plan Banner */}
        {aiWorkoutPlan.length > 0 && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">MKRO Coach Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personalized workout plan has been auto-populated below
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={clearAIWorkoutPlan}>
                Clear
              </Button>
            </div>
          </Card>
        )}

        {/* Weekly Plan Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Weekly Exercise Plan</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {weeklyPlan.map((dayPlan, dayIndex) => {
              const dayTotal = dayPlan.exercises.reduce((sum, ex) => ({
                duration: sum.duration + ex.duration,
              }), { duration: 0 });

              return (
                <Card key={dayPlan.day} className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{dayPlan.day}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {dayTotal.duration > 0 ? `${dayTotal.duration} min` : 'Rest day'}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dayPlan.exercises.length > 0 ? (
                      <div className="space-y-2">
                        {dayPlan.exercises.map((exercise) => (
                          <div key={exercise.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{exercise.type}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromWeeklyPlan(dayIndex, exercise.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="font-medium text-sm">{exercise.name}</div>
                            {exercise.duration > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {exercise.duration} min
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No exercises planned
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ExerciseTracker;