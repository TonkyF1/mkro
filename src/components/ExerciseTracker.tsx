import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Dumbbell, Bot } from 'lucide-react';
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

const ExerciseTracker = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [aiWorkoutPlan, setAiWorkoutPlan] = useState<ParsedWorkout[]>([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'cardio',
    duration: 0,
    calories: 0,
  });

  // Load AI workout plan
  useEffect(() => {
    const loadAIWorkoutPlan = () => {
      const stored = localStorage.getItem('mkro_workout_plan');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAiWorkoutPlan(parsed);
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
      calories: workout.calories,
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
    toast({
      title: "AI Plan Cleared",
      description: "The MKRO Coach workout plan has been removed.",
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
    <div className="space-y-6">
      {/* AI Workout Plan Banner */}
      {aiWorkoutPlan.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">MKRO Coach Workout Plan Available</h3>
                <p className="text-sm text-muted-foreground">
                  {aiWorkoutPlan.length} exercises recommended for you
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearAIWorkoutPlan}>
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiWorkoutPlan.map((workout, idx) => (
              <Card key={idx} className="p-3 bg-background">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">{workout.type}</Badge>
                    <p className="font-medium text-sm">{workout.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {workout.duration} min
                      {workout.calories && ` • ${workout.calories} cal`}
                      {workout.day && ` • ${workout.day}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addAIWorkoutToLog(workout)}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

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
    </div>
  );
};

export default ExerciseTracker;