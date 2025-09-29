import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingList } from '@/components/ShoppingList';

const Shopping = () => {
  const navigate = useNavigate();
  const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '[]');

  return (
    <ShoppingList 
      mealPlans={mealPlan}
      onBack={() => navigate('/planner')}
    />
  );
};

export default Shopping;
