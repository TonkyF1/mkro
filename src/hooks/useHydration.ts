import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useHydration = (date: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['hydration', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hydration_logs')
        .select('*')
        .eq('date', date)
        .order('created_at');

      if (error) throw error;
      return data;
    },
  });

  const totalMl = logs?.reduce((sum, log) => sum + log.ml, 0) || 0;

  const addLogMutation = useMutation({
    mutationFn: async (ml: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('hydration_logs')
        .insert([{ date, ml, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydration', date] });
      toast({
        title: 'Logged',
        description: 'Water intake logged',
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

  return {
    logs,
    totalMl,
    isLoading,
    addLog: addLogMutation.mutate,
  };
};