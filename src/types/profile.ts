/**
 * SECURITY NOTICE: This interface contains sensitive personal health information (PHI)
 * 
 * Data Protection Requirements:
 * - NEVER cache profile data in localStorage, sessionStorage, or any client-side storage
 * - NEVER log profile data to console in production
 * - Always fetch from Supabase with proper authentication and RLS policies
 * - Handle with HIPAA/GDPR compliance in mind
 * - Sensitive fields: health_conditions, allergies, age, height, weight, stress_level
 */
export interface UserProfile {
  id?: string;
  user_id?: string;
  name?: string;
  display_name?: string;
  age?: number;
  dob?: string;
  sex?: string;
  gender?: string;
  height?: number;
  weight?: number;
  height_cm?: number;
  weight_kg?: number;
  height_unit?: 'cm' | 'inches';
  weight_unit?: 'kg' | 'lbs';
  bodyfat_pct?: number;
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_health' | 'fat_loss' | 'recomp' | 'performance';
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | 'light' | 'moderate' | 'high' | 'athlete';
  target_protein?: number;
  target_carbs?: number;
  target_fats?: number;
  dietary_preferences?: string[];
  dietary_prefs?: any;
  diet_prefs?: any;
  allergies?: string[];
  cooking_time_preference?: 'under_15' | '15_30' | '30_45' | 'over_45';
  budget_preference?: 'budget' | 'moderate' | 'premium';
  budget_level?: string;
  meal_frequency?: number;
  meals_per_day?: number;
  kitchen_equipment?: string[];
  eating_out_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
  health_conditions?: string[];
  supplement_usage?: string[];
  hydration_goal?: number;
  hydration_target_ml?: number;
  sleep_hours?: number;
  stress_level?: number;
  motivation_factors?: string[];
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  trial_start_date?: string;
  trial_prompts_used?: number;
  is_premium?: boolean;
  subscription_status?: 'free' | 'premium' | 'expired';
  subscription_expiry?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  time_available_minutes?: number;
  training_days_per_week?: number;
  onboarding_completed?: boolean;
  daily_calorie_target?: number;
  macro_target?: any;
  goals?: any[];
  injuries?: any[];
  equipment?: any[];
  days_available?: any[];
  experience_level?: string;
  points?: number;
  streak?: number;
  level?: string;
}

export const GOALS = [
  { value: 'weight_loss', label: 'Weight Loss', description: 'Reduce body weight healthily' },
  { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle mass' },
  { value: 'maintenance', label: 'Weight Maintenance', description: 'Maintain current weight' },
  { value: 'general_health', label: 'General Health', description: 'Improve overall wellness' },
] as const;

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
] as const;

export const DIETARY_OPTIONS = [
  'vegan', 'vegetarian', 'gluten-free', 'keto', 'low-carb', 'high-protein',
  'dairy-free', 'paleo', 'mediterranean', 'intermittent-fasting', 'low-sodium'
] as const;

export const ALLERGY_OPTIONS = [
  'nuts', 'tree-nuts', 'dairy', 'soy', 'shellfish', 'eggs', 'fish', 
  'gluten', 'sesame', 'wheat', 'corn', 'sulfites'
] as const;

export const COOKING_TIME_OPTIONS = [
  { value: 'under_15', label: 'Under 15 minutes', description: 'Quick and easy meals' },
  { value: '15_30', label: '15-30 minutes', description: 'Moderate preparation time' },
  { value: '30_45', label: '30-45 minutes', description: 'More elaborate cooking' },
  { value: 'over_45', label: 'Over 45 minutes', description: 'Complex, slow-cooked meals' },
] as const;

export const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget-Friendly', description: 'Cost-effective ingredients' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced cost and quality' },
  { value: 'premium', label: 'Premium', description: 'High-quality, specialty ingredients' },
] as const;

export const KITCHEN_EQUIPMENT = [
  'stovetop', 'oven', 'microwave', 'air-fryer', 'slow-cooker', 'instant-pot',
  'blender', 'food-processor', 'stand-mixer', 'grill', 'steamer', 'rice-cooker'
] as const;

export const EATING_OUT_OPTIONS = [
  { value: 'never', label: 'Never', description: 'Always cook at home' },
  { value: 'rarely', label: 'Rarely', description: '1-2 times per month' },
  { value: 'sometimes', label: 'Sometimes', description: '1-2 times per week' },
  { value: 'often', label: 'Often', description: '3-4 times per week' },
  { value: 'daily', label: 'Daily', description: 'Almost every day' },
] as const;

export const HEALTH_CONDITIONS = [
  'diabetes', 'high-blood-pressure', 'heart-disease', 'high-cholesterol',
  'thyroid-issues', 'pcos', 'ibs', 'crohns', 'celiac', 'gerd'
] as const;

export const SUPPLEMENT_OPTIONS = [
  'protein-powder', 'multivitamin', 'omega-3', 'vitamin-d', 'b12',
  'iron', 'calcium', 'magnesium', 'probiotics', 'creatine'
] as const;

export const MOTIVATION_FACTORS = [
  'health-improvement', 'weight-management', 'energy-boost', 'athletic-performance',
  'disease-prevention', 'mood-enhancement', 'longevity', 'appearance'
] as const;