import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseRecipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietary_tags: string[];
  created_at?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietary_tags: string[];
  created_at?: string;
  // Legacy fields for compatibility - these are required for components
  description: string;
  prepTime: string;
  servingSize: string;
  dietaryTags: string[];
  substitution: string;
  imageDescription: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  estimatedCost: number;
  image?: string;
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Use a generic query that will work regardless of types
        const response = await supabase
          .from('recipes' as any)
          .select('*');

        if (response.error) {
          throw response.error;
        }

        // Transform database recipes to match component expectations
        const transformedRecipes: Recipe[] = (response.data || []).map((recipe: any) => ({
          ...recipe,
          // Create legacy compatibility fields
          description: `A delicious ${recipe.name.toLowerCase()} recipe with ${recipe.calories} calories`,
          prepTime: `${recipe.prep_time} minutes`,
          servingSize: `${recipe.servings} serving${recipe.servings > 1 ? 's' : ''}`,
          dietaryTags: recipe.dietary_tags,
          substitution: 'Check ingredients for possible substitutions',
          imageDescription: `A beautiful image of ${recipe.name.toLowerCase()}`,
          category: 'breakfast' as const, // Set all to breakfast so they show by default
          estimatedCost: Math.round((recipe.calories / 100) * 2.5) // Rough cost estimation
        }));

        console.log('Transformed recipes:', transformedRecipes);
        setRecipes(transformedRecipes);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const refetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await supabase
        .from('recipes' as any)
        .select('*');

      if (response.error) {
        throw response.error;
      }

      const transformedRecipes: Recipe[] = (response.data || []).map((recipe: any) => ({
        ...recipe,
        description: `A delicious ${recipe.name.toLowerCase()} recipe with ${recipe.calories} calories`,
        prepTime: `${recipe.prep_time} minutes`,
        servingSize: `${recipe.servings} serving${recipe.servings > 1 ? 's' : ''}`,
        dietaryTags: recipe.dietary_tags,
        substitution: 'Check ingredients for possible substitutions',
        imageDescription: `A beautiful image of ${recipe.name.toLowerCase()}`,
        category: 'breakfast' as const, // Set all to breakfast so they show by default
        estimatedCost: Math.round((recipe.calories / 100) * 2.5)
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
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
    (recipe.dietary_tags || recipe.dietaryTags || []).forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};