import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutPlan {
  id: string;
  goal_type: string;
  day_number: number;
  day_name: string;
  workout_name: string;
  duration: number | null;
  exercises: Exercise[];
  is_premium: boolean | null;
}

export const useWorkoutPlans = (goalType?: string) => {
  return useQuery({
    queryKey: ['workout_plans', goalType],
    queryFn: async () => {
      let query = supabase
        .from('workout_plans')
        .select('*')
        .order('day_number');

      if (goalType) {
        query = query.eq('goal_type', goalType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        exercises: item.exercises as Exercise[]
      }));
    },
  });
};
