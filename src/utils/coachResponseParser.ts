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
  console.log('Parsing meal plan from:', text);
  const mealPlan: ParsedMealPlan[] = [];
  const lines = text.toLowerCase().split('\n');
  
  let currentDay: string | null = null;
  let currentMeal: ParsedMealPlan | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for day headers - more flexible patterns
    const dayMatch = DAYS.find(day => {
      return line.includes(day) && 
        (line.startsWith(day) || 
         line.includes(`day ${day}`) ||
         line.includes(`${day}:`) ||
         line.match(new RegExp(`\\b${day}\\b`, 'i')));
    });
    
    if (dayMatch) {
      if (currentMeal && Object.keys(currentMeal).length > 1) {
        mealPlan.push(currentMeal);
      }
      currentDay = dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1);
      currentMeal = { day: currentDay };
      console.log('Found day:', currentDay);
      continue;
    }
    
    if (!currentMeal) {
      // Start a generic plan if we find meal keywords without a day
      if (line.match(/\b(breakfast|lunch|dinner|snack)\b/)) {
        currentDay = 'Day 1';
        currentMeal = { day: currentDay };
      } else {
        continue;
      }
    }
    
    // Parse meals with more flexible patterns
    const mealPattern = /\b(breakfast|lunch|dinner|snack)\b[:\-\s]+(.*)/i;
    const mealMatch = line.match(mealPattern);
    
    if (mealMatch) {
      const mealType = mealMatch[1].toLowerCase();
      const mealContent = mealMatch[2];
      const mealInfo = extractMealInfo(mealContent);
      
      if (mealType === 'breakfast') currentMeal.breakfast = mealInfo;
      else if (mealType === 'lunch') currentMeal.lunch = mealInfo;
      else if (mealType === 'dinner') currentMeal.dinner = mealInfo;
      else if (mealType === 'snack') currentMeal.snack = mealInfo;
      
      console.log(`Found ${mealType}:`, mealInfo);
    }
  }
  
  if (currentMeal && Object.keys(currentMeal).length > 1) {
    mealPlan.push(currentMeal);
  }
  
  console.log('Parsed meal plan:', mealPlan);
  return mealPlan;
};

const extractMealInfo = (line: string): { name: string; calories?: number; protein?: number; carbs?: number; fats?: number } => {
  // Extract numbers for macros
  const caloriesMatch = line.match(/(\d+)\s*(kcal|cal|calories)/i);
  const proteinMatch = line.match(/(\d+)g?\s*protein/i);
  const carbsMatch = line.match(/(\d+)g?\s*(carb|carbs|carbohydrate)/i);
  const fatsMatch = line.match(/(\d+)g?\s*fat/i);
  
  // Remove macro info and cleanup to get meal name
  let name = line
    .replace(/\d+\s*(kcal|cal|calories|protein|carb|carbs|fat|g)\b/gi, '')
    .replace(/[(\[\{].*?[)\]\}]/g, '')
    .replace(/[-•*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If name is too short or empty, use generic
  if (!name || name.length < 3) {
    name = 'Meal';
  }
  
  return {
    name,
    calories: caloriesMatch ? parseInt(caloriesMatch[1]) : undefined,
    protein: proteinMatch ? parseInt(proteinMatch[1]) : undefined,
    carbs: carbsMatch ? parseInt(carbsMatch[1]) : undefined,
    fats: fatsMatch ? parseInt(fatsMatch[1]) : undefined,
  };
};

export const parseWorkoutPlan = (text: string): ParsedWorkout[] => {
  console.log('Parsing workout plan from:', text);
  const workouts: ParsedWorkout[] = [];
  const lines = text.toLowerCase().split('\n');
  
  let currentDay: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for day headers
    const dayMatch = DAYS.find(day => {
      return line.includes(day) && 
        (line.startsWith(day) || 
         line.includes(`day ${day}`) ||
         line.includes(`${day}:`));
    });
    
    if (dayMatch) {
      currentDay = dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1);
      console.log('Found workout day:', currentDay);
      continue;
    }
    
    // More comprehensive workout detection patterns
    const isWorkout = 
      line.match(/\d+\s*(min|minutes|reps|sets)/i) ||
      line.match(/\b(run|jog|walk|swim|cycle|cycling|lift|press|squat|deadlift|yoga|pilates|cardio|strength|hiit|training|workout|exercise)\b/i) ||
      line.match(/\b(push[\s-]?up|pull[\s-]?up|sit[\s-]?up|plank|burpee)\b/i);
    
    if (isWorkout) {
      const workout = extractWorkoutInfo(line, currentDay);
      if (workout) {
        workouts.push(workout);
        console.log('Found workout:', workout);
      }
    }
  }
  
  console.log('Parsed workout plan:', workouts);
  return workouts;
};

const extractWorkoutInfo = (line: string, day?: string | null): ParsedWorkout | null => {
  // Extract duration
  const durationMatch = line.match(/(\d+)\s*(min|minutes)/i);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 30;
  
  // Extract calories
  const caloriesMatch = line.match(/(\d+)\s*(kcal|cal|calories)/i);
  const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : undefined;
  
  // Determine exercise type based on keywords
  let type = 'cardio';
  const lowerLine = line.toLowerCase();
  
  if (lowerLine.match(/\b(lift|press|squat|deadlift|strength|weight|resistance|bench|curl)\b/i)) {
    type = 'strength';
  } else if (lowerLine.match(/\b(yoga|pilates|stretch|flexibility)\b/i)) {
    type = 'flexibility';
  } else if (lowerLine.match(/\b(run|jog|walk|cycle|cycling|swim|swimming|cardio|hiit)\b/i)) {
    type = 'cardio';
  } else if (lowerLine.match(/\b(basketball|football|soccer|tennis|sports)\b/i)) {
    type = 'sports';
  }
  
  // Extract exercise name - remove numbers and macro info
  let name = line
    .replace(/\d+\s*(min|minutes|kcal|cal|calories|reps|sets|kg|lbs)\b/gi, '')
    .replace(/[(\[\{].*?[)\]\}]/g, '')
    .replace(/[-•*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If name is too short, try to construct from keywords
  if (!name || name.length < 3) {
    const exerciseMatch = line.match(/\b(run|jog|walk|swim|cycle|yoga|pilates|lift|press|squat|deadlift|push[\s-]?up|pull[\s-]?up|cardio|hiit)\b/i);
    if (exerciseMatch) {
      name = exerciseMatch[1].charAt(0).toUpperCase() + exerciseMatch[1].slice(1);
    } else {
      return null;
    }
  }
  
  return {
    name,
    type,
    duration,
    calories,
    day: day || undefined,
  };
};

export const detectPlanType = (text: string): 'meal' | 'workout' | 'both' | 'none' => {
  const lowerText = text.toLowerCase();
  
  const hasMealKeywords = 
    lowerText.match(/\b(meal plan|diet plan|nutrition plan|eating plan|food plan)\b/i) ||
    lowerText.match(/\b(breakfast|lunch|dinner)\b.*\b(breakfast|lunch|dinner)\b/i) ||
    (lowerText.match(/\bbreakfast\b/g) || []).length >= 2 ||
    (lowerText.match(/\blunch\b/g) || []).length >= 2;
  
  const hasWorkoutKeywords = 
    lowerText.match(/\b(workout plan|training plan|exercise plan|fitness plan|training program)\b/i) ||
    lowerText.match(/\b(workout|exercise|training)\b.*\b(monday|tuesday|wednesday|thursday|friday)\b/i) ||
    (lowerText.match(/\b(run|jog|walk|swim|cycle|yoga|lift|strength)\b/g) || []).length >= 2;
  
  console.log('Plan detection:', { hasMealKeywords, hasWorkoutKeywords });
  
  if (hasMealKeywords && hasWorkoutKeywords) return 'both';
  if (hasMealKeywords) return 'meal';
  if (hasWorkoutKeywords) return 'workout';
  return 'none';
};
