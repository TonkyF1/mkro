import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserProfile } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      // SECURITY: Don't log error details that might contain sensitive data
      console.error('Error fetching profile');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load profile data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: UserProfile) => {
    if (!user) return;

    try {
      // Optimistically update the local state first
      setProfile({ ...profileData, user_id: user.id } as UserProfile);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Fetch the updated profile to ensure we have the latest data
      await fetchProfile();
      
      toast({
        title: 'Success',
        description: 'Profile saved successfully!',
      });
    } catch (error) {
      // Revert optimistic update on error
      await fetchProfile();
      // SECURITY: Don't log error details that might contain sensitive data
      console.error('Error saving profile');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile.',
      });
      throw error;
    }
  };

  return {
    profile,
    loading,
    saveProfile,
    fetchProfile,
  };
};