import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  cook_time: number | null;
  servings: number | null;
  meal_type: string | null;
  category: string | null;
  tags: string[] | null;
  is_premium: boolean | null;
  instructions: string | null;
  ingredients: any;
}

export const useRecipes = (filter?: string) => {
  return useQuery({
    queryKey: ['recipes', filter],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('name');

      if (filter && filter !== 'All') {
        const lowerFilter = filter.toLowerCase().replace(/ /g, '_');
        query = query.or(`meal_type.eq.${lowerFilter},category.eq.${lowerFilter},tags.cs.{${filter.toLowerCase()}}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Recipe[];
    },
  });
};
