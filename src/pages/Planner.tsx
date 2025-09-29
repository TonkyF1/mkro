import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPlanner } from '@/components/MealPlanner';
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

const Planner = () => {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const [mealPlan, setMealPlan] = useState(() => loadMealPlanFromStorage());

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
