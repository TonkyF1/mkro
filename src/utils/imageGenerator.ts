import { supabase } from "@/integrations/supabase/client";
import { recipes } from "@/data/recipes";

export interface GeneratedImage {
  recipeId: string;
  imageData: string;
}

export const generateMissingRecipeImages = async (): Promise<{ 
  success: number; 
  failed: string[]; 
  generatedImages: GeneratedImage[] 
}> => {
  const recipesWithoutImages = recipes.filter(recipe => !recipe.image);
  console.log(`Found ${recipesWithoutImages.length} recipes without images`);
  
  const results = {
    success: 0,
    failed: [] as string[],
    generatedImages: [] as GeneratedImage[]
  };

  for (const recipe of recipesWithoutImages) {
    try {
      console.log(`Generating image for: ${recipe.name}`);
      
      const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          imageDescription: recipe.imageDescription,
          recipeName: recipe.name
        }
      });

      if (error) {
        console.error(`Failed to generate image for ${recipe.name}:`, error);
        results.failed.push(recipe.name);
        continue;
      }

      if (data?.image) {
        // Store the generated image data
        results.generatedImages.push({
          recipeId: recipe.id,
          imageData: data.image
        });
        results.success++;
        console.log(`Successfully generated image for: ${recipe.name}`);
      } else {
        console.error(`No image data returned for ${recipe.name}`);
        results.failed.push(recipe.name);
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error generating image for ${recipe.name}:`, error);
      results.failed.push(recipe.name);
    }
  }

  return results;
};