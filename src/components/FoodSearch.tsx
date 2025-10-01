import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FoodResult {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving_size?: string;
}

interface FoodSearchProps {
  onAddFood: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
}

export const FoodSearch = ({ onAddFood }: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FoodResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-uk-foods', {
        body: { query }
      });

      if (error) throw error;

      setResults(data.results || []);
      
      if (data.results.length === 0 && query === searchQuery) {
        toast.info('No results found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search foods');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length > 2) {
      debounceTimer.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleAddFood = (food: FoodResult) => {
    onAddFood({
      name: food.brand ? `${food.brand} - ${food.name}` : food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats
    });
    toast.success('Food added to form');
    setSearchQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-4">
      <Popover open={showDropdown && results.length > 0} onOpenChange={setShowDropdown}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <Input
              placeholder="Search UK foods & drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSearch()} 
              disabled={isSearching}
              size="default"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[calc(100vw-2rem)] sm:w-[500px] p-2 max-h-96 overflow-y-auto z-50"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-1">
            {results.map((food, index) => (
              <Card 
                key={index} 
                className="p-3 hover:bg-accent cursor-pointer transition-colors border-0 shadow-none"
                onClick={() => handleAddFood(food)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {food.brand && <span className="text-muted-foreground">{food.brand} - </span>}
                      {food.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per {food.serving_size || '100g'}: {food.calories}kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                    </p>
                  </div>
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
