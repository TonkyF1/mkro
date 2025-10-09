-- MKRO V2 REBUILD - Complete Schema
-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables that conflict (careful!)
DROP TABLE IF EXISTS ai_plans CASCADE;
DROP TABLE IF EXISTS diary_meals CASCADE;
DROP TABLE IF EXISTS hydration_logs CASCADE;
DROP TABLE IF EXISTS exercise_logs CASCADE;
DROP TABLE IF EXISTS exercises_library CASCADE;
DROP TABLE IF EXISTS weekly_reports CASCADE;
DROP TABLE IF EXISTS weight_logs CASCADE;
DROP VIEW IF EXISTS v_day_totals CASCADE;
DROP FUNCTION IF EXISTS fn_day_totals(date);
DROP FUNCTION IF EXISTS fn_toggle_meal_complete(uuid);

-- Update PROFILES table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','nonbinary','prefer_not'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dietary_prefs JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS time_available_minutes INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS training_days_per_week INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hydration_target_ml INT DEFAULT 2000;

-- Update RECIPES table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'curated';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cost_gbp NUMERIC(8,2);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS steps TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Rename columns to match new schema
ALTER TABLE recipes RENAME COLUMN name TO title;
ALTER TABLE recipes RENAME COLUMN calories TO calories_temp;
ALTER TABLE recipes ADD COLUMN calories INT;
UPDATE recipes SET calories = calories_temp::int WHERE calories_temp IS NOT NULL;
ALTER TABLE recipes DROP COLUMN calories_temp;

ALTER TABLE recipes RENAME COLUMN protein TO protein_g_temp;
ALTER TABLE recipes ADD COLUMN protein_g NUMERIC(6,2);
UPDATE recipes SET protein_g = protein_g_temp WHERE protein_g_temp IS NOT NULL;
ALTER TABLE recipes DROP COLUMN protein_g_temp;

ALTER TABLE recipes RENAME COLUMN carbs TO carbs_g_temp;
ALTER TABLE recipes ADD COLUMN carbs_g NUMERIC(6,2);
UPDATE recipes SET carbs_g = carbs_g_temp WHERE carbs_g_temp IS NOT NULL;
ALTER TABLE recipes DROP COLUMN carbs_g_temp;

ALTER TABLE recipes RENAME COLUMN fats TO fat_g_temp;
ALTER TABLE recipes ADD COLUMN fat_g NUMERIC(6,2);
UPDATE recipes SET fat_g = fat_g_temp WHERE fat_g_temp IS NOT NULL;
ALTER TABLE recipes DROP COLUMN fat_g_temp;

-- DIARY MEALS (new table)
CREATE TABLE diary_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  meal_slot TEXT CHECK (meal_slot IN ('breakfast','lunch','dinner','snack')) NOT NULL,
  recipe_id UUID REFERENCES recipes(id),
  custom_entry JSONB,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE diary_meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diary self" ON diary_meals FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- HYDRATION
CREATE TABLE hydration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  ml INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hydration self" ON hydration_logs FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- EXERCISE LIBRARY
CREATE TABLE exercises_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  muscle_groups TEXT[],
  tips TEXT,
  warmup TEXT,
  cooldown TEXT
);

ALTER TABLE exercises_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ex-lib read all" ON exercises_library FOR SELECT USING (true);

-- EXERCISE LOGS
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  exercise_id UUID REFERENCES exercises_library(id),
  sets INT,
  reps INT,
  weight_kg NUMERIC(6,2),
  duration_min NUMERIC(6,2),
  calories_burned INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ex-logs self" ON exercise_logs FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- AI PLANS
CREATE TABLE ai_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('nutrition','training','both')) DEFAULT 'both',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai-plans self" ON ai_plans FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- WEEKLY REPORTS
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT,
  badges TEXT[],
  suggestions TEXT,
  ai_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weekly self" ON weekly_reports FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- WEIGHT LOGS
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weight self" ON weight_logs FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- EVENTS (telemetry)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events self" ON events FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- DAY TOTALS VIEW
CREATE OR REPLACE VIEW v_day_totals AS
SELECT
  dm.user_id,
  dm.date,
  COALESCE(SUM(
    CASE 
      WHEN dm.custom_entry IS NULL THEN r.calories 
      ELSE (dm.custom_entry->>'calories')::int 
    END
  ), 0) AS kcal,
  COALESCE(SUM(
    CASE 
      WHEN dm.custom_entry IS NULL THEN r.protein_g 
      ELSE (dm.custom_entry->>'protein_g')::numeric 
    END
  ), 0) AS protein_g,
  COALESCE(SUM(
    CASE 
      WHEN dm.custom_entry IS NULL THEN r.carbs_g 
      ELSE (dm.custom_entry->>'carbs_g')::numeric 
    END
  ), 0) AS carbs_g,
  COALESCE(SUM(
    CASE 
      WHEN dm.custom_entry IS NULL THEN r.fat_g 
      ELSE (dm.custom_entry->>'fat_g')::numeric 
    END
  ), 0) AS fat_g
FROM diary_meals dm
LEFT JOIN recipes r ON r.id = dm.recipe_id
WHERE dm.is_completed = true
GROUP BY dm.user_id, dm.date;

-- RPC: Get day totals
CREATE OR REPLACE FUNCTION fn_day_totals(d DATE)
RETURNS TABLE (kcal INT, protein_g NUMERIC, carbs_g NUMERIC, fat_g NUMERIC)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(v.kcal, 0)::int,
    COALESCE(v.protein_g, 0),
    COALESCE(v.carbs_g, 0),
    COALESCE(v.fat_g, 0)
  FROM v_day_totals v
  WHERE v.user_id = auth.uid() AND v.date = d;
$$;

-- RPC: Toggle meal completion
CREATE OR REPLACE FUNCTION fn_toggle_meal_complete(p_meal UUID)
RETURNS TABLE (kcal INT, protein_g NUMERIC, carbs_g NUMERIC, fat_g NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date DATE;
BEGIN
  UPDATE diary_meals 
  SET is_completed = NOT is_completed 
  WHERE id = p_meal AND user_id = auth.uid()
  RETURNING date INTO v_date;
  
  RETURN QUERY SELECT * FROM fn_day_totals(v_date);
END;
$$;