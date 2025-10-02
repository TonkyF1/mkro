-- Create weekly nutrition plan table
CREATE TABLE IF NOT EXISTS public.weekly_nutrition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  days jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own nutrition plans"
  ON public.weekly_nutrition_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition plans"
  ON public.weekly_nutrition_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition plans"
  ON public.weekly_nutrition_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition plans"
  ON public.weekly_nutrition_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create weekly training plan table
CREATE TABLE IF NOT EXISTS public.weekly_training_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  days jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_training_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own training plans"
  ON public.weekly_training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training plans"
  ON public.weekly_training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training plans"
  ON public.weekly_training_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training plans"
  ON public.weekly_training_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_weekly_nutrition_plans_updated_at
  BEFORE UPDATE ON public.weekly_nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_training_plans_updated_at
  BEFORE UPDATE ON public.weekly_training_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();