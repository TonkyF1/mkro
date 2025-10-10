import React, { useState } from 'react';
import { useDiary } from '@/hooks/useDiary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

export const FoodDiary = () => {
  const today = new Date().toISOString().split('T')[0];
  const { meals, totals, isLoading, addMeal, toggleComplete, deleteMeal } = useDiary(today);
  const { profile } = useUserProfile();

  const [newMeal, setNewMeal] = useState({
    meal_slot: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    title: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
  });

  const handleAddMeal = () => {
    if (!newMeal.title || !newMeal.calories) return;

    addMeal({
      date: today,
      meal_slot: newMeal.meal_slot,
      custom_entry: {
        title: newMeal.title,
        calories: parseInt(newMeal.calories),
        protein_g: parseFloat(newMeal.protein_g) || 0,
        carbs_g: parseFloat(newMeal.carbs_g) || 0,
        fat_g: parseFloat(newMeal.fat_g) || 0,
      },
    });

    setNewMeal({
      meal_slot: 'breakfast',
      title: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fat_g: '',
    });
  };

  const getMealsBySlot = (slot: string) => {
    return meals?.filter((m) => m.meal_slot === slot) || [];
  };

  const target = profile?.daily_calorie_target || 2000;
  const proteinTarget = profile?.macro_target?.protein_g || 150;
  const carbsTarget = profile?.macro_target?.carbs_g || 200;
  const fatTarget = profile?.macro_target?.fat_g || 60;

  if (isLoading) {
    return <div>Loading diary...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Daily Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Calories</span>
            <span className="font-bold">{totals?.kcal || 0} / {target}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Protein</span>
            <span className="font-bold">{totals?.protein_g?.toFixed(1) || 0}g / {proteinTarget}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Carbs</span>
            <span className="font-bold">{totals?.carbs_g?.toFixed(1) || 0}g / {carbsTarget}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Fat</span>
            <span className="font-bold">{totals?.fat_g?.toFixed(1) || 0}g / {fatTarget}g</span>
          </div>
        </CardContent>
      </Card>

      {/* Meals by Slot */}
      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((slot) => (
        <Card key={slot}>
          <CardHeader>
            <CardTitle className="capitalize">{slot}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getMealsBySlot(slot).length === 0 ? (
              <p className="text-muted-foreground text-sm">No meals logged</p>
            ) : (
              getMealsBySlot(slot).map((meal) => {
                const entry = meal.custom_entry || meal.recipes;
                const title = entry?.title || 'Unknown';
                const kcal = entry?.calories || 0;
                const protein = entry?.protein_g || 0;

                return (
                  <div key={meal.id} className="flex items-center justify-between gap-2 p-2 border rounded">
                    <Checkbox
                      checked={meal.is_completed}
                      onCheckedChange={() => toggleComplete(meal.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">
                        {kcal} kcal • {protein}g protein
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMeal(meal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add Meal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Food</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={newMeal.meal_slot} onValueChange={(v: any) => setNewMeal({ ...newMeal, meal_slot: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Food name"
            value={newMeal.title}
            onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Calories"
              value={newMeal.calories}
              onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Protein (g)"
              value={newMeal.protein_g}
              onChange={(e) => setNewMeal({ ...newMeal, protein_g: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={newMeal.carbs_g}
              onChange={(e) => setNewMeal({ ...newMeal, carbs_g: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Fat (g)"
              value={newMeal.fat_g}
              onChange={(e) => setNewMeal({ ...newMeal, fat_g: e.target.value })}
            />
          </div>

          <Button onClick={handleAddMeal} className="w-full" disabled={!newMeal.title || !newMeal.calories}>
            <Plus className="w-4 h-4 mr-2" />
            Add to Diary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodDiary;