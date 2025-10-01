// Utility to parse MKRO Coach responses and extract meal plans and workout plans

export interface ParsedMealPlan {
  day: string;
  breakfast?: { name: string; calories?: number; protein?: number; carbs?: number; fats?: number };
  lunch?: { name: string; calories?: number; protein?: number; carbs?: number; fats?: number };
  dinner?: { name: string; calories?: number; protein?: number; carbs?: number; fats?: number };
  snack?: { name: string; calories?: number; protein?: number; carbs?: number; fats?: number };
}

export interface ParsedWorkout {
  name: string;
  type: string;
  duration: number;
  calories?: number;
  day?: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const parseMealPlan = (text: string): ParsedMealPlan[] => {
  const mealPlan: ParsedMealPlan[] = [];
  const lines = text.toLowerCase().split('\n');
  
  let currentDay: string | null = null;
  let currentMeal: ParsedMealPlan | null = null;
  
  for (const line of lines) {
    // Check for day headers
    const dayMatch = DAYS.find(day => line.includes(day));
    if (dayMatch) {
      if (currentMeal) {
        mealPlan.push(currentMeal);
      }
      currentDay = dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1);
      currentMeal = { day: currentDay };
      continue;
    }
    
    if (!currentMeal) continue;
    
    // Parse meals
    if (line.includes('breakfast:') || line.includes('breakfast -')) {
      const mealInfo = extractMealInfo(line);
      currentMeal.breakfast = mealInfo;
    } else if (line.includes('lunch:') || line.includes('lunch -')) {
      const mealInfo = extractMealInfo(line);
      currentMeal.lunch = mealInfo;
    } else if (line.includes('dinner:') || line.includes('dinner -')) {
      const mealInfo = extractMealInfo(line);
      currentMeal.dinner = mealInfo;
    } else if (line.includes('snack:') || line.includes('snack -')) {
      const mealInfo = extractMealInfo(line);
      currentMeal.snack = mealInfo;
    }
  }
  
  if (currentMeal && Object.keys(currentMeal).length > 1) {
    mealPlan.push(currentMeal);
  }
  
  return mealPlan;
};

const extractMealInfo = (line: string): { name: string; calories?: number; protein?: number; carbs?: number; fats?: number } => {
  // Remove meal type prefix
  let cleanLine = line.replace(/(breakfast|lunch|dinner|snack)[:\-]/gi, '').trim();
  
  // Extract numbers for macros
  const caloriesMatch = cleanLine.match(/(\d+)\s*(kcal|cal|calories)/i);
  const proteinMatch = cleanLine.match(/(\d+)g?\s*protein/i);
  const carbsMatch = cleanLine.match(/(\d+)g?\s*(carb|carbs|carbohydrate)/i);
  const fatsMatch = cleanLine.match(/(\d+)g?\s*fat/i);
  
  // Remove macro info to get meal name
  const name = cleanLine
    .replace(/\d+\s*(kcal|cal|calories|protein|carb|carbs|fat|g)/gi, '')
    .replace(/[(\[\{].*?[)\]\}]/g, '') // Remove anything in brackets
    .replace(/[-•*]/g, '')
    .trim();
  
  return {
    name: name || 'Meal',
    calories: caloriesMatch ? parseInt(caloriesMatch[1]) : undefined,
    protein: proteinMatch ? parseInt(proteinMatch[1]) : undefined,
    carbs: carbsMatch ? parseInt(carbsMatch[1]) : undefined,
    fats: fatsMatch ? parseInt(fatsMatch[1]) : undefined,
  };
};

export const parseWorkoutPlan = (text: string): ParsedWorkout[] => {
  const workouts: ParsedWorkout[] = [];
  const lines = text.toLowerCase().split('\n');
  
  let currentDay: string | null = null;
  
  for (const line of lines) {
    // Check for day headers
    const dayMatch = DAYS.find(day => line.includes(day));
    if (dayMatch) {
      currentDay = dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1);
      continue;
    }
    
    // Look for exercise patterns
    if (
      line.includes('exercise:') ||
      line.includes('workout:') ||
      line.match(/\d+\s*(min|minutes|reps|sets)/i) ||
      line.match(/(run|jog|walk|swim|cycle|lift|press|squat|deadlift|yoga|pilates)/i)
    ) {
      const workout = extractWorkoutInfo(line, currentDay);
      if (workout) {
        workouts.push(workout);
      }
    }
  }
  
  return workouts;
};

const extractWorkoutInfo = (line: string, day?: string | null): ParsedWorkout | null => {
  let cleanLine = line.replace(/(exercise|workout)[:\-]/gi, '').trim();
  
  // Extract duration
  const durationMatch = cleanLine.match(/(\d+)\s*(min|minutes)/i);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 30;
  
  // Extract calories
  const caloriesMatch = cleanLine.match(/(\d+)\s*(kcal|cal|calories)/i);
  const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : undefined;
  
  // Determine exercise type
  let type = 'cardio';
  if (cleanLine.match(/(lift|press|squat|deadlift|strength|weights)/i)) {
    type = 'strength';
  } else if (cleanLine.match(/(yoga|pilates|stretch|flexibility)/i)) {
    type = 'flexibility';
  } else if (cleanLine.match(/(run|jog|walk|cycle|swim)/i)) {
    type = 'cardio';
  }
  
  // Extract exercise name
  const name = cleanLine
    .replace(/\d+\s*(min|minutes|kcal|cal|calories|reps|sets)/gi, '')
    .replace(/[(\[\{].*?[)\]\}]/g, '')
    .replace(/[-•*]/g, '')
    .trim();
  
  if (!name || name.length < 3) return null;
  
  return {
    name: name || 'Exercise',
    type,
    duration,
    calories,
    day: day || undefined,
  };
};

export const detectPlanType = (text: string): 'meal' | 'workout' | 'both' | 'none' => {
  const lowerText = text.toLowerCase();
  
  const hasMealKeywords = 
    lowerText.includes('meal plan') ||
    lowerText.includes('diet plan') ||
    lowerText.includes('nutrition plan') ||
    (lowerText.includes('breakfast') && lowerText.includes('lunch') && lowerText.includes('dinner'));
  
  const hasWorkoutKeywords = 
    lowerText.includes('workout plan') ||
    lowerText.includes('training plan') ||
    lowerText.includes('exercise plan') ||
    lowerText.match(/(monday|tuesday|wednesday).*?(exercise|workout)/i);
  
  if (hasMealKeywords && hasWorkoutKeywords) return 'both';
  if (hasMealKeywords) return 'meal';
  if (hasWorkoutKeywords) return 'workout';
  return 'none';
};
