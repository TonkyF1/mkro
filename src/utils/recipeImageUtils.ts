import { supabase } from "@/integrations/supabase/client";

export const getRecipeImageUrl = (recipeId: string): string => {
  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(`${recipeId}.png`);
  
  return data.publicUrl;
};

export const generateSingleRecipeImage = async (recipe: { id: string; name: string; imageDescription: string }) => {
  try {
    console.log(`Generating single Hugging Face image for: ${recipe.name}`);
    
    const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
      body: {
        imageDescription: recipe.imageDescription,
        recipeName: recipe.name,
        recipeId: recipe.id
      }
    });

    if (error) {
      console.error(`Failed to generate Hugging Face image for ${recipe.name}:`, error);
      return null;
    }

    return data?.imageUrl || null;
  } catch (error) {
    console.error(`Error generating Hugging Face image for ${recipe.name}:`, error);
    return null;
  }
};