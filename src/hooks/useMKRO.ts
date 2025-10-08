import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useMKRO = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generatePlan = async (days = 7, planType: 'nutrition' | 'training' | 'both' = 'both') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-plan', {
        body: { days, plan_type: planType }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${days}-day plan generated and added to your diary!`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate plan',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recalculateMacros = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-macros-recalc');

      if (error) throw error;

      toast({
        title: 'Macros Updated',
        description: `Daily target: ${data.daily_calorie_target} kcal`,
      });

      return data;
    } catch (error: any) {
      console.error('Error recalculating macros:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to recalculate macros',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyReport = async (weekStart?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-weekly-report', {
        body: { week_start: weekStart }
      });

      if (error) throw error;

      toast({
        title: 'Report Generated',
        description: 'Your weekly report is ready!',
      });

      return data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate report',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generatePlan,
    recalculateMacros,
    generateWeeklyReport,
    loading,
  };
};