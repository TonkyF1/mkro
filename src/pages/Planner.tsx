import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPlanner } from '@/components/MealPlanner';
import { useRecipes } from '@/hooks/useRecipes';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

const Planner = () => {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const { nutritionPlan, loading } = useWeeklyPlans();
  const [mealPlan, setMealPlan] = useState(() => loadMealPlanFromStorage());
  
  // Update meal plan from database when available
  useEffect(() => {
    if (nutritionPlan?.days) {
      const daysData = nutritionPlan.days;
      const updatedPlan = DAYS.map(day => {
        if (daysData[day]) {
          return {
            date: day,
            ...daysData[day]
          };
        }
        return { date: day };
      });
      setMealPlan(updatedPlan);
      saveMealPlanToStorage(updatedPlan);
    }
  }, [nutritionPlan]);

  // Reload meal plan from storage whenever the component mounts or becomes visible
  useEffect(() => {
    const reloadMealPlan = () => {
      const updatedPlan = loadMealPlanFromStorage();
      setMealPlan(updatedPlan);
    };

    // Reload on mount
    reloadMealPlan();

    // Also reload when window becomes visible (tab switching)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your meal plan...</p>
        </Card>
      </div>
    );
  }

  return (
    <MealPlanner 
      recipes={recipes} 
      onGenerateShoppingList={generateShoppingList}
      initialMealPlan={mealPlan}
      onMealPlanChange={(updatedPlan) => {
        setMealPlan(updatedPlan);
        saveMealPlanToStorage(updatedPlan);
      }}
    />
  );
};

export default Planner;
