-- MKRO App Complete Database Schema

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS weight_tracking CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS workout_plans CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text,
  name text,
  age integer,
  weight decimal,
  height decimal,
  goal text,
  fitness_level text,
  diet_type text,
  workout_preference text,
  target_calories integer,
  target_protein integer,
  target_carbs integer,
  target_fats integer,
  is_premium boolean DEFAULT false,
  stripe_customer_id text,
  subscription_status text,
  subscription_end_date timestamptz,
  points integer DEFAULT 0,
  streak integer DEFAULT 0,
  level text DEFAULT 'Bronze',
  ai_messages_today integer DEFAULT 0,
  ai_messages_reset_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  calories integer,
  protein decimal,
  carbs decimal,
  fats decimal,
  cook_time integer,
  servings integer,
  meal_type text,
  category text,
  tags text[],
  is_premium boolean DEFAULT false,
  instructions text,
  ingredients jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create meals table (user food log)
CREATE TABLE meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  calories integer,
  protein decimal,
  carbs decimal,
  fats decimal,
  meal_type text,
  is_cheat_meal boolean DEFAULT false,
  is_fakeaway boolean DEFAULT false,
  logged_at timestamptz DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_type text NOT NULL,
  day_number integer NOT NULL,
  day_name text NOT NULL,
  workout_name text NOT NULL,
  duration integer,
  exercises jsonb,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create workouts table (user workout log)
CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_type text,
  duration integer,
  calories_burned integer,
  exercises jsonb,
  completed_at timestamptz DEFAULT now(),
  points_earned integer DEFAULT 50
);

-- Create achievements table
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id text NOT NULL,
  achievement_name text NOT NULL,
  points_awarded integer,
  unlocked_at timestamptz DEFAULT now()
);

-- Create weight_tracking table
CREATE TABLE weight_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight decimal NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_user boolean NOT NULL,
  tokens_used integer,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_id text,
  amount integer,
  currency text,
  status text,
  subscription_type text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for recipes (public read, authenticated can add)
CREATE POLICY "Anyone can view recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for meals
CREATE POLICY "Users can view own meals" ON meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON meals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for workout_plans (public read)
CREATE POLICY "Anyone can view workout plans" ON workout_plans FOR SELECT USING (true);

-- RLS Policies for workouts
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weight_tracking
CREATE POLICY "Users can view own weight" ON weight_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight" ON weight_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weight" ON weight_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight" ON weight_tracking FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();