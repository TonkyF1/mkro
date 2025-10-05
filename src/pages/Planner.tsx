import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/hooks/useRecipes';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { useMealCompletions } from '@/hooks/useMealCompletions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Trash2, ShoppingCart, Calendar, ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

interface ManualMeal {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

const Planner = () => {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const { nutritionPlan, loading } = useWeeklyPlans();
  const { toggleMealCompletion, isMealCompleted } = useMealCompletions();
  const { toast } = useToast();
  
  const [manualMeals, setManualMeals] = useState<ManualMeal[]>([]);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [calories, setCalories] = useState('400');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('50');
  const [fats, setFats] = useState('15');

  // Load manual meals from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('manual_meals');
    if (stored) {
      try {
        setManualMeals(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading manual meals:', e);
      }
    }
  }, []);

  const addManualMeal = () => {
    if (!mealName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a meal name.' });
      return;
    }

    const newMeal: ManualMeal = {
      id: crypto.randomUUID(),
      name: mealName,
      mealType: mealType,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fats: parseInt(fats),
      date: new Date().toISOString(),
    };

    const updated = [...manualMeals, newMeal];
    setManualMeals(updated);
    localStorage.setItem('manual_meals', JSON.stringify(updated));

    // Reset form
    setMealName('');
    setMealType('breakfast');
    setCalories('400');
    setProtein('20');
    setCarbs('50');
    setFats('15');

    toast({ title: 'Logged!', description: 'Meal added to food diary.' });
  };

  const deleteManualMeal = (id: string) => {
    const updated = manualMeals.filter(m => m.id !== id);
    setManualMeals(updated);
    localStorage.setItem('manual_meals', JSON.stringify(updated));
    toast({ title: 'Deleted', description: 'Meal removed from log.' });
  };

  const getTodayMeals = () => {
    const today = new Date().toDateString();
    return manualMeals.filter(m => new Date(m.date).toDateString() === today);
  };

  const getThisWeekMeals = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    return manualMeals.filter(m => new Date(m.date) >= startOfWeek);
  };

  const generateShoppingListFromCompleted = () => {
    const completedMeals: any[] = [];
    
    if (nutritionPlan?.days) {
      DAYS.forEach((day) => {
        const dayPlan = nutritionPlan.days[day];
        if (dayPlan) {
          MEAL_SLOTS.forEach((mealType) => {
            const meals = dayPlan[mealType.charAt(0).toUpperCase() + mealType.slice(1)];
            if (meals && meals.length > 0 && isMealCompleted(day, mealType)) {
              completedMeals.push({
                day,
                mealType,
                meal: meals[0]
              });
            }
          });
        }
      });
    }

    if (completedMeals.length === 0) {
      toast({ 
        variant: 'destructive', 
        title: 'No Completed Meals', 
        description: 'Check off meals in your plan first.' 
      });
      return;
    }

    // Save to localStorage for shopping page
    localStorage.setItem('shopping_list_meals', JSON.stringify(completedMeals));
    navigate('/shopping');
  };

  // Calculate stats from manual meals
  const weekMeals = getThisWeekMeals();
  const totalCalories = weekMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = weekMeals.reduce((sum, m) => sum + m.protein, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Meal Planner
              </h1>
              <p className="text-muted-foreground">Plan your nutrition and track your meals</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{weekMeals.length} meals</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="text-2xl font-bold">{totalCalories} kcal</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Protein</p>
                  <p className="text-2xl font-bold">{totalProtein}g</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ai-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-plan">AI Meal Plan</TabsTrigger>
            <TabsTrigger value="manual-log">Manual Food Log</TabsTrigger>
          </TabsList>

          {/* AI Plan Tab */}
          <TabsContent value="ai-plan" className="mt-6">
            {loading ? (
              <Card className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading your meal plan...</p>
              </Card>
            ) : nutritionPlan?.days && Object.keys(nutritionPlan.days).length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={generateShoppingListFromCompleted} className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Generate Shopping List
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DAYS.map((day) => {
                    const dayPlan = nutritionPlan.days[day];
                    if (!dayPlan) return null;
                    
                    return (
                      <Card key={day} className="p-4 bg-card border-primary/10">
                        <h3 className="font-bold text-lg mb-3">{day}</h3>
                        <div className="space-y-3">
                          {MEAL_SLOTS.map((mealType) => {
                            const mealKey = mealType.charAt(0).toUpperCase() + mealType.slice(1);
                            const meals = dayPlan[mealKey];
                            if (!meals || meals.length === 0) return null;
                            const meal = meals[0];
                            
                            return (
                              <div key={mealType} className="border rounded p-2">
                                <div className="flex items-start gap-2">
                                  <Checkbox
                                    checked={isMealCompleted(day, mealType)}
                                    onCheckedChange={() => toggleMealCompletion(day, mealType)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="text-xs text-muted-foreground capitalize">{mealType}</div>
                                    <div className="font-medium text-sm">{meal.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {meal.kcal}kcal • {meal.protein_g}g protein
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <Calendar className="h-16 w-16 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No Meal Plan Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Visit MKRO Coach to get a personalized AI-generated meal plan.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/coach')} variant="default" size="lg">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Go to MKRO Coach
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Manual Log Tab */}
          <TabsContent value="manual-log" className="mt-6 space-y-6">
            {/* Add Meal Form */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Log New Meal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meal Name</label>
                  <Input 
                    placeholder="e.g., Chicken Salad" 
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meal Type</label>
                  <Select value={mealType} onValueChange={setMealType}>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calories</label>
                  <Input 
                    type="number" 
                    placeholder="400" 
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protein (g)</label>
                  <Input 
                    type="number" 
                    placeholder="20" 
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Carbs (g)</label>
                  <Input 
                    type="number" 
                    placeholder="50" 
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fats (g)</label>
                  <Input 
                    type="number" 
                    placeholder="15" 
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addManualMeal} className="mt-4 w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
            </Card>

            {/* Today's Meals */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Today's Meals</h3>
              {getTodayMeals().length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No meals logged today</p>
              ) : (
                <div className="space-y-2">
                  {getTodayMeals().map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium">{meal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {meal.mealType} • {meal.calories}kcal • P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteManualMeal(meal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* This Week's History */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">This Week's History</h3>
              {getThisWeekMeals().length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No meals logged this week</p>
              ) : (
                <div className="space-y-2">
                  {getThisWeekMeals().map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium">{meal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {meal.mealType} • {meal.calories}kcal • {new Date(meal.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteManualMeal(meal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Planner;