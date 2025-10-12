-- Fix recipe_images public exposure
-- Change SELECT policy to require authentication instead of public access
DROP POLICY IF EXISTS "Anyone can view recipe images" ON public.recipe_images;

CREATE POLICY "Authenticated users can view recipe images"
ON public.recipe_images
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Also fix user_stats missing DELETE policy
-- Allow users to delete their own statistics
CREATE POLICY "Users can delete their own stats"
ON public.user_stats
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);