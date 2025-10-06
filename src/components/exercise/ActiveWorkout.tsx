import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, Check, ChevronRight, ChevronLeft, 
  Timer, Dumbbell, RotateCcw, Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  targetMuscles: string[];
  videoUrl?: string;
}

interface WorkoutSession {
  name: string;
  exercises: Exercise[];
}

interface ActiveWorkoutProps {
  workout: WorkoutSession;
  onComplete: () => void;
  onExit: () => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ 
  workout, 
  onComplete, 
  onExit 
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, number[]>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSetsCount = Object.values(completedSets).flat().length;

  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const timer = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            playBeep();
            toast({
              title: "Rest Complete!",
              description: "Ready for next set",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResting, restTimeLeft, toast]);

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const completeSet = () => {
    const key = `${currentExerciseIndex}-${currentSet}`;
    const newCompletedSets = {
      ...completedSets,
      [currentExerciseIndex]: [...(completedSets[currentExerciseIndex] || []), currentSet]
    };
    setCompletedSets(newCompletedSets);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTimeLeft(currentExercise.rest);
      toast({
        title: "Set Complete!",
        description: `Rest for ${currentExercise.rest} seconds`,
      });
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      toast({
        title: "Exercise Complete!",
        description: "Moving to next exercise",
      });
    } else {
      onComplete();
      toast({
        title: "Workout Complete! 🎉",
        description: "Amazing work!",
      });
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{workout.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
              </p>
            </div>
            <Button variant="outline" onClick={onExit}>Exit</Button>
          </div>
          <Progress value={progress} className="mt-4" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedSetsCount} of {totalSets} sets complete
          </p>
        </CardHeader>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <Card className="border-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 animate-pulse">
          <CardContent className="p-8 text-center">
            <Timer className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-5xl font-black mb-2">{restTimeLeft}s</p>
            <p className="text-muted-foreground mb-4">Rest Time</p>
            <Button variant="outline" onClick={skipRest}>
              Skip Rest
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise */}
      {!isResting && (
        <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-black mb-2">
                  {currentExercise.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentExercise.targetMuscles.map(muscle => (
                    <Badge key={muscle} variant="secondary">{muscle}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 rounded-2xl bg-background/50">
                    <p className="text-2xl font-black">{currentSet}/{currentExercise.sets}</p>
                    <p className="text-xs text-muted-foreground">Sets</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-background/50">
                    <p className="text-2xl font-black">{currentExercise.reps}</p>
                    <p className="text-xs text-muted-foreground">Reps</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-background/50">
                    <p className="text-2xl font-black">{currentExercise.rest}s</p>
                    <p className="text-xs text-muted-foreground">Rest</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight (lbs)</label>
                  <Input
                    type="number"
                    placeholder="135"
                    value={weights[`${currentExerciseIndex}-${currentSet}`] || ''}
                    onChange={(e) => setWeights({
                      ...weights,
                      [`${currentExerciseIndex}-${currentSet}`]: e.target.value
                    })}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Reps Done</label>
                  <Input
                    type="number"
                    placeholder={currentExercise.reps}
                    value={reps[`${currentExerciseIndex}-${currentSet}`] || ''}
                    onChange={(e) => setReps({
                      ...reps,
                      [`${currentExerciseIndex}-${currentSet}`]: e.target.value
                    })}
                    className="text-lg"
                  />
                </div>
              </div>

              {currentExercise.notes && (
                <div className="p-4 rounded-2xl bg-background/50">
                  <p className="text-sm font-medium mb-1">Form Tips:</p>
                  <p className="text-sm text-muted-foreground">{currentExercise.notes}</p>
                </div>
              )}

              <Button 
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)]"
                onClick={completeSet}
              >
                <Check className="w-5 h-5 mr-2" />
                Complete Set {currentSet}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (currentExerciseIndex > 0) {
                      setCurrentExerciseIndex(currentExerciseIndex - 1);
                      setCurrentSet(1);
                    }
                  }}
                  disabled={currentExerciseIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (currentExerciseIndex < workout.exercises.length - 1) {
                      setCurrentExerciseIndex(currentExerciseIndex + 1);
                      setCurrentSet(1);
                    }
                  }}
                  disabled={currentExerciseIndex === workout.exercises.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
