import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface TodayPlan {
  workout: any | null;
  meals: any[];
  plan_summary: any | null;
  daily_targets: any | null;
}

export const useCoach = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayPlan, setTodayPlan] = useState<TodayPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodayPlan();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTodayPlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('coach-today', {
        body: {},
      });

      if (error) throw error;
      setTodayPlan(data);
    } catch (error) {
      console.error('Error fetching today plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load today\'s plan.',
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (weeks: number = 4) => {
    if (!user) return;

    try {
      setGenerating(true);
      const { data, error } = await supabase.functions.invoke('coach-generate-plan', {
        body: { weeks },
      });

      if (error) throw error;

      toast({
        title: 'Plan Generated!',
        description: `Your ${weeks}-week plan is ready.`,
      });

      await fetchTodayPlan();
      return data;
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate plan.',
      });
      throw error;
    } finally {
      setGenerating(false);
    }
  };

  const submitCheckin = async (metrics: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('coach-checkin', {
        body: { metrics },
      });

      if (error) throw error;

      toast({
        title: 'Check-in Complete',
        description: 'Your progress has been logged.',
      });

      return data;
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit check-in.',
      });
      throw error;
    }
  };

  return {
    todayPlan,
    loading,
    generating,
    fetchTodayPlan,
    generatePlan,
    submitCheckin,
  };
};
