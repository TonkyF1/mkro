export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  heightUnit: 'cm' | 'inches';
  weightUnit: 'kg' | 'lbs';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_health';
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  dietaryPreferences: string[];
  allergies: string[];
}

export const GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Weight Maintenance' },
  { value: 'general_health', label: 'General Health' },
] as const;

export const DIETARY_OPTIONS = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'keto',
  'low-carb',
  'high-protein',
  'dairy-free',
  'paleo',
] as const;

export const ALLERGY_OPTIONS = [
  'nuts',
  'dairy',
  'soy',
  'shellfish',
  'eggs',
  'fish',
  'gluten',
  'sesame',
] as const;