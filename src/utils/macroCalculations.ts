interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const calculateRemainingMacros = (
  consumed: MacroData,
  targets: MacroData
): MacroData => {
  return {
    calories: Math.max(0, targets.calories - consumed.calories),
    protein: Math.max(0, targets.protein - consumed.protein),
    carbs: Math.max(0, targets.carbs - consumed.carbs),
    fats: Math.max(0, targets.fats - consumed.fats),
  };
};

export const calculateMacroPercentages = (
  consumed: MacroData,
  targets: MacroData
) => {
  return {
    calories: Math.min(100, (consumed.calories / targets.calories) * 100),
    protein: Math.min(100, (consumed.protein / targets.protein) * 100),
    carbs: Math.min(100, (consumed.carbs / targets.carbs) * 100),
    fats: Math.min(100, (consumed.fats / targets.fats) * 100),
  };
};

export const suggestMealAdjustments = (
  remaining: MacroData,
  mealsLeft: number
): string[] => {
  const suggestions: string[] = [];
  
  if (mealsLeft === 0) {
    if (remaining.calories < 100) {
      suggestions.push("You've hit your calorie target for today!");
    } else {
      suggestions.push(`You have ${remaining.calories} calories left - consider a light snack`);
    }
    return suggestions;
  }

  const perMealCalories = Math.round(remaining.calories / mealsLeft);
  const perMealProtein = Math.round(remaining.protein / mealsLeft);

  if (perMealCalories < 200) {
    suggestions.push('Focus on low-calorie, high-volume foods like vegetables');
  } else if (perMealCalories > 600) {
    suggestions.push('You have plenty of calories left - normal portions are fine');
  } else {
    suggestions.push(`Aim for ~${perMealCalories} calories per remaining meal`);
  }

  if (perMealProtein < 10) {
    suggestions.push('Light protein sources like chicken breast or fish');
  } else if (perMealProtein > 30) {
    suggestions.push(`Target ~${perMealProtein}g protein per meal for best results`);
  }

  if (remaining.carbs < 20) {
    suggestions.push('Keep carbs low - opt for vegetables over grains');
  }

  if (remaining.fats < 10) {
    suggestions.push('Avoid cooking oils and fatty sauces');
  }

  return suggestions;
};

export const calculateDailyCalories = (
  weight: number,
  weightUnit: 'kg' | 'lbs',
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_health',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active' = 'moderate'
): number => {
  // Convert to kg if needed
  const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
  
  // Base metabolic rate (simplified)
  let bmr = weightKg * 22; // Rough estimate
  
  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  
  let tdee = bmr * activityMultipliers[activityLevel];
  
  // Adjust for goal
  switch (goal) {
    case 'weight_loss':
      tdee *= 0.85; // 15% deficit
      break;
    case 'muscle_gain':
      tdee *= 1.1; // 10% surplus
      break;
    default:
      break;
  }
  
  return Math.round(tdee);
};

export const calculateMacroGrams = (
  calories: number,
  proteinPercentage: number,
  carbsPercentage: number,
  fatsPercentage: number
) => {
  return {
    protein: Math.round((calories * (proteinPercentage / 100)) / 4),
    carbs: Math.round((calories * (carbsPercentage / 100)) / 4),
    fats: Math.round((calories * (fatsPercentage / 100)) / 9),
  };
};
