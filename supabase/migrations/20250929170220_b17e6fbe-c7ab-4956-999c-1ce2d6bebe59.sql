-- Add trial tracking columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN trial_start_date TIMESTAMPTZ,
ADD COLUMN trial_prompts_used INTEGER DEFAULT 0,
ADD COLUMN is_premium BOOLEAN DEFAULT false;