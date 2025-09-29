-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  height NUMERIC,
  weight NUMERIC,
  height_unit TEXT CHECK (height_unit IN ('cm', 'inches')) DEFAULT 'cm',
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')) DEFAULT 'kg',
  goal TEXT CHECK (goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'general_health')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  target_protein INTEGER,
  target_carbs INTEGER,
  target_fats INTEGER,
  dietary_preferences TEXT[],
  allergies TEXT[],
  cooking_time_preference TEXT CHECK (cooking_time_preference IN ('under_15', '15_30', '30_45', 'over_45')),
  budget_preference TEXT CHECK (budget_preference IN ('budget', 'moderate', 'premium')),
  meal_frequency INTEGER DEFAULT 3,
  kitchen_equipment TEXT[],
  eating_out_frequency TEXT CHECK (eating_out_frequency IN ('never', 'rarely', 'sometimes', 'often', 'daily')),
  health_conditions TEXT[],
  supplement_usage TEXT[],
  hydration_goal INTEGER,
  sleep_hours NUMERIC,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  motivation_factors TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();