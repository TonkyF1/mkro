import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, Apple, Brain, Calendar, TrendingUp, Target, 
  Flame, Award, ChevronRight, Sparkles, Activity, Utensils
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data - in real app this would come from Supabase
const weeklyProgressData = [
  { day: 'Mon', calories: 2100, protein: 150 },
  { day: 'Tue', calories: 2300, protein: 165 },
  { day: 'Wed', calories: 2000, protein: 145 },
  { day: 'Thu', calories: 2200, protein: 160 },
  { day: 'Fri', calories: 2150, protein: 155 },
  { day: 'Sat', calories: 2400, protein: 170 },
  { day: 'Sun', calories: 2250, protein: 158 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [greeting, setGreeting] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');

  const quotes = [
    "Your only limit is you.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Don't stop when you're tired. Stop when you're done.",
    "Success doesn't just find you. You have to go out and get it.",
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const todayCalories = 1850;
  const calorieGoal = 2200;
  const calorieProgress = (todayCalories / calorieGoal) * 100;

  const todayProtein = 125;
  const proteinGoal = profile?.target_protein || 150;
  const proteinProgress = (todayProtein / proteinGoal) * 100;

  const streakDays = 7;
  const workoutsThisWeek = 4;
  const mealsLogged = 18;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 space-y-8 pb-12">
        {/* Hero Greeting */}
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black mb-2">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient-shift">
                      {greeting}, {profile?.name || 'Champion'}!
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground italic mb-4">
                    "{motivationalQuote}"
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold">{streakDays} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-bold">Level {Math.floor(mealsLogged / 10) + 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="h-20 flex flex-col gap-1 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] group"
                  onClick={() => navigate('/coach')}
                >
                  <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">AI Coach</span>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-20 flex flex-col gap-1 hover:bg-accent/10 group"
                  onClick={() => navigate('/exercise')}
                >
                  <Dumbbell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Workout</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Today's Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-lg font-bold">
                    {todayCalories} / {calorieGoal}
                  </span>
                </div>
                <Progress value={calorieProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {calorieGoal - todayCalories} calories remaining
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-lg font-bold">
                    {todayProtein}g / {proteinGoal}g
                  </span>
                </div>
                <Progress value={proteinProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {proteinGoal - todayProtein}g protein remaining
                </p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600"
                onClick={() => navigate('/nutrition')}
              >
                <Utensils className="w-4 h-4 mr-2" />
                Log Food
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                This Week's Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-background/50">
                  <p className="text-3xl font-black">{workoutsThisWeek}</p>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-background/50">
                  <p className="text-3xl font-black">{mealsLogged}</p>
                  <p className="text-xs text-muted-foreground">Meals</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-background/50">
                  <p className="text-3xl font-black">95%</p>
                  <p className="text-xs text-muted-foreground">Goal Rate</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background/50">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={weeklyProgressData}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Weekly calorie trend
                </p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                onClick={() => navigate('/exercise')}
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover:bg-accent/10 hover:border-primary group"
                onClick={() => navigate('/recipes')}
              >
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-bold">Browse Recipes</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover:bg-accent/10 hover:border-primary group"
                onClick={() => navigate('/planner')}
              >
                <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold">Meal Planner</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover:bg-accent/10 hover:border-primary group"
                onClick={() => navigate('/reports')}
              >
                <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold">View Reports</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover:bg-accent/10 hover:border-primary group"
                onClick={() => navigate('/profile')}
              >
                <Target className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="font-bold">Update Goals</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Coach Suggestions */}
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              AI Coach Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-background/50 border border-emerald-500/20">
              <p className="font-semibold mb-2">🎯 You're on track this week!</p>
              <p className="text-sm text-muted-foreground">
                You've completed {workoutsThisWeek} workouts and stayed within your calorie goals {Math.floor((workoutsThisWeek / 7) * 100)}% of the time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background/50 border border-blue-500/20">
              <p className="font-semibold mb-2">💪 Strength Progress</p>
              <p className="text-sm text-muted-foreground">
                Your bench press has increased by 15 lbs this month. Keep up the progressive overload!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background/50 border border-purple-500/20">
              <p className="font-semibold mb-2">🥗 Nutrition Tip</p>
              <p className="text-sm text-muted-foreground">
                Consider adding more protein to your breakfast to better distribute your macros throughout the day.
              </p>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-[var(--shadow-glow-primary)] group"
              onClick={() => navigate('/coach')}
            >
              <Brain className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Talk to AI Coach
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
