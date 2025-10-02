-- Create meal_completions table to track when users complete meals
CREATE TABLE public.meal_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  day_name TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_meal_completion UNIQUE(user_id, week_start, day_name, meal_type)
);

-- Enable RLS
ALTER TABLE public.meal_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own meal completions"
ON public.meal_completions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal completions"
ON public.meal_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal completions"
ON public.meal_completions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal completions"
ON public.meal_completions FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_meal_completions_updated_at
  BEFORE UPDATE ON public.meal_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_meal_completions_user_week ON public.meal_completions(user_id, week_start);