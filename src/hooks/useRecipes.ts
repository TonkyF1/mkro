import { useState, useEffect } from 'react';
import { recipes as staticRecipes, Recipe, getRecipesByCategory as getStaticRecipesByCategory, getRecipeById as getStaticRecipeById, getAllDietaryTags as getStaticAllDietaryTags } from '@/data/recipes';

// Re-export Recipe type for other components
export type { Recipe };

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipes = () => {
      try {
        setLoading(true);
        // Use static recipes data
        setRecipes(staticRecipes);
        console.log('Loaded static recipes:', staticRecipes);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const refetchRecipes = () => {
    try {
      setLoading(true);
      setRecipes(staticRecipes);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, refetch: refetchRecipes };
};

export const getRecipesByCategory = (recipes: Recipe[], category: string) => {
  if (category === 'all') return recipes;
  return recipes.filter(recipe => recipe.category === category);
};

export const getRecipeById = (recipes: Recipe[], id: string) => {
  return recipes.find(recipe => recipe.id === id);
};

export const getAllDietaryTags = (recipes: Recipe[]) => {
  const tags = new Set<string>();
  recipes.forEach(recipe => {
    recipe.dietaryTags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};