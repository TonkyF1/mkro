import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Utensils, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FoodScanner } from './FoodScanner';

interface FoodEntry {
  id: string;
  name: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

const FoodDiary = () => {
  const { toast } = useToast();
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    meal: 'breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const addFood = () => {
    if (!newFood.name || newFood.calories <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in food name and calories.',
      });
      return;
    }

    const food: FoodEntry = {
      id: Date.now().toString(),
      ...newFood,
      date: new Date().toISOString().split('T')[0],
    };

    setFoods([...foods, food]);
    setNewFood({ name: '', meal: 'breakfast', calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    toast({
      title: 'Food Added',
      description: `${food.name} has been logged successfully!`,
    });
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(food => food.id !== id));
    toast({
      title: 'Food Removed',
      description: 'Food has been removed from your diary.',
    });
  };

  const handleScannedFood = (foodData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => {
    setNewFood({
      ...foodData,
      meal: 'breakfast'
    });
    toast({
      title: 'Food identified!',
      description: 'Review and adjust the nutritional values, then click Add Food.',
    });
  };

  const getTodayFoods = () => {
    const today = new Date().toISOString().split('T')[0];
    return foods.filter(food => food.date === today);
  };

  const getTodayTotals = () => {
    const todayFoods = getTodayFoods();
    return todayFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fats: totals.fats + food.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const getFoodsByMeal = (meal: string) => {
    return getTodayFoods().filter(food => food.meal === meal);
  };

  const todayTotals = getTodayTotals();

  return (
    <div className="space-y-6">
      {/* Daily Nutrition Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Today's Nutrition</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{todayTotals.calories}</p>
            <p className="text-sm text-muted-foreground">Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{todayTotals.protein}g</p>
            <p className="text-sm text-muted-foreground">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{todayTotals.carbs}g</p>
            <p className="text-sm text-muted-foreground">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{todayTotals.fats}g</p>
            <p className="text-sm text-muted-foreground">Fats</p>
          </div>
        </div>
      </Card>

      {/* Add New Food */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Log Food</h3>
          <Button onClick={() => setShowScanner(true)} variant="outline" size="sm">
            <Scan className="h-4 w-4 mr-2" />
            Scan Food
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="food-name">Food Name</Label>
            <Input
              id="food-name"
              placeholder="e.g., Grilled Chicken"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="meal-type">Meal</Label>
            <Select 
              value={newFood.meal} 
              onValueChange={(value) => setNewFood({ ...newFood, meal: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map((meal) => (
                  <SelectItem key={meal} value={meal}>
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="200"
              value={newFood.calories || ''}
              onChange={(e) => setNewFood({ ...newFood, calories: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              placeholder="25"
              value={newFood.protein || ''}
              onChange={(e) => setNewFood({ ...newFood, protein: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              placeholder="30"
              value={newFood.carbs || ''}
              onChange={(e) => setNewFood({ ...newFood, carbs: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="fats">Fats (g)</Label>
            <Input
              id="fats"
              type="number"
              placeholder="10"
              value={newFood.fats || ''}
              onChange={(e) => setNewFood({ ...newFood, fats: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <Button onClick={addFood}>
          <Plus className="h-4 w-4 mr-2" />
          Add Food
        </Button>
      </Card>

      {/* Food Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <FoodScanner 
              onFoodScanned={handleScannedFood} 
              onClose={() => setShowScanner(false)} 
            />
          </div>
        </div>
      )}

      {/* Meals by Type */}
      {mealTypes.map((mealType) => {
        const mealFoods = getFoodsByMeal(mealType);
        return (
          <Card key={mealType} className="p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{mealType}</h3>
            {mealFoods.length > 0 ? (
              <div className="space-y-3">
                {mealFoods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{food.calories} cal</Badge>
                        <Badge variant="outline">{food.protein}g protein</Badge>
                        <Badge variant="outline">{food.carbs}g carbs</Badge>
                        <Badge variant="outline">{food.fats}g fats</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFood(food.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No {mealType} logged today</p>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default FoodDiary;