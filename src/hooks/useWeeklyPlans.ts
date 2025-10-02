import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useWeeklyPlans = (weekStartISO?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);
  const [trainingPlan, setTrainingPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get current week's Monday
  const getCurrentWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (0) or other days
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split('T')[0];
  };

  const weekStart = weekStartISO || getCurrentWeekStart();

  useEffect(() => {
    if (user) {
      fetchPlans();
    } else {
      setLoading(false);
    }
  }, [user, weekStart]);

  const fetchPlans = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch nutrition plan
      const { data: nutritionData, error: nutritionError } = await supabase
        .from('weekly_nutrition_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (nutritionError) throw nutritionError;
      setNutritionPlan(nutritionData);

      // Fetch training plan
      const { data: trainingData, error: trainingError } = await supabase
        .from('weekly_training_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (trainingError) throw trainingError;
      setTrainingPlan(trainingData);

    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load weekly plans.',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePlans = async (saveDirectives: any) => {
    if (!user) return;

    try {
      const { week_start_iso, write } = saveDirectives;

      // Save nutrition plan if specified
      if (write.nutrition) {
        const { days, data } = write.nutrition;
        
        // Get existing plan or create new
        const { data: existing } = await supabase
          .from('weekly_nutrition_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start', week_start_iso)
          .maybeSingle();

        const currentDays = existing?.days || {};
        
        // Merge new days with existing
        days.forEach((day: string) => {
          currentDays[day] = data[day];
        });

        // Upsert
        const { error } = await supabase
          .from('weekly_nutrition_plans')
          .upsert({
            user_id: user.id,
            week_start: week_start_iso,
            days: currentDays,
          }, {
            onConflict: 'user_id,week_start'
          });

        if (error) throw error;
      }

      // Save training plan if specified
      if (write.training) {
        const { days, data } = write.training;
        
        // Get existing plan or create new
        const { data: existing } = await supabase
          .from('weekly_training_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start', week_start_iso)
          .maybeSingle();

        const currentDays = existing?.days || {};
        
        // Merge new days with existing
        days.forEach((day: string) => {
          currentDays[day] = data[day];
        });

        // Upsert
        const { error } = await supabase
          .from('weekly_training_plans')
          .upsert({
            user_id: user.id,
            week_start: week_start_iso,
            days: currentDays,
          }, {
            onConflict: 'user_id,week_start'
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Weekly plans saved successfully!',
      });

      // Refresh plans
      await fetchPlans();

    } catch (error) {
      console.error('Error saving plans:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save plans.',
      });
      throw error;
    }
  };

  return {
    nutritionPlan,
    trainingPlan,
    loading,
    fetchPlans,
    savePlans,
  };
};