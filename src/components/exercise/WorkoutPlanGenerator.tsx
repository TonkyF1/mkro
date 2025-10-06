import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Brain, Sparkles, Target, Calendar, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbells', 'Kettlebells', 'Resistance Bands', 
  'Pull-up Bar', 'Bench', 'Squat Rack', 'Cable Machine', 'Machines', 'Bodyweight Only'
];

const WORKOUT_GOALS = [
  { value: 'strength', label: 'Build Strength', description: 'Focus on compound lifts and progressive overload' },
  { value: 'hypertrophy', label: 'Build Muscle', description: 'Optimize muscle growth with volume training' },
  { value: 'fat_loss', label: 'Lose Fat', description: 'High volume with shorter rest periods' },
  { value: 'athletic', label: 'Athletic Performance', description: 'Power and explosiveness training' },
  { value: 'endurance', label: 'Build Endurance', description: 'Higher reps with moderate weight' }
];

export const WorkoutPlanGenerator: React.FC<{ onPlanGenerated: (plan: any) => void }> = ({ onPlanGenerated }) => {
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const toggleEquipment = (item: string) => {
    setEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const generatePlan = async () => {
    if (!fitnessLevel || !goal || !daysPerWeek || !sessionDuration || equipment.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all fields to generate your plan'
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (in real app, this would call Lovable AI)
    setTimeout(() => {
      const samplePlan = generateSamplePlan(goal, daysPerWeek);
      onPlanGenerated(samplePlan);
      setIsGenerating(false);
      toast({
        title: 'Plan Generated! 🎉',
        description: 'Your personalized workout plan is ready'
      });
    }, 2000);
  };

  const generateSamplePlan = (goal: string, days: string) => {
    const daysNum = parseInt(days);
    const exercises = getExercisesForGoal(goal);
    
    const plan = {
      name: `${WORKOUT_GOALS.find(g => g.value === goal)?.label} Program`,
      duration: '4-8 weeks',
      goal,
      daysPerWeek: daysNum,
      exercises
    };

    return plan;
  };

  const getExercisesForGoal = (goal: string) => {
    const baseExercises = [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: 120, targetMuscles: ['Chest', 'Triceps', 'Shoulders'], notes: 'Keep shoulder blades retracted' },
      { name: 'Barbell Back Squat', sets: 4, reps: '8-10', rest: 180, targetMuscles: ['Quads', 'Glutes'], notes: 'Descend until thighs parallel' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: 120, targetMuscles: ['Hamstrings', 'Glutes', 'Back'], notes: 'Keep slight bend in knees' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: 90, targetMuscles: ['Back', 'Biceps'], notes: 'Full range of motion' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', rest: 120, targetMuscles: ['Shoulders', 'Triceps'], notes: 'Avoid arching back' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: 90, targetMuscles: ['Back', 'Biceps'], notes: 'Pull elbow high' }
    ];

    if (goal === 'hypertrophy') {
      return baseExercises.map(ex => ({ ...ex, sets: ex.sets + 1, reps: '10-12' }));
    } else if (goal === 'strength') {
      return baseExercises.map(ex => ({ ...ex, reps: '4-6', rest: ex.rest + 60 }));
    } else if (goal === 'fat_loss') {
      return baseExercises.map(ex => ({ ...ex, reps: '12-15', rest: ex.rest - 30 }));
    }

    return baseExercises;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Workout Plan Generator</CardTitle>
              <p className="text-sm text-muted-foreground">Get a personalized training program</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fitness Level</label>
              <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Goal</label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_GOALS.map(g => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Days Per Week</label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="How many days?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration</label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="How long?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Available Equipment</label>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {EQUIPMENT_OPTIONS.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-2 p-3 rounded-2xl bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => toggleEquipment(item)}
                >
                  <Checkbox
                    checked={equipment.includes(item)}
                    onCheckedChange={() => toggleEquipment(item)}
                  />
                  <label className="text-sm cursor-pointer flex-1">{item}</label>
                </div>
              ))}
            </div>
          </div>

          {goal && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium mb-1">
                {WORKOUT_GOALS.find(g => g.value === goal)?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {WORKOUT_GOALS.find(g => g.value === goal)?.description}
              </p>
            </div>
          )}

          <Button
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] group"
            onClick={generatePlan}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Generate AI Workout Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
