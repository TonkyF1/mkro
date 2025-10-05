import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Utensils, Bot, Apple, Droplet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';
import { MealPlanner } from '@/components/MealPlanner';
import { DarkCard } from '@/components/DarkCard';
import { CircularProgress } from '@/components/CircularProgress';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipes } from '@/hooks/useRecipes';
import { ParsedMealPlan } from '@/utils/coachResponseParser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { useMealCompletions } from '@/hooks/useMealCompletions';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const loadMealPlanFromStorage = () => {
  const stored = localStorage.getItem('mealPlan');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return DAYS.map(day => ({ date: day }));
};

const saveMealPlanToStorage = (mealPlan: any) => {
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
};

const NutritionHub = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { recipes } = useRecipes();
  const { toast } = useToast();
  const [mealPlan, setMealPlan] = useState(() => loadMealPlanFromStorage());
  const [aiMealPlan, setAiMealPlan] = useState<ParsedMealPlan[]>([]);
  const { nutritionPlan, fetchPlans, activeWeekStart } = useWeeklyPlans();
  const { weeklyStreak, isMealCompleted, fetchCompletions } = useMealCompletions();

  // Calculate today's completed calories
  const getTodaysDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const calculateTodaysCalories = () => {
    const today = getTodaysDayName();
    const todaysPlan = mealPlan.find(day => day.date === today);
    
    if (!todaysPlan) return 0;

    let totalCalories = 0;
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    mealTypes.forEach(mealType => {
      const meal = todaysPlan[mealType as keyof typeof todaysPlan];
      if (meal && isMealCompleted(today, mealType)) {
        totalCalories += (meal as any)?.calories || 0;
      }
    });

    return totalCalories;
  };

  const todaysCalories = calculateTodaysCalories();

  useEffect(() => {
    const handleStorageUpdate = () => {
      const stored = localStorage.getItem('mealPlan');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMealPlan(parsed);
          }
        } catch (e) {
          console.error("Error parsing mealPlan from localStorage:", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    const reloadMealPlan = () => {
      const updatedPlan = loadMealPlanFromStorage();
      setMealPlan(updatedPlan);
    };

    reloadMealPlan();
    window.addEventListener('focus', reloadMealPlan);
    
    return () => {
      window.removeEventListener('focus', reloadMealPlan);
    };
  }, []);

  // Load plans from database (highest priority)
  useEffect(() => {
    if (nutritionPlan?.days) {
      const daysData = nutritionPlan.days as any;
      const updated = DAYS.map((day, idx) => {
        const dayPlan = daysData[day] || daysData[`Day ${idx + 1}`];
        if (!dayPlan) return { date: day } as any;
        const transformed: any = { date: day };
        const mapMeal = (arr?: any[], category?: string) => {
          if (!arr || arr.length === 0) return undefined;
          const m = arr[0];
          const cost = category === 'breakfast' ? 5 : category === 'lunch' ? 7 : category === 'dinner' ? 10 : 3;
          return {
            id: `${day}-${category}`,
            name: m.title,
            calories: m.kcal,
            protein: m.protein_g,
            carbs: m.carbs_g,
            fats: m.fat_g,
            category,
            ingredients: [],
            instructions: '',
            prepTime: 20,
            servings: 1,
            estimatedCost: cost,
            dietaryTags: []
          };
        };
        transformed.breakfast = mapMeal(dayPlan.Breakfast, 'breakfast');
        transformed.lunch = mapMeal(dayPlan.Lunch, 'lunch');
        transformed.dinner = mapMeal(dayPlan.Dinner, 'dinner');
        transformed.snack = mapMeal(dayPlan.Snacks, 'snack');
        return transformed;
      });
      setMealPlan(updated);
      saveMealPlanToStorage(updated);
    }
  }, [nutritionPlan]);

  // Refresh on save events from coach and meal completions
  useEffect(() => {
    const onUpdate = () => {
      fetchPlans();
      fetchCompletions();
    };
    window.addEventListener('mkro:plans-updated', onUpdate as any);
    window.addEventListener('meal-completion-updated', onUpdate as any);
    return () => {
      window.removeEventListener('mkro:plans-updated', onUpdate as any);
      window.removeEventListener('meal-completion-updated', onUpdate as any);
    };
  }, [fetchPlans, fetchCompletions]);

  const clearAIMealPlan = () => {
    localStorage.removeItem('mkro_meal_plan');
    setAiMealPlan([]);
    setMealPlan(DAYS.map(day => ({ date: day })));
    saveMealPlanToStorage(DAYS.map(day => ({ date: day })));
    toast({
      title: "AI Plan Cleared",
      description: "The MKRO Coach meal plan has been removed.",
    });
  };

  const navigateToCoach = () => {
    navigate('/coach');
  };

  const handleMealPlanUpdate = (updatedPlan: any) => {
    setMealPlan(updatedPlan);
    saveMealPlanToStorage(updatedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Apple className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Nutrition Hub
              </h1>
              <p className="text-muted-foreground">Track your meals and reach your goals</p>
            </div>
          </div>

          {/* Quick Stats with Premium Dark Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DarkCard gradient="linear-gradient(135deg, rgb(139, 92, 246), rgb(99, 102, 241))">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Today's Calories</p>
                    <p className="text-3xl font-black text-white mt-1">{todaysCalories}</p>
                    <p className="text-white/50 text-xs mt-1">
                      of {profile?.target_protein ? (profile.target_protein * 4 + profile.target_carbs * 4 + profile.target_fats * 9) : 2000} kcal
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((todaysCalories / (profile?.target_protein ? (profile.target_protein * 4 + profile.target_carbs * 4 + profile.target_fats * 9) : 2000)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </DarkCard>

            <DarkCard gradient="linear-gradient(135deg, rgb(59, 130, 246), rgb(14, 165, 233))">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Hydration</p>
                    <p className="text-3xl font-black text-white mt-1">0ml</p>
                    <p className="text-white/50 text-xs mt-1">
                      of {profile?.hydration_goal || 2000}ml
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </DarkCard>

            <DarkCard gradient="linear-gradient(135deg, rgb(251, 146, 60), rgb(249, 115, 22))">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Weekly Streak</p>
                    <p className="text-3xl font-black text-white mt-1">{weeklyStreak}</p>
                    <p className="text-white/50 text-xs mt-1">
                      {weeklyStreak === 1 ? 'day' : 'days'} tracked
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-2 rounded-full ${i < weeklyStreak ? 'bg-white/90' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
            </DarkCard>
          </div>
        </div>

        {/* AI Meal Plan Banner */}
        {aiMealPlan.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Meal Plan Active</h3>
                  <p className="text-sm text-muted-foreground">MKRO Coach has created a personalized plan for you</p>
                </div>
              </div>
              <Button variant="outline" onClick={clearAIMealPlan}>
                Clear Plan
              </Button>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Card>
          <Tabs defaultValue="diary" className="w-full">
            <div className="border-b">
              <TabsList className="w-full grid grid-cols-3 h-auto p-2">
                <TabsTrigger value="diary" className="gap-2 py-3">
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Food Diary</span>
                  <span className="sm:hidden">Diary</span>
                </TabsTrigger>
                <TabsTrigger value="planner" className="gap-2 py-3">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Meal Planner</span>
                  <span className="sm:hidden">Planner</span>
                </TabsTrigger>
                <TabsTrigger value="hydration" className="gap-2 py-3">
                  <Droplet className="w-4 h-4" />
                  <span className="hidden sm:inline">Hydration</span>
                  <span className="sm:hidden">Water</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="diary" className="mt-0">
                <FoodDiary />
              </TabsContent>

              <TabsContent value="planner" className="mt-0">
                <MealPlanner 
                  initialMealPlan={mealPlan}
                  recipes={recipes}
                  onMealPlanChange={handleMealPlanUpdate}
                />
              </TabsContent>

              <TabsContent value="hydration" className="mt-0">
                <HydrationTracker />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default NutritionHub;
