import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description: string;
  challenge_type: 'nutrition' | 'exercise' | 'hydration' | 'habit';
  target_value: number;
  current_progress: number;
  xp_reward: number;
  status: 'active' | 'completed' | 'failed';
  difficulty: 'easy' | 'medium' | 'hard';
  start_date: string;
  end_date: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user]);

  const fetchChallenges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data as Challenge[] || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load challenges.',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (challengeId: string, progress: number) => {
    if (!user) return;

    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const isCompleting = progress >= challenge.target_value && challenge.status === 'active';

      const { error } = await supabase
        .from('challenges')
        .update({
          current_progress: progress,
          status: isCompleting ? 'completed' : challenge.status,
          completed_at: isCompleting ? new Date().toISOString() : challenge.completed_at,
        })
        .eq('id', challengeId);

      if (error) throw error;

      if (isCompleting) {
        // Update user stats
        await awardXP(challenge.xp_reward);
        
        toast({
          title: '🎉 Challenge Completed!',
          description: `You earned ${challenge.xp_reward} XP!`,
        });
      }

      await fetchChallenges();
    } catch (error) {
      console.error('Error updating challenge:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update challenge progress.',
      });
    }
  };

  const awardXP = async (xpAmount: number) => {
    if (!user) return;

    try {
      // First try to get existing stats
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const newTotalXP = (existingStats?.total_xp || 0) + xpAmount;
      const newLevel = Math.floor(newTotalXP / 500) + 1;
      const newChallengesCompleted = (existingStats?.challenges_completed || 0) + 1;

      if (existingStats) {
        await supabase
          .from('user_stats')
          .update({
            total_xp: newTotalXP,
            level: newLevel,
            challenges_completed: newChallengesCompleted,
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_xp: newTotalXP,
            level: newLevel,
            challenges_completed: newChallengesCompleted,
          });
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  const getActiveChallenges = () => challenges.filter(c => c.status === 'active');
  const getCompletedChallenges = () => challenges.filter(c => c.status === 'completed');

  return {
    challenges,
    activeChallenges: getActiveChallenges(),
    completedChallenges: getCompletedChallenges(),
    loading,
    updateProgress,
    fetchChallenges,
  };
};
