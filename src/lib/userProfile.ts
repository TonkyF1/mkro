import { UserProfile } from '@/types/user';

const USER_PROFILE_KEY = 'lovable-meals-user-profile';

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const loadUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
};

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