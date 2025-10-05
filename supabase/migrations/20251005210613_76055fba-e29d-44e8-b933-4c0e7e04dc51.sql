-- Add subscription fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'expired')),
ADD COLUMN IF NOT EXISTS subscription_expiry timestamp with time zone,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Create index for faster subscription queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Update existing is_premium field to sync with subscription_status
UPDATE public.profiles 
SET subscription_status = CASE 
  WHEN is_premium = true THEN 'premium'
  ELSE 'free'
END
WHERE subscription_status = 'free';