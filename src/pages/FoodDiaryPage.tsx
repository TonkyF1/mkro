import React from 'react';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';

const FoodDiaryPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Food Diary</h1>
      <HydrationTracker />
      <FoodDiary />
    </div>
  );
};

export default FoodDiaryPage;
