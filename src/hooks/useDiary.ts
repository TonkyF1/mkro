import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface DiaryMeal {
  id: string;
  user_id: string;
  date: string;
  meal_slot: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id?: string;
  custom_entry?: any;
  is_completed: boolean;
  recipes?: any;
}

export const useDiary = (date: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery({
    queryKey: ['diary', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diary_meals')
        .select('*, recipes(*)')
        .eq('date', date)
        .order('meal_slot');

      if (error) throw error;
      return data as DiaryMeal[];
    },
  });

  const { data: totals } = useQuery({
    queryKey: ['day-totals', date],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('fn_day_totals', { d: date }) as any;
      if (error) throw error;
      return data?.[0] || { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
    },
  });

  const addMealMutation = useMutation({
    mutationFn: async (meal: {
      date: string;
      meal_slot: string;
      recipe_id?: string;
      custom_entry?: any;
    }) => {
      const { data, error } = await supabase
        .from('diary_meals')
        .insert([meal])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', date] });
      queryClient.invalidateQueries({ queryKey: ['day-totals', date] });
      toast({
        title: 'Added',
        description: 'Meal added to diary',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { data, error } = await supabase.rpc('fn_toggle_meal_complete', {
        p_meal: mealId,
      }) as any;

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['diary', date] });
      queryClient.setQueryData(['day-totals', date], data?.[0]);
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { error } = await supabase
        .from('diary_meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', date] });
      queryClient.invalidateQueries({ queryKey: ['day-totals', date] });
      toast({
        title: 'Deleted',
        description: 'Meal removed from diary',
      });
    },
  });

  return {
    meals,
    totals,
    isLoading,
    addMeal: addMealMutation.mutate,
    toggleComplete: toggleCompleteMutation.mutate,
    deleteMeal: deleteMealMutation.mutate,
  };
};