import { supabase } from "@/integrations/supabase/client";
import placeholderImage from '@/assets/meal-placeholder.png';

export const getRecipeImageUrl = (recipeId: string): string => {
  return placeholderImage; // Fallback to placeholder for now
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
      return placeholderImage;
    }

    // Use base64 data if available, otherwise fallback to placeholder
    return data?.image_base64 ? `data:image/png;base64,${data.image_base64}` : placeholderImage;
  } catch (error) {
    console.error(`Error generating Hugging Face image for ${recipe.name}:`, error);
    return placeholderImage;
  }
};