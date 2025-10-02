import { UserProfile } from '@/types/user';

// SECURITY: Removed localStorage caching of sensitive health data
// All profile data should be fetched from Supabase with proper authentication
// and RLS policies. Never cache sensitive health information in the browser.

export const calculateDailyWaterGoal = (weight: number, weightUnit: 'kg' | 'lbs'): number => {
  const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
  // 30ml per kg of body weight
  return Math.round(weightInKg * 30);
};

export const getDefaultMacros = (goal: UserProfile['goal']) => {
  switch (goal) {
    case 'weight_loss':
      return { protein: 35, carbs: 35, fats: 30 };
    case 'muscle_gain':
      return { protein: 30, carbs: 45, fats: 25 };
    case 'maintenance':
      return { protein: 30, carbs: 40, fats: 30 };
    case 'general_health':
      return { protein: 30, carbs: 40, fats: 30 };
    default:
      return { protein: 30, carbs: 40, fats: 30 };
  }
};