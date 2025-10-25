import React, { useState, useMemo, useEffect } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import { useRecipes, Recipe, getAllDietaryTags } from '@/hooks/useRecipes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { testImageGeneration } from '@/utils/testImageGeneration';
import { Input } from '@/components/ui/input';
import { Search, ChefHat, Sparkles, TrendingUp, Filter, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Recipes = () => {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';
  const { recipes, loading: recipesLoading, error: recipesError } = useRecipes(isPremium);
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Recipe Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Discover delicious and nutritious recipes</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {isPremium ? 'Recipes' : 'Available'}
                  </span>
                </div>
                <p className="text-lg font-bold">
                  {recipes.length}
                  {!isPremium && <span className="text-xs text-muted-foreground">/12</span>}
                </p>
              </div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Filtered</span>
                </div>
                <p className="text-lg font-bold">{filteredRecipes.length}</p>
              </div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active</span>
                </div>
                <p className="text-lg font-bold">{selectedTags.length + (selectedCategory !== 'all' ? 1 : 0)}</p>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm"
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

        {/* Free User Recipe Limit Notice */}
        {!isPremium && recipes.length >= 12 && (
          <Card className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Want Access to More Recipes?</h3>
              <p className="text-muted-foreground mb-4">
                You're viewing 12 of our premium recipe collection. Upgrade to unlock unlimited recipes!
              </p>
              <Button 
                onClick={() => navigate('/premium')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Crown className="w-4 h-4 mr-2" />
                View Premium
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recipes;
