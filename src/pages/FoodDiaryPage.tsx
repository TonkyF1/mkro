import React from 'react';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';
import { useUserProfile } from '@/hooks/useUserProfile';

const FoodDiaryPage = () => {
  const { profile } = useUserProfile();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <HydrationTracker userProfile={profile} />
      <FoodDiary />
    </div>
  );
};

export default FoodDiaryPage;
