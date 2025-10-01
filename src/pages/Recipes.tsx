import React, { useState, useMemo, useEffect } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import { useRecipes, Recipe, getAllDietaryTags } from '@/hooks/useRecipes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { testImageGeneration } from '@/utils/testImageGeneration';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
    if (selectedRecipe) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedRecipe]);

  if (selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={selectedRecipe} 
        onBack={() => setSelectedRecipe(null)} 
        onAddToShoppingList={handleAddToShoppingList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {profile?.name?.toUpperCase()}!
        </h1>
        <p className="text-muted-foreground">
          Ready to plan your nutritious meals?
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <RecipeFilter
        categories={categories}
        dietaryTags={dietaryTags}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={setSelectedCategory}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
      />
      
      {recipesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : recipesError ? (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading recipes: {recipesError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => setSelectedRecipe(recipe)}
              onAddToMealPlan={addRecipeToMealPlan}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
