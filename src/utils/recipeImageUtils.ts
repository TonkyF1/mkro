import { supabase } from "@/integrations/supabase/client";

export const getRecipeImageUrl = (recipeId: string): string => {
  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(`${recipeId}.png`);
  
  return data.publicUrl;
};

export const generateSingleRecipeImage = async (recipe: { id: string; name: string; imageDescription: string }) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
      body: {
        imageDescription: recipe.imageDescription,
        recipeName: recipe.name,
        recipeId: recipe.id
      }
    });

    if (error) {
      console.error(`Failed to generate image for ${recipe.name}:`, error);
      return null;
    }

    return data?.imageUrl || null;
  } catch (error) {
    console.error(`Error generating image for ${recipe.name}:`, error);
    return null;
  }
};