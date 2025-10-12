-- Create function to calculate daily totals
CREATE OR REPLACE FUNCTION public.fn_day_totals(d date)
RETURNS TABLE(kcal integer, protein_g integer, carbs_g integer, fat_g integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(r.calories), 0)::integer as kcal,
    COALESCE(SUM(r.protein), 0)::integer as protein_g,
    COALESCE(SUM(r.carbs), 0)::integer as carbs_g,
    COALESCE(SUM(r.fats), 0)::integer as fat_g
  FROM diary_meals dm
  LEFT JOIN recipes r ON dm.recipe_id = r.id
  WHERE dm.date = d 
    AND dm.user_id = auth.uid()
    AND dm.is_completed = true;
END;
$$;

-- Create function to toggle meal completion
CREATE OR REPLACE FUNCTION public.fn_toggle_meal_complete(p_meal uuid)
RETURNS TABLE(kcal integer, protein_g integer, carbs_g integer, fat_g integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date date;
  v_completed boolean;
BEGIN
  -- Toggle the completion status
  UPDATE diary_meals 
  SET is_completed = NOT is_completed
  WHERE id = p_meal 
    AND user_id = auth.uid()
  RETURNING date, is_completed INTO v_date, v_completed;
  
  -- Return updated totals for that day
  RETURN QUERY
  SELECT * FROM fn_day_totals(v_date);
END;
$$;