import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Utensils, 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  Calendar,
  Zap,
  ArrowRight,
  Flame,
  Droplet,
  Target,
  Trophy
} from 'lucide-react';
import { MacroRunway } from '@/components/MacroRunway';
import { ChallengeCard } from '@/components/ChallengeCard';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChallenges } from '@/hooks/useChallenges';
import { useUserStats } from '@/hooks/useUserStats';
import { supabase } from '@/integrations/supabase/client';
import { calculateDailyCalories, calculateMacroGrams } from '@/utils/macroCalculations';
import { useToast } from '@/hooks/use-toast';

interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { activeChallenges } = useChallenges();
  const { stats } = useUserStats();
  const { toast } = useToast();
  const [todayTotals, setTodayTotals] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodaysMeals();
    }
  }, [user]);

  const fetchTodaysMeals = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('meal_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today)
      .lt('created_at', new Date(Date.now() + 86400000).toISOString());

    if (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const totals = data.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fats: acc.fats + (meal.fats || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );
      setTodayTotals(totals);
    }
    setLoading(false);
  };

  // Calculate targets
  const targets = profile ? {
    calories: profile.target_protein && profile.target_carbs && profile.target_fats 
      ? calculateDailyCalories(
          profile.weight || 70,
          profile.weight_unit || 'kg',
          profile.goal || 'maintenance',
          profile.activity_level as any
        )
      : 2000,
    protein: profile.target_protein 
      ? calculateMacroGrams(2000, profile.target_protein, 0, 0).protein 
      : 150,
    carbs: profile.target_carbs 
      ? calculateMacroGrams(2000, 0, profile.target_carbs, 0).carbs 
      : 200,
    fats: profile.target_fats 
      ? calculateMacroGrams(2000, 0, 0, profile.target_fats).fats 
      : 65,
  } : {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  };

  const quickActions = [
    {
      icon: Utensils,
      title: 'Log Meal',
      description: 'Quick scan or manual entry',
      color: 'from-emerald-500 to-teal-600',
      action: () => navigate('/nutrition'),
    },
    {
      icon: Dumbbell,
      title: 'Start Workout',
      description: "Today's training plan",
      color: 'from-rose-500 to-pink-600',
      action: () => navigate('/exercise'),
    },
    {
      icon: Brain,
      title: 'Ask Coach',
      description: 'AI guidance & tips',
      color: 'from-purple-500 to-violet-600',
      action: () => navigate('/coach'),
    },
  ];

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-muted-foreground mb-6">Access your dashboard by signing in</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.name || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your health snapshot for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTotals.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTotals.protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTotals.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTotals.fats}g</p>
              <p className="text-xs text-muted-foreground">Fats</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Macro Runway */}
      <MacroRunway consumed={todayTotals} targets={targets} />

      {/* Active Challenge */}
      {activeChallenges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Challenge</h2>
            <Button variant="link" onClick={() => navigate('/challenges')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <ChallengeCard challenge={activeChallenges[0]} compact />
        </div>
      )}

      {/* XP Progress */}
      {stats && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Level {stats.level}</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.total_xp} XP • {stats.challenges_completed} challenges completed
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/challenges')}>
              View Challenges
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="p-6 cursor-pointer hover:shadow-lg transition-all group"
              onClick={action.action}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Plan Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Today's Plan</h3>
          </div>
          <Button variant="link" onClick={() => navigate('/planner')}>
            View Full Week <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Nutrition</p>
            <p className="text-xs text-muted-foreground">
              You're on track! {targets.calories - todayTotals.calories} calories remaining
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Training</p>
            <p className="text-xs text-muted-foreground">
              Upper body strength • 45 min
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
