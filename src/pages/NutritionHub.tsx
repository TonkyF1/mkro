import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';
import { MealPlanner } from '@/components/MealPlanner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipes } from '@/hooks/useRecipes';

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
  const [mealPlan, setMealPlan] = useState(() => loadMealPlanFromStorage());

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

  const generateShoppingList = (meals: any) => {
    setMealPlan(meals);
    saveMealPlanToStorage(meals);
    navigate('/shopping');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hydration Tracker - Always visible at top */}
      <HydrationTracker userProfile={profile} />

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
