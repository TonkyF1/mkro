import { supabase } from "@/integrations/supabase/client";

// Public URL for a recipe image stored in Supabase Storage
export const getRecipeImageUrl = (recipeId: string): string => {
  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(`recipes/${recipeId}.png`);
  return data.publicUrl;
};

// Simple global queue to avoid OpenAI image rate limits
let genQueue: Promise<void> = Promise.resolve();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateSingleRecipeImage = async (recipe: { id: string; name: string; ingredients: string[]; imageDescription?: string }) => {
  let result: string | null = null;

  genQueue = genQueue.then(async () => {
    try {
      console.log(`Generating single OpenAI image for: ${recipe.name}`);
      const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          title: recipe.name,
          ingredients: recipe.ingredients,
          style: 'clean, modern cookbook design; warm muted colors; readable sans-serif font; square 1:1 composition; minimal background; no logos or watermarks',
          recipeId: recipe.id,
        },
      });

      console.log('[generateSingleRecipeImage] Function response:', { hasData: !!data, hasB64: !!data?.image_base64, hasUrl: !!data?.imageUrl, error });

      if (!error && (data?.imageUrl || data?.image_base64)) {
        result = data?.imageUrl ?? `data:image/png;base64,${data.image_base64}`;
      } else {
        result = null;
      }
    } catch (err) {
      console.error(`Error generating OpenAI image for ${recipe.name}:`, err);
      result = null;
    } finally {
      // Respect OpenAI gpt-image rate limits (~5/min)
      await sleep(13000);
    }
  });

  await genQueue;
  return result;
};