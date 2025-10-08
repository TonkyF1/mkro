-- MKRO V2: Add new tables only (minimal approach)

-- Add onboarding fields to profiles if needed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'daily_calorie_target') THEN
    ALTER TABLE profiles ADD COLUMN daily_calorie_target int;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'macro_target') THEN
    ALTER TABLE profiles ADD COLUMN macro_target jsonb;
  END IF;
END $$;

-- DIARY MEALS (new unified table)
CREATE TABLE IF NOT EXISTS diary_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meal_slot text CHECK (meal_slot IN ('breakfast','lunch','dinner','snack')) NOT NULL,
  recipe_id uuid REFERENCES recipes(id),
  custom_entry jsonb,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'diary_meals' AND policyname = 'diary_meals_self') THEN
    ALTER TABLE diary_meals ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "diary_meals_self" ON diary_meals 
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_diary_meals_user_date ON diary_meals(user_id, date);

-- HYDRATION LOGS
CREATE TABLE IF NOT EXISTS hydration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  ml int NOT NULL,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hydration_logs' AND policyname = 'hydration_self') THEN
    ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "hydration_self" ON hydration_logs 
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_hydration_user_date ON hydration_logs(user_id, date);

-- EXERCISE LIBRARY
CREATE TABLE IF NOT EXISTS exercises_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_id text NOT NULL,
  muscle_groups text[],
  tips text,
  warmup text,
  cooldown text,
  level text CHECK (level IN ('beginner','intermediate','advanced')) DEFAULT 'intermediate',
  goal_focus text CHECK (goal_focus IN ('strength','fat_loss','mobility','conditioning')) DEFAULT 'strength'
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercises_library' AND policyname = 'exercises_library_read_all') THEN
    ALTER TABLE exercises_library ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "exercises_library_read_all" ON exercises_library FOR SELECT USING (true);
  END IF;
END $$;

-- EXERCISE LOGS
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  exercise_id uuid REFERENCES exercises_library(id),
  sets int,
  reps int,
  weight_kg numeric(6,2),
  duration_min numeric(6,2),
  calories_burned int,
  notes text,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_logs' AND policyname = 'exercise_logs_self') THEN
    ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "exercise_logs_self" ON exercise_logs 
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_date ON exercise_logs(user_id, date);

-- AI PLANS
CREATE TABLE IF NOT EXISTS ai_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type text CHECK (plan_type IN ('nutrition','training','both')) DEFAULT 'both',
  start_date date NOT NULL,
  end_date date NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_plans' AND policyname = 'ai_plans_self') THEN
    ALTER TABLE ai_plans ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "ai_plans_self" ON ai_plans 
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_plans_user_dates ON ai_plans(user_id, start_date, end_date);