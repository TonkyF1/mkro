import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dumbbell, TrendingUp, Calendar, Target, Play, 
  Sparkles, BookOpen, BarChart3, Zap
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { StatsCard } from '@/components/exercise/StatsCard';
import { ActiveWorkout } from '@/components/exercise/ActiveWorkout';
import { ExerciseLibrary } from '@/components/exercise/ExerciseLibrary';
import { ProgressDashboard } from '@/components/exercise/ProgressDashboard';
import { WorkoutPlanGenerator } from '@/components/exercise/WorkoutPlanGenerator';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const Exercise = () => {
  const { profile } = useUserProfile();
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [streakCount, setStreakCount] = useState(7);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(4);
  const [totalWorkouts, setTotalWorkouts] = useState(24);
  const [personalRecords, setPersonalRecords] = useState(3);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickWorkouts = [
    {
      id: 'push',
      name: 'Push Day',
      duration: '45 min',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: 120, targetMuscles: ['Chest', 'Triceps', 'Shoulders'], notes: 'Keep shoulder blades retracted throughout' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 90, targetMuscles: ['Upper Chest', 'Shoulders'], notes: 'Focus on upper chest contraction' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', rest: 120, targetMuscles: ['Shoulders', 'Triceps'], notes: 'Avoid arching lower back' },
        { name: 'Tricep Dips', sets: 3, reps: '10-15', rest: 60, targetMuscles: ['Triceps', 'Chest'], notes: 'Lean forward slightly for chest emphasis' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: 60, targetMuscles: ['Shoulders'], notes: 'Control the weight, don\'t swing' }
      ],
      gradient: 'from-purple-500/20 to-pink-600/20',
      icon: Dumbbell
    },
    {
      id: 'pull',
      name: 'Pull Day',
      duration: '45 min',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '6-8', rest: 180, targetMuscles: ['Back', 'Hamstrings', 'Glutes'], notes: 'Keep bar close to body throughout lift' },
        { name: 'Pull-ups', sets: 4, reps: '8-12', rest: 120, targetMuscles: ['Back', 'Biceps'], notes: 'Full range of motion' },
        { name: 'Barbell Rows', sets: 3, reps: '8-10', rest: 90, targetMuscles: ['Back', 'Biceps'], notes: 'Pull to lower chest' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: 60, targetMuscles: ['Rear Delts', 'Upper Back'], notes: 'Pull to face level' },
        { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: 60, targetMuscles: ['Biceps'], notes: 'No swinging or momentum' }
      ],
      gradient: 'from-blue-500/20 to-cyan-600/20',
      icon: TrendingUp
    },
    {
      id: 'legs',
      name: 'Leg Day',
      duration: '50 min',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10', rest: 180, targetMuscles: ['Quads', 'Glutes'], notes: 'Descend until thighs parallel to ground' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: 120, targetMuscles: ['Hamstrings', 'Glutes'], notes: 'Feel the hamstring stretch' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12', rest: 90, targetMuscles: ['Quads', 'Glutes'], notes: 'per leg' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: 90, targetMuscles: ['Quads', 'Glutes'], notes: 'Full range of motion' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: 60, targetMuscles: ['Hamstrings'], notes: 'Squeeze at the top' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: 60, targetMuscles: ['Calves'], notes: 'Full stretch and contraction' }
      ],
      gradient: 'from-emerald-500/20 to-teal-600/20',
      icon: Zap
    }
  ];

  if (activeWorkout) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 max-w-4xl mx-auto py-8">
          <ActiveWorkout
            workout={activeWorkout}
            onComplete={() => {
              setActiveWorkout(null);
              setTotalWorkouts(prev => prev + 1);
              setWeeklyWorkouts(prev => prev + 1);
            }}
            onExit={() => setActiveWorkout(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 space-y-8 pb-12">
        {/* Hero Section */}
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient-shift">
                      {greeting}, {profile?.name || 'Athlete'}!
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Ready to crush your workout today? 💪
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">🔥</div>
                    <div>
                      <p className="text-2xl font-black">{streakCount}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">⭐</div>
                    <div>
                      <p className="text-2xl font-black">{personalRecords}</p>
                      <p className="text-xs text-muted-foreground">New PRs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  size="lg"
                  className="h-24 flex flex-col gap-1 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] group"
                  onClick={() => {
                    if (generatedPlan) {
                      setActiveWorkout(generatedPlan);
                    }
                  }}
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Start AI Plan</span>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-24 flex flex-col gap-1 hover:bg-accent/10 group"
                >
                  <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Quick Log</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="This Week"
            value={weeklyWorkouts}
            subtitle="Workouts completed"
            icon={Calendar}
            gradient="from-blue-500/10 to-cyan-600/10"
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="This Month"
            value={totalWorkouts}
            subtitle="Total workouts"
            icon={Dumbbell}
            gradient="from-purple-500/10 to-pink-600/10"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Volume"
            value="285K"
            subtitle="lbs lifted"
            icon={TrendingUp}
            gradient="from-emerald-500/10 to-teal-600/10"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="PRs Broken"
            value={personalRecords}
            subtitle="This month"
            icon={Target}
            gradient="from-orange-500/10 to-red-600/10"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="workouts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="workouts" className="flex flex-col sm:flex-row gap-2 py-3">
              <Dumbbell className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Workouts</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex flex-col sm:flex-row gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Library</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex flex-col sm:flex-row gap-2 py-3">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="ai-plan" className="flex flex-col sm:flex-row gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm">AI Plan</span>
            </TabsTrigger>
          </TabsList>

          {/* Quick Workouts */}
          <TabsContent value="workouts" className="space-y-6">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Start Workouts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Jump right into a proven workout routine
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {quickWorkouts.map(workout => (
                    <Card
                      key={workout.id}
                      className={`group cursor-pointer hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br ${workout.gradient} hover:shadow-xl`}
                      onClick={() => setActiveWorkout(workout)}
                    >
                      <CardContent className="p-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <workout.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {workout.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {workout.exercises.length} exercises • {workout.duration}
                        </p>
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] group-hover:scale-105 transition-transform"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Workout
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercise Library */}
          <TabsContent value="library">
            <ExerciseLibrary />
          </TabsContent>

          {/* Progress Dashboard */}
          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>

          {/* AI Plan Generator */}
          <TabsContent value="ai-plan">
            <WorkoutPlanGenerator onPlanGenerated={(plan) => {
              setGeneratedPlan(plan);
              setActiveWorkout(plan);
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Exercise;
