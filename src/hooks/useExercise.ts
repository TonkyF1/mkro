import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface ExerciseLog {
  id: string;
  user_id: string;
  date: string;
  exercise_id?: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_min?: number;
  calories_burned?: number;
  notes?: string;
  created_at: string;
}

export const useExercise = (date: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['exercise-logs', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('date', date)
        .order('created_at');

      if (error) throw error;
      return data as ExerciseLog[];
    },
  });

  const addLogMutation = useMutation({
    mutationFn: async (log: Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('exercise_logs')
        .insert([{ ...log, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs', date] });
      toast({
        title: 'Logged',
        description: 'Exercise logged successfully',
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

  const deleteLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs', date] });
      toast({
        title: 'Deleted',
        description: 'Exercise log removed',
      });
    },
  });

  return {
    logs,
    isLoading,
    addLog: addLogMutation.mutate,
    deleteLog: deleteLogMutation.mutate,
  };
};