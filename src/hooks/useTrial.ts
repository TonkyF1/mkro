import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTrial = () => {
  const { user } = useAuth();
  const { profile, fetchProfile } = useUserProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're in development/preview mode
  const host = window?.location?.hostname || '';
  const isDevelopmentMode = host === 'localhost' ||
                           host.includes('lovable.app') ||
                           host.includes('lovable.dev') ||
                           host.includes('lovableproject.com');

  const initializeTrial = async () => {
    if (!user || !profile || profile.trial_start_date || isDevelopmentMode) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          trial_start_date: new Date().toISOString(),
          trial_prompts_used: 0
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchProfile();
    } catch (error) {
      console.error('Error initializing trial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementPromptUsage = async () => {
    if (!user || !profile || isDevelopmentMode) return true;

    if (!profile.trial_start_date) {
      await initializeTrial();
      return true;
    }

    const promptsUsed = (profile.trial_prompts_used || 0) + 1;
    
    if (promptsUsed > 20 && !profile.is_premium) {
      toast({
        variant: 'destructive',
        title: 'Trial Limit Reached',
        description: 'Upgrade to Premium to continue using MKRO Coach.',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ trial_prompts_used: promptsUsed })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchProfile();
      return true;
    } catch (error) {
      console.error('Error updating prompt usage:', error);
      return false;
    }
  };

  const getTrialStatus = () => {
    if (isDevelopmentMode) {
      return {
        isInTrial: false,
        daysLeft: 0,
        isTrialExpired: false,
        promptsRemaining: 999,
        canUseFeature: () => true
      };
    }

    if (!profile) {
      return {
        isInTrial: false,
        daysLeft: 0,
        isTrialExpired: false,
        promptsRemaining: 0,
        canUseFeature: () => false
      };
    }

    const { trial_start_date, trial_prompts_used = 0, is_premium } = profile;
    
    if (is_premium) {
      return {
        isInTrial: false,
        daysLeft: 0,
        isTrialExpired: false,
        promptsRemaining: 999,
        canUseFeature: () => true
      };
    }

    if (!trial_start_date) {
      return {
        isInTrial: true,
        daysLeft: 7,
        isTrialExpired: false,
        promptsRemaining: 20,
        canUseFeature: (feature: string) => true
      };
    }

    const trialStart = new Date(trial_start_date);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 7 - daysPassed);
    const isTrialExpired = daysLeft === 0;
    const promptsRemaining = Math.max(0, 20 - trial_prompts_used);

    const canUseFeature = (feature: string) => {
      // Allow all features during trial period
      if (!isTrialExpired) return true;
      
      // Only lock premium features after trial expires
      if (feature === 'coach' && isTrialExpired) return false;
      if (feature === 'shopping' && isTrialExpired) return false;
      return true;
    };

    return {
      isInTrial: !isTrialExpired,
      daysLeft,
      isTrialExpired,
      promptsRemaining,
      canUseFeature
    };
  };

  useEffect(() => {
    if (user && profile && !profile.trial_start_date && !profile.is_premium && !isDevelopmentMode) {
      initializeTrial();
    }
  }, [user, profile]);

  return {
    ...getTrialStatus(),
    incrementPromptUsage,
    isLoading,
    isDevelopmentMode
  };
};