import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface MealCompletion {
  id: string;
  day_name: string;
  meal_type: string;
  completed: boolean;
  completed_at?: string;
}

export const useMealCompletions = (weekStart?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [completions, setCompletions] = useState<MealCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStreak, setWeeklyStreak] = useState(0);

  const getCurrentWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split('T')[0];
  };

  const targetWeekStart = weekStart || getCurrentWeekStart();

  useEffect(() => {
    if (user) {
      fetchCompletions();
    } else {
      setLoading(false);
    }
  }, [user, targetWeekStart]);

  const fetchCompletions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', targetWeekStart);

      if (error) throw error;

      setCompletions(data || []);
      calculateWeeklyStreak(data || []);
    } catch (error) {
      console.error('Error fetching meal completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyStreak = (data: MealCompletion[]) => {
    const completedDays = new Set<string>();
    
    data.forEach(meal => {
      if (meal.completed) {
        completedDays.add(meal.day_name);
      }
    });

    setWeeklyStreak(completedDays.size);
  };

  const toggleMealCompletion = async (dayName: string, mealType: string) => {
    if (!user) return;

    try {
      const existing = completions.find(
        c => c.day_name === dayName && c.meal_type === mealType
      );

      if (existing) {
        const newCompleted = !existing.completed;
        const { error } = await supabase
          .from('meal_completions')
          .update({
            completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meal_completions')
          .insert({
            user_id: user.id,
            week_start: targetWeekStart,
            day_name: dayName,
            meal_type: mealType,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      await fetchCompletions();
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('meal-completion-updated'));
    } catch (error) {
      console.error('Error toggling meal completion:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update meal completion.',
      });
    }
  };

  const deleteDayMeals = async (dayName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meal_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('week_start', targetWeekStart)
        .eq('day_name', dayName);

      if (error) throw error;

      await fetchCompletions();
      
      toast({
        title: 'Day Cleared',
        description: `All meal tracking for ${dayName} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting day meals:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear day meals.',
      });
    }
  };

  const isMealCompleted = (dayName: string, mealType: string) => {
    return completions.some(
      c => c.day_name === dayName && c.meal_type === mealType && c.completed
    );
  };

  return {
    completions,
    loading,
    weeklyStreak,
    toggleMealCompletion,
    deleteDayMeals,
    isMealCompleted,
    fetchCompletions,
  };
};
