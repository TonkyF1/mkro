import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: string | null;
  fitness_level: string | null;
  diet_type: string | null;
  workout_preference: string | null;
  target_calories: number | null;
  target_protein: number | null;
  target_carbs: number | null;
  target_fats: number | null;
  is_premium: boolean | null;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  points: number | null;
  streak: number | null;
  level: string | null;
  ai_messages_today: number | null;
  ai_messages_reset_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return {
    ...query,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};
