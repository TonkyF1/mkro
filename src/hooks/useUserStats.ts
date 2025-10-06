import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  challenges_completed: number;
  created_at: string;
  updated_at: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create initial stats
        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_xp: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0,
            challenges_completed: 0,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setStats(newStats);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPForNextLevel = () => {
    if (!stats) return 500;
    return stats.level * 500;
  };

  const getXPProgress = () => {
    if (!stats) return 0;
    const currentLevelXP = (stats.level - 1) * 500;
    const nextLevelXP = stats.level * 500;
    const progress = stats.total_xp - currentLevelXP;
    const total = nextLevelXP - currentLevelXP;
    return (progress / total) * 100;
  };

  return {
    stats,
    loading,
    getXPForNextLevel,
    getXPProgress,
    fetchStats,
  };
};
