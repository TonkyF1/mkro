import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Download, Check } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface MealPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

interface ShoppingItem {
  ingredient: string;
  quantity: string;
  checked: boolean;
  estimatedCost: number;
}

interface ShoppingListProps {
  mealPlans: MealPlan[];
  onBack: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ mealPlans, onBack }) => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    // Extract and consolidate ingredients from all meals
    const ingredientMap = new Map<string, { quantity: string; cost: number }>();
    
    mealPlans.forEach(day => {
      [day.breakfast, day.lunch, day.dinner, day.snack]
        .filter(Boolean)
        .forEach(recipe => {
          recipe!.ingredients.forEach(ingredient => {
            // Simple ingredient parsing (in a real app, this would be more sophisticated)
            const cleanIngredient = ingredient.toLowerCase().replace(/^\d+\s*(cups?|tbsp|tsp|oz|lbs?|g|kg|slices?|can|bunch)\s*/g, '');
            const estimatedItemCost = recipe!.estimatedCost / recipe!.ingredients.length;
            
            if (ingredientMap.has(cleanIngredient)) {
              const existing = ingredientMap.get(cleanIngredient)!;
              ingredientMap.set(cleanIngredient, {
                quantity: existing.quantity,
                cost: existing.cost + estimatedItemCost
              });
            } else {
              ingredientMap.set(cleanIngredient, {
                quantity: ingredient,
                cost: estimatedItemCost
              });
            }
          });
        });
    });

    return Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
      ingredient,
      quantity: data.quantity,
      checked: false,
      estimatedCost: data.cost
    }));
  });

  const toggleItem = (index: number) => {
    setShoppingItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const totalCost = shoppingItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const checkedItems = shoppingItems.filter(item => item.checked).length;

  const exportList = () => {
    const listText = shoppingItems
      .map(item => `${item.checked ? '✓' : '☐'} ${item.quantity}`)
      .join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Shopping List</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportList}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onBack}>
            Back to Planner
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Items ({shoppingItems.length})</span>
                <span className="text-lg font-bold text-primary">
                  £{totalCost.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {shoppingItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                      item.checked ? 'bg-muted/50' : 'hover:bg-muted/20'
                    }`}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(index)}
                    />
                    <div className="flex-1">
                      <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      £{item.estimatedCost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{shoppingItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Checked Off:</span>
                <span className="font-semibold flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  {checkedItems}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Estimated Total:</span>
                <span className="text-primary">£{totalCost.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                *Costs are estimates based on average UK grocery prices
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Check your pantry first</li>
                <li>• Buy generic brands to save</li>
                <li>• Shop seasonal produce</li>
                <li>• Consider bulk buying for staples</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};