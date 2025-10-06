-- Fix search_path for update_challenges_updated_at function
DROP FUNCTION IF EXISTS public.update_challenges_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_challenges_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_challenges_updated_at();

CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_challenges_updated_at();