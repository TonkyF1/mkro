import { supabase } from "@/integrations/supabase/client";
import { recipes } from "@/data/recipes";

export interface GeneratedImage {
  recipeId: string;
  imageUrl: string;
}

export const generateAllRecipeImages = async (): Promise<{ 
  success: number; 
  failed: string[]; 
  generatedImages: GeneratedImage[] 
}> => {
  // Generate images for ALL recipes using OpenAI gpt-image-1 model
  console.log(`Generating images for ${recipes.length} recipes using OpenAI gpt-image-1`);
  
  const results = {
    success: 0,
    failed: [] as string[],
    generatedImages: [] as GeneratedImage[]
  };

  for (const recipe of recipes) {
    try {
      console.log(`Generating OpenAI image for: ${recipe.name}`);
      
      const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          title: recipe.name,
          ingredients: recipe.ingredients,
          style: 'hyper-realistic photo, natural lighting, 50mm lens f/1.8, studio-quality food photography',
          recipeId: recipe.id
        }
      });

      if (error) {
        console.error(`Failed to generate OpenAI image for ${recipe.name}:`, error);
        results.failed.push(recipe.name);
        continue;
      }

      if (data?.imageUrl) {
        // Store the generated image URL
        results.generatedImages.push({
          recipeId: recipe.id,
          imageUrl: data.imageUrl
        });
        results.success++;
        console.log(`Successfully generated OpenAI image for: ${recipe.name}`);
      } else {
        console.error(`No image URL returned for ${recipe.name}`);
        results.failed.push(recipe.name);
      }

      // Add a delay to honor OpenAI gpt-image rate limits (~5/min)
      await new Promise(resolve => setTimeout(resolve, 13000));
      
    } catch (error) {
      console.error(`Error generating OpenAI image for ${recipe.name}:`, error);
      results.failed.push(recipe.name);
    }
  }

  return results;
};