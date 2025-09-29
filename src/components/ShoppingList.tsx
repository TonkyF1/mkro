import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Download, Check, MapPin, Store } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { convertIngredientToGrams, getProductMapping, isLiquid } from '@/lib/ingredientConverter';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTrial } from '@/hooks/useTrial';
import UpgradePrompt from './UpgradePrompt';

interface MealPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

interface ShoppingItem {
  ingredient: string;
  productName: string;
  gramQuantity: number;
  retailerSuggestions: string[];
  quantity: string;
  checked: boolean;
  estimatedCost: number;
}

interface ShoppingListProps {
  mealPlans: MealPlan[];
  onBack: () => void;
}

interface Store {
  name: string;
  address: string;
  distance: number;
  chain: string;
  opening_hours?: string;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ mealPlans, onBack }) => {
  const { toast } = useToast();
  const { canUseFeature, isDevelopmentMode } = useTrial();
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [postcode, setPostcode] = useState('');
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    // Extract and consolidate ingredients from all meals with enhanced product mapping
    const ingredientMap = new Map<string, { 
      gramQuantity: number; 
      cost: number; 
      originalIngredient: string;
    }>();
    
    mealPlans.forEach(day => {
      [day.breakfast, day.lunch, day.dinner, day.snack]
        .filter(Boolean)
        .forEach(recipe => {
          recipe!.ingredients.forEach(ingredient => {
            const cleanIngredient = ingredient
              .toLowerCase()
              .replace(/^\s*(\d+\/\d+|\d+(?:\.\d+)?)\s*(cups?|cup|tbsp|tsp|oz|lbs?|g|kg|slices?|slice|can|bunch|pinch|cloves?|medium|large|small)?\s*/, '')
              .replace(/[^\w\s]/g, '')
              .replace(/\s{2,}/g, ' ')
              .trim();
            
            const gramAmount = convertIngredientToGrams(ingredient);
            const estimatedItemCost = recipe!.estimatedCost / recipe!.ingredients.length;
            
            if (ingredientMap.has(cleanIngredient)) {
              const existing = ingredientMap.get(cleanIngredient)!;
              ingredientMap.set(cleanIngredient, {
                gramQuantity: existing.gramQuantity + gramAmount,
                cost: existing.cost + estimatedItemCost,
                originalIngredient: existing.originalIngredient
              });
            } else {
              ingredientMap.set(cleanIngredient, {
                gramQuantity: gramAmount,
                cost: estimatedItemCost,
                originalIngredient: ingredient
              });
            }
          });
        });
    });

    return Array.from(ingredientMap.entries()).map(([ingredient, data]) => {
      const productMapping = getProductMapping(ingredient);
      const liquid = isLiquid(ingredient);
      
      // Convert grams to ml for liquids (1g ≈ 1ml for water-based liquids)
      const displayQuantity = liquid ? data.gramQuantity : data.gramQuantity;
      const unit = liquid 
        ? (displayQuantity >= 1000 ? 'L' : 'ml')
        : 'g';
      const displayValue = liquid && displayQuantity >= 1000
        ? (displayQuantity / 1000).toFixed(2)
        : displayQuantity;
      
      return {
        ingredient,
        productName: productMapping?.productName || ingredient,
        gramQuantity: data.gramQuantity,
        retailerSuggestions: productMapping?.retailerSuggestions || [],
        quantity: `${displayValue}${unit}`,
        checked: false,
        estimatedCost: data.cost
      };
    });
  });

  const toggleItem = (index: number) => {
    setShoppingItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const saveToSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your shopping list.",
          variant: "destructive"
        });
        return;
      }

      // Clear existing shopping results for this user
      await supabase
        .from('shopping_results')
        .delete()
        .eq('user_id', user.id);

      // Insert new shopping items
      const dataToInsert = shoppingItems.map(item => ({
        user_id: user.id,
        product_name: item.productName,
        gram_quantity: item.gramQuantity,
        ingredient_type: item.ingredient,
        estimated_price: item.estimatedCost,
        store_availability: { retailers: item.retailerSuggestions }
      }));

      const { error } = await supabase
        .from('shopping_results')
        .insert(dataToInsert);

      if (error) throw error;

      toast({
        title: "Shopping List Saved",
        description: "Your enhanced shopping list has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      toast({
        title: "Error",
        description: "Failed to save shopping list. Please try again.",
        variant: "destructive"
      });
    }
  };

  const findNearbyStores = async () => {
    if (!postcode.trim()) {
      toast({
        title: "Postcode Required",
        description: "Please enter your postcode to find nearby stores.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingStores(true);
    try {
      const { data, error } = await supabase.functions.invoke('crystalroof-proxy', {
        body: { postcode: postcode.trim(), radius: 5 }
      });

      if (error) throw error;

      setNearbyStores(data.stores || []);
      toast({
        title: "Stores Found",
        description: `Found ${data.stores?.length || 0} nearby stores.`
      });
    } catch (error) {
      console.error('Error finding stores:', error);
      toast({
        title: "Error",
        description: "Failed to find nearby stores. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStores(false);
    }
  };

  const totalCost = shoppingItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const checkedItems = shoppingItems.filter(item => item.checked).length;
  const totalGrams = shoppingItems.reduce((sum, item) => sum + item.gramQuantity, 0);

  const exportList = () => {
    const listText = shoppingItems
      .map(item => `${item.checked ? '✓' : '☐'} ${item.productName} (${item.quantity} total)${item.retailerSuggestions.length > 0 ? ` - Available: ${item.retailerSuggestions[0]}` : ''}`)
      .join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show upgrade prompt if trial expired and not in development
  if (!canUseFeature('shopping') && !isDevelopmentMode) {
    return (
      <UpgradePrompt 
        feature="Shopping List Generator" 
        description="Your free trial has ended. Upgrade to Premium to continue using the shopping list generator."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Shopping List</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportList} size="sm">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" onClick={saveToSupabase} size="sm">
            <ShoppingCart className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save List</span>
          </Button>
          <Button onClick={onBack} size="sm">
            <span className="hidden sm:inline">Back to Planner</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enhanced Shopping List ({shoppingItems.length})</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">
                    £{totalCost.toFixed(2)}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {totalGrams}g total
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {shoppingItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg transition-colors ${
                      item.checked ? 'bg-muted/50' : 'hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(index)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                            {item.productName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            £{item.estimatedCost.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} needed
                        </div>
                        {item.retailerSuggestions.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <Store className="h-3 w-3 inline mr-1" />
                            Available: {item.retailerSuggestions[0]}
                            {item.retailerSuggestions.length > 1 && (
                              <span className="ml-1">+{item.retailerSuggestions.length - 1} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Finder */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Nearby Shops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter your postcode (e.g., SW1A 1AA)"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button 
                  onClick={findNearbyStores} 
                  disabled={isLoadingStores}
                >
                  {isLoadingStores ? 'Searching...' : 'Find Stores'}
                </Button>
              </div>
              
              {nearbyStores.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {nearbyStores.map((store, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-muted-foreground">{store.address}</div>
                          {store.opening_hours && (
                            <div className="text-xs text-muted-foreground">{store.opening_hours}</div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {store.distance}km
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span className="font-semibold">{totalGrams}g</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Estimated Total:</span>
                <span className="text-primary">£{totalCost.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                *UK supermarket prices with gram conversions
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Check quantities against package sizes</li>
                <li>• Compare prices across suggested retailers</li>
                <li>• Buy in bulk for frequently used items</li>
                <li>• Look for store-brand alternatives</li>
                <li>• Consider frozen alternatives for fresh produce</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};