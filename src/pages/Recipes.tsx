import React, { useState, useMemo, useEffect } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import { useRecipes, Recipe, getAllDietaryTags } from '@/hooks/useRecipes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { testImageGeneration } from '@/utils/testImageGeneration';
import { Input } from '@/components/ui/input';
import { Search, ChefHat, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Recipes = () => {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const { recipes, loading: recipesLoading, error: recipesError } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // TEST: Run once on page load
  useEffect(() => {
    console.log('🚀 Running image generation test...');
    testImageGeneration();
  }, []);

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];
  const dietaryTags = getAllDietaryTags(recipes);

  const filteredRecipes = recipes.filter(recipe => {
    const categoryMatch = selectedCategory === 'all' || recipe.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => recipe.dietaryTags.includes(tag));
    const searchMatch = searchQuery === '' || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && tagMatch && searchMatch;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const addRecipeToMealPlan = (recipe: Recipe, day: string, mealType: string) => {
    const stored = localStorage.getItem('mealPlan');
    let existing: any[] = [];
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) existing = parsed;
    } catch {}

    // Normalize to a 7-day structure
    const normalized = DAYS.map(d => {
      const match = existing.find((x: any) => x && x.date === d) || {};
      return { date: d, ...match };
    });

    const dayIndex = DAYS.indexOf(day);
    if (dayIndex === -1) return;

    const updatedMealPlan = normalized.map((mealDay: any, index: number) =>
      index === dayIndex
        ? { ...mealDay, [mealType]: recipe }
        : mealDay
    );

    localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));

    toast({
      title: "Recipe Added!",
      description: `${recipe.name} has been added to ${day} ${mealType}.`
    });
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const updatedPlan = [...mealPlan, { date: today, breakfast: recipe }];
    localStorage.setItem('mealPlan', JSON.stringify(updatedPlan));
    
    toast({
      title: "Recipe Added!",
      description: `${recipe.name} has been added to your shopping list.`
    });
  };

  
  useEffect(() => {
    const handleStorageUpdate = () => {
      // Trigger UI refresh when meal plan updates
      setSelectedRecipe(null);
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onAddToMealPlan={addRecipeToMealPlan}
        onAddToShoppingList={handleAddToShoppingList}
      />
    );
  }

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
                Recipe Library
              </h1>
              <p className="text-muted-foreground">Discover delicious and nutritious recipes</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Recipes</p>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                  <p className="text-2xl font-bold">{filteredRecipes.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Filters</p>
                  <p className="text-2xl font-bold">{selectedTags.length + (selectedCategory !== 'all' ? 1 : 0)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <RecipeFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            dietaryTags={dietaryTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </Card>

        {/* Recipe Grid */}
        {recipesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading delicious recipes...</p>
            </div>
          </div>
        ) : recipesError ? (
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading recipes. Please try again.</p>
          </Card>
        ) : filteredRecipes.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">No recipes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
