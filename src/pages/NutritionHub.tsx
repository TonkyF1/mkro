import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Utensils, Bot } from 'lucide-react';
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

  // Reload meal plan from storage when component mounts or becomes visible
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

  // Load AI-generated meal plan and auto-populate weekly planner
  useEffect(() => {
    const loadAIMealPlan = () => {
      const stored = localStorage.getItem('mkro_meal_plan');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ParsedMealPlan[];
          setAiMealPlan(parsed);
          
          // Auto-populate weekly meal plan from AI recommendations
          if (parsed.length > 0) {
            const newMealPlan = DAYS.map((day, dayIndex) => {
              const aiDay = parsed.find(p => {
                const dayName = p.day?.toLowerCase() || '';
                return day.toLowerCase().includes(dayName) || dayName.includes(day.toLowerCase());
              }) || parsed[dayIndex]; // Fallback to sequential if day name doesn't match

              const dayPlan: any = { date: day };

              // Convert AI meal data to Recipe-like objects for each meal slot
              if (aiDay) {
                if (aiDay.breakfast) {
                  dayPlan.breakfast = {
                    id: `ai-breakfast-${dayIndex}`,
                    name: aiDay.breakfast.name,
                    category: 'breakfast',
                    calories: aiDay.breakfast.calories || 0,
                    protein: aiDay.breakfast.protein || 0,
                    carbs: aiDay.breakfast.carbs || 0,
                    fats: aiDay.breakfast.fats || 0,
                    estimatedCost: 0,
                    prepTime: '15 minutes',
                    servingSize: '1 serving',
                    description: aiDay.breakfast.name,
                    ingredients: [],
                    instructions: '',
                    dietaryTags: []
                  };
                }
                if (aiDay.lunch) {
                  dayPlan.lunch = {
                    id: `ai-lunch-${dayIndex}`,
                    name: aiDay.lunch.name,
                    category: 'lunch',
                    calories: aiDay.lunch.calories || 0,
                    protein: aiDay.lunch.protein || 0,
                    carbs: aiDay.lunch.carbs || 0,
                    fats: aiDay.lunch.fats || 0,
                    estimatedCost: 0,
                    prepTime: '20 minutes',
                    servingSize: '1 serving',
                    description: aiDay.lunch.name,
                    ingredients: [],
                    instructions: '',
                    dietaryTags: []
                  };
                }
                if (aiDay.dinner) {
                  dayPlan.dinner = {
                    id: `ai-dinner-${dayIndex}`,
                    name: aiDay.dinner.name,
                    category: 'dinner',
                    calories: aiDay.dinner.calories || 0,
                    protein: aiDay.dinner.protein || 0,
                    carbs: aiDay.dinner.carbs || 0,
                    fats: aiDay.dinner.fats || 0,
                    estimatedCost: 0,
                    prepTime: '30 minutes',
                    servingSize: '1 serving',
                    description: aiDay.dinner.name,
                    ingredients: [],
                    instructions: '',
                    dietaryTags: []
                  };
                }
                if (aiDay.snack) {
                  dayPlan.snack = {
                    id: `ai-snack-${dayIndex}`,
                    name: aiDay.snack.name,
                    category: 'snack',
                    calories: aiDay.snack.calories || 0,
                    protein: aiDay.snack.protein || 0,
                    carbs: aiDay.snack.carbs || 0,
                    fats: aiDay.snack.fats || 0,
                    estimatedCost: 0,
                    prepTime: '5 minutes',
                    servingSize: '1 serving',
                    description: aiDay.snack.name,
                    ingredients: [],
                    instructions: '',
                    dietaryTags: []
                  };
                }
              }

              return dayPlan;
            });

            setMealPlan(newMealPlan);
            saveMealPlanToStorage(newMealPlan);
          }
        } catch (e) {
          console.error('Error parsing AI meal plan:', e);
        }
      }
    };

    loadAIMealPlan();
    window.addEventListener('storage', loadAIMealPlan);
    
    return () => {
      window.removeEventListener('storage', loadAIMealPlan);
    };
  }, []);

  const clearAIMealPlan = () => {
    localStorage.removeItem('mkro_meal_plan');
    setAiMealPlan([]);
    // Reset to empty meal plan
    const emptyPlan = DAYS.map(day => ({ date: day }));
    setMealPlan(emptyPlan);
    saveMealPlanToStorage(emptyPlan);
    toast({
      title: "AI Plan Cleared",
      description: "The MKRO Coach meal plan has been removed.",
    });
  };

  const generateShoppingList = (meals: any) => {
    setMealPlan(meals);
    saveMealPlanToStorage(meals);
    navigate('/shopping');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hydration Tracker - Always visible at top */}
      <HydrationTracker userProfile={profile} />

      {/* AI Meal Plan Banner */}
      {aiMealPlan.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">MKRO Coach Meal Plan Available</h3>
                <p className="text-sm text-muted-foreground">
                  {aiMealPlan.length} days of meals planned for you
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearAIMealPlan}>
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs for Daily vs Weekly view */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Today's Log
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <FoodDiary />
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          {aiMealPlan.length > 0 && (
            <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">MKRO Coach Recommendations Active</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personalized meal plan has been auto-populated below
                  </p>
                </div>
              </div>
            </Card>
          )}
          <MealPlanner
            recipes={recipes} 
            onGenerateShoppingList={generateShoppingList}
            initialMealPlan={mealPlan}
            onMealPlanChange={(updatedPlan) => {
              setMealPlan(updatedPlan);
              saveMealPlanToStorage(updatedPlan);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionHub;
