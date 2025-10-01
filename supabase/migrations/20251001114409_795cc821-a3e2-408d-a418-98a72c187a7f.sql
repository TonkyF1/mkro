-- Enable RLS on recipe_images table
ALTER TABLE public.recipe_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recipe_images table
-- Allow everyone to view recipe images
CREATE POLICY "Anyone can view recipe images"
  ON public.recipe_images
  FOR SELECT
  USING (true);

-- Only authenticated users can insert recipe images
CREATE POLICY "Authenticated users can insert recipe images"
  ON public.recipe_images
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update recipe images
CREATE POLICY "Authenticated users can update recipe images"
  ON public.recipe_images
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete recipe images
CREATE POLICY "Authenticated users can delete recipe images"
  ON public.recipe_images
  FOR DELETE
  USING (auth.uid() IS NOT NULL);