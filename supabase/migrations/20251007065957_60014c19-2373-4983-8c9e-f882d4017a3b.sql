-- Create enum for plan types
CREATE TYPE public.plan_type AS ENUM ('training', 'nutrition', 'hybrid');

-- Create enum for event kinds
CREATE TYPE public.event_kind AS ENUM ('checkin', 'plan_update', 'deload', 'injury_adjust');

-- Create enum for training phases
CREATE TYPE public.training_phase AS ENUM ('base', 'build', 'peak', 'deload');

-- Update profiles table to include new coaching fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sex TEXT,
ADD COLUMN IF NOT EXISTS height_cm NUMERIC,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS bodyfat_pct NUMERIC,
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS diet_prefs JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS injuries JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS equipment JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS days_available JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS budget_level TEXT,
ADD COLUMN IF NOT EXISTS meals_per_day INTEGER DEFAULT 3;

-- Create coach_state table
CREATE TABLE IF NOT EXISTS public.coach_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_checkin_at TIMESTAMPTZ,
  next_checkin_at TIMESTAMPTZ,
  current_phase training_phase DEFAULT 'base',
  notes TEXT,
  adherence_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.coach_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coach state"
ON public.coach_state FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach state"
ON public.coach_state FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach state"
ON public.coach_state FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  plan_type plan_type NOT NULL,
  version INTEGER DEFAULT 1,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plans"
ON public.plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans"
ON public.plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans"
ON public.plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans"
ON public.plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL,
  session_name TEXT NOT NULL,
  focus TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_min INTEGER,
  rpe_goal NUMERIC,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workouts"
ON public.workouts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
ON public.workouts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
ON public.workouts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
ON public.workouts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL,
  meal_time TEXT NOT NULL,
  recipe_title TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT,
  kcal INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fat_g INTEGER,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meals"
ON public.meals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
ON public.meals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
ON public.meals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
ON public.meals FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create metrics table
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC,
  bf_pct NUMERIC,
  waist_cm NUMERIC,
  steps INTEGER,
  workouts_done INTEGER,
  calories_avg INTEGER,
  protein_avg INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics"
ON public.metrics FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
ON public.metrics FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
ON public.metrics FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metrics"
ON public.metrics FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind event_kind NOT NULL,
  summary TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
ON public.events FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_plans_user_dates ON public.plans(user_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_plan ON public.workouts(user_id, plan_id, day_index);
CREATE INDEX IF NOT EXISTS idx_meals_user_plan ON public.meals(user_id, plan_id, day_index);
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON public.metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_events_user_created ON public.events(user_id, created_at DESC);

-- Create trigger for coach_state updated_at
CREATE TRIGGER update_coach_state_updated_at
BEFORE UPDATE ON public.coach_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();