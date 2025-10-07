import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Utensils, Flame } from 'lucide-react';
import { Badge } from './ui/badge';

interface Ingredient {
  item: string;
  qty: string;
}

interface Meal {
  meal_time: string;
  recipe_title: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: Ingredient[];
  instructions: string;
  tags?: string[];
}

interface TodaysMealsProps {
  meals: Meal[];
  dailyTargets?: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
}

export const TodaysMeals = ({ meals, dailyTargets }: TodaysMealsProps) => {
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.kcal || 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein_g || 0), 0);

  if (meals.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Utensils className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No meals planned for today</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {dailyTargets && (
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Daily Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Calories</p>
                <p className="text-lg font-bold">{totalCalories}</p>
                <p className="text-xs text-muted-foreground">/ {dailyTargets.kcal}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="text-lg font-bold">{totalProtein}g</p>
                <p className="text-xs text-muted-foreground">/ {dailyTargets.protein_g}g</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="text-lg font-bold">{meals.reduce((s, m) => s + (m.carbs_g || 0), 0)}g</p>
                <p className="text-xs text-muted-foreground">/ {dailyTargets.carbs_g}g</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="text-lg font-bold">{meals.reduce((s, m) => s + (m.fat_g || 0), 0)}g</p>
                <p className="text-xs text-muted-foreground">/ {dailyTargets.fat_g}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {meals.map((meal, idx) => (
        <Card key={idx} className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2 capitalize">
                  {meal.meal_time}
                </Badge>
                <CardTitle className="text-xl">{meal.recipe_title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {meal.kcal} kcal
                  </span>
                  <span>•</span>
                  <span>P: {meal.protein_g}g</span>
                  <span>C: {meal.carbs_g}g</span>
                  <span>F: {meal.fat_g}g</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Ingredients:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>
                      • {ing.item} - {ing.qty}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meal.instructions && (
              <div>
                <p className="text-sm font-medium mb-2">Instructions:</p>
                <p className="text-sm text-muted-foreground">{meal.instructions}</p>
              </div>
            )}

            {meal.tags && meal.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {meal.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
