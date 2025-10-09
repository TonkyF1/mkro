import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AIPlan {
  id: string;
  user_id: string;
  plan_type: 'nutrition' | 'training' | 'both';
  start_date: string;
  end_date: string;
  payload: any;
  created_at: string;
}

export const useAIPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: latestPlan, isLoading } = useQuery({
    queryKey: ['ai-plan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as AIPlan | null;
    },
  });

  const generatePlanMutation = useMutation({
    mutationFn: async ({ days = 7, plan_type = 'both' }: { days?: number; plan_type?: 'nutrition' | 'training' | 'both' }) => {
      const { data, error } = await supabase.functions.invoke('ai-generate-plan', {
        body: { days, plan_type },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-plan'] });
      queryClient.invalidateQueries({ queryKey: ['diary'] });
      toast({
        title: 'Plan Generated',
        description: 'Your AI plan has been created',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate plan',
      });
    },
  });

  const recalculateMacrosMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-macros-recalc');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Macros Updated',
        description: 'Your macro targets have been recalculated',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to recalculate macros',
      });
    },
  });

  return {
    latestPlan,
    isLoading,
    generatePlan: generatePlanMutation.mutate,
    recalculateMacros: recalculateMacrosMutation.mutate,
    isGenerating: generatePlanMutation.isPending,
    isRecalculating: recalculateMacrosMutation.isPending,
  };
};