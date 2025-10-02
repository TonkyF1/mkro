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
  const [activeWeekStart, setActiveWeekStart] = useState<string | null>(null);

  // Get current week's Monday
  const getCurrentWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (0) or other days
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split('T')[0];
  };

  const targetWeekStart = weekStartISO || getCurrentWeekStart();

  useEffect(() => {
    if (user) {
      fetchPlans();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, targetWeekStart]);

  const fetchNearest = async (table: string, current: string) => {
    // Use untyped client to avoid TS unions across tables
    const client: any = supabase as any;

    // 1) Try next upcoming or current
    let res = await client
      .from(table)
      .select('*')
      .eq('user_id', user!.id)
      .gte('week_start', current)
      .order('week_start', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (res?.data) return res.data as any;

    // 2) Fallback to most recent past
    res = await client
      .from(table)
      .select('*')
      .eq('user_id', user!.id)
      .lte('week_start', current)
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle();

    return res?.data || null;
  };

  const fetchPlans = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch nutrition plan for requested week
      let { data: nutritionData } = await supabase
        .from('weekly_nutrition_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', targetWeekStart)
        .maybeSingle();

      if (!nutritionData) {
        nutritionData = await fetchNearest('weekly_nutrition_plans', targetWeekStart);
      }
      setNutritionPlan(nutritionData);

      // Fetch training plan
      let { data: trainingData } = await supabase
        .from('weekly_training_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', targetWeekStart)
        .maybeSingle();

      if (!trainingData) {
        trainingData = await fetchNearest('weekly_training_plans', targetWeekStart);
      }
      setTrainingPlan(trainingData);

      // Update active week
      setActiveWeekStart(
        (nutritionData && nutritionData.week_start) ||
        (trainingData && trainingData.week_start) ||
        targetWeekStart
      );

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

  const savePlans = async (saveDirectives: any, options?: { replace?: boolean }) => {
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

        // Determine new days content (replace vs merge)
        const newDays: any = options?.replace ? (data as any) : { ...((existing?.days as any) || {}) };

        if (!options?.replace) {
          // Merge new days with existing subset
          days.forEach((day: string) => {
            newDays[day] = data[day];
          });
        }
        
        // Upsert
        const { error } = await supabase
          .from('weekly_nutrition_plans')
          .upsert({
            user_id: user.id,
            week_start: week_start_iso,
            days: newDays,
          }, {
            onConflict: 'user_id,week_start'
          });

        if (error) throw error;
      }

      // Save training plan if specified
      if (write.training) {
        const { days, data } = write.training;
        
        const { data: existing } = await supabase
          .from('weekly_training_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start', week_start_iso)
          .maybeSingle();

        const newDays: any = options?.replace ? (data as any) : { ...((existing?.days as any) || {}) };
        
        if (!options?.replace) {
          days.forEach((day: string) => {
            newDays[day] = data[day];
          });
        }
        
        const { error } = await supabase
          .from('weekly_training_plans')
          .upsert({
            user_id: user.id,
            week_start: week_start_iso,
            days: newDays,
          }, {
            onConflict: 'user_id,week_start'
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Weekly plans saved successfully!',
      });

      // Refresh to the saved week
      setActiveWeekStart(week_start_iso);
      await fetchPlans();

      // Broadcast a custom event so other tabs/pages can refresh
      window.dispatchEvent(new CustomEvent('mkro:plans-updated', { detail: { week_start_iso } }));

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
    activeWeekStart,
  };
};