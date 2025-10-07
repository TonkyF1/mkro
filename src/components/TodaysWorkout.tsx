import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dumbbell, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  tempo?: string;
  rest_sec: number;
  notes?: string;
}

interface WorkoutData {
  session_name: string;
  focus: string;
  time_min: number;
  rpe_goal: number;
  exercises: Exercise[];
}

interface TodaysWorkoutProps {
  workout: WorkoutData | null;
  onComplete?: () => void;
}

export const TodaysWorkout = ({ workout, onComplete }: TodaysWorkoutProps) => {
  if (!workout) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Dumbbell className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Rest day - no workout scheduled</p>
        </CardContent>
      </Card>
    );
  }

  const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{workout.session_name}</CardTitle>
            <CardDescription>{workout.focus}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            Today
          </Badge>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{workout.time_min} min</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>RPE {workout.rpe_goal}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.length > 0 ? (
          <>
            <div className="space-y-2">
              {exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background/80 backdrop-blur rounded-lg border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.tempo && ` • ${exercise.tempo} tempo`}
                        {exercise.rest_sec > 0 && ` • ${exercise.rest_sec}s rest`}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {onComplete && (
              <Button onClick={onComplete} className="w-full" size="lg">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No exercises defined for today
          </p>
        )}
      </CardContent>
    </Card>
  );
};
