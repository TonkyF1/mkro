import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Trash2, ChefHat } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface MealPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

interface MealPlannerProps {
  recipes: Recipe[];
  onGenerateShoppingList: (meals: MealPlan[]) => void;
}

const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MealPlanner: React.FC<MealPlannerProps> = ({ recipes, onGenerateShoppingList }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>(
    DAYS.map(day => ({ date: day }))
  );
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number; mealType: string } | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  const addRecipeToSlot = (recipe: Recipe, dayIndex: number, mealType: string) => {
    setMealPlan(prev => 
      prev.map((day, index) =>
        index === dayIndex 
          ? { ...day, [mealType]: recipe }
          : day
      )
    );
    setShowRecipeSelector(false);
    setSelectedSlot(null);
  };

  const removeRecipeFromSlot = (dayIndex: number, mealType: string) => {
    setMealPlan(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? { ...day, [mealType]: undefined }
          : day
      )
    );
  };

  const calculateDayMacros = (day: MealPlan) => {
    const meals = [day.breakfast, day.lunch, day.dinner, day.snack].filter(Boolean) as Recipe[];
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fats: totals.fats + meal.fats,
        cost: totals.cost + meal.estimatedCost
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, cost: 0 }
    );
  };

  const openRecipeSelector = (dayIndex: number, mealType: string) => {
    setSelectedSlot({ dayIndex, mealType });
    setShowRecipeSelector(true);
  };

  const filteredRecipes = selectedSlot 
    ? recipes.filter(recipe => recipe.category === selectedSlot.mealType)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Weekly Meal Plan</h2>
        </div>
        <Button 
          onClick={() => onGenerateShoppingList(mealPlan)}
          className="bg-gradient-primary text-white"
        >
          Generate Shopping List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mealPlan.map((day, dayIndex) => {
          const dayMacros = calculateDayMacros(day);
          return (
            <Card key={day.date} className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{day.date}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {dayMacros.calories}kcal • ${dayMacros.cost.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {MEAL_SLOTS.map(mealType => (
                  <div key={mealType} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{mealType}</span>
                      {day[mealType] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRecipeFromSlot(dayIndex, mealType)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {day[mealType] ? (
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{day[mealType]!.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {day[mealType]!.calories}kcal • ${day[mealType]!.estimatedCost.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openRecipeSelector(dayIndex, mealType)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add {mealType}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showRecipeSelector && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">
                  Select {selectedSlot.mealType} for {DAYS[selectedSlot.dayIndex]}
                </h3>
                <Button variant="ghost" onClick={() => setShowRecipeSelector(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecipes.map(recipe => (
                <Card 
                  key={recipe.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addRecipeToSlot(recipe, selectedSlot.dayIndex, selectedSlot.mealType)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ChefHat className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{recipe.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.description}
                        </p>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{recipe.calories}kcal</span>
                          <span>${recipe.estimatedCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};