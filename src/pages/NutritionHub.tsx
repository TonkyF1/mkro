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

  // Load AI-generated meal plan
  useEffect(() => {
    const loadAIMealPlan = () => {
      const stored = localStorage.getItem('mkro_meal_plan');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAiMealPlan(parsed);
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
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                MKRO Coach Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiMealPlan.map((day, idx) => (
                  <Card key={idx} className="p-4 bg-primary/5 border-primary/10">
                    <h4 className="font-semibold mb-3 capitalize">{day.day}</h4>
                    <div className="space-y-2 text-sm">
                      {day.breakfast && (
                        <div>
                          <span className="font-medium">Breakfast:</span> {day.breakfast.name}
                          {day.breakfast.calories && <span className="text-muted-foreground ml-1">({day.breakfast.calories} cal)</span>}
                        </div>
                      )}
                      {day.lunch && (
                        <div>
                          <span className="font-medium">Lunch:</span> {day.lunch.name}
                          {day.lunch.calories && <span className="text-muted-foreground ml-1">({day.lunch.calories} cal)</span>}
                        </div>
                      )}
                      {day.dinner && (
                        <div>
                          <span className="font-medium">Dinner:</span> {day.dinner.name}
                          {day.dinner.calories && <span className="text-muted-foreground ml-1">({day.dinner.calories} cal)</span>}
                        </div>
                      )}
                      {day.snack && (
                        <div>
                          <span className="font-medium">Snack:</span> {day.snack.name}
                          {day.snack.calories && <span className="text-muted-foreground ml-1">({day.snack.calories} cal)</span>}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
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
