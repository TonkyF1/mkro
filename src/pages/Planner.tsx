import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPlanner } from '@/components/MealPlanner';
import { useRecipes } from '@/hooks/useRecipes';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const loadMealPlanFromStorage = () => {
  const stored = localStorage.getItem('mealPlan');
  if (stored) {
    return JSON.parse(stored);
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
