import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Utensils, Bot, Apple, Droplet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';
import { MealPlanner } from '@/components/MealPlanner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipes } from '@/hooks/useRecipes';
import { ParsedMealPlan } from '@/utils/coachResponseParser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';

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
      const updated = DAYS.map((day) => {
        const dayPlan = daysData[day];
        if (!dayPlan) return { date: day } as any;
        const transformed: any = { date: day };
        const mapMeal = (arr?: any[], category?: string) => {
          if (!arr || arr.length === 0) return undefined;
          const m = arr[0];
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
            estimatedCost: 0,
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

  // Refresh on save events from coach
  useEffect(() => {
    const onUpdate = () => fetchPlans();
    window.addEventListener('mkro:plans-updated', onUpdate as any);
    return () => window.removeEventListener('mkro:plans-updated', onUpdate as any);
  }, [fetchPlans]);

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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Calories</p>
                  <p className="text-2xl font-bold">0 / {profile?.target_protein ? (profile.target_protein * 4 + profile.target_carbs * 4 + profile.target_fats * 9) : 2000}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hydration</p>
                  <p className="text-2xl font-bold">0 / {profile?.hydration_goal || 2000}ml</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Streak</p>
                  <p className="text-2xl font-bold">0 days</p>
                </div>
              </div>
            </Card>
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
                  onGenerateShoppingList={() => {}}
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
