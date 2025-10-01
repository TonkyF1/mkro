import { supabase } from "@/integrations/supabase/client";

// Public URL for a recipe image stored in Supabase Storage
export const getRecipeImageUrl = (recipeId: string): string => {
  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(`recipes/${recipeId}.png`);
  // Cache-bust to ensure the latest overwrite is shown (avoid CDN stale images)
  return `${data.publicUrl}?t=${Date.now()}`;
};

// Simple global queue to avoid OpenAI image rate limits
let genQueue: Promise<void> = Promise.resolve();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateSingleRecipeImage = async (
  recipe: { 
    id: string; 
    name: string; 
    ingredients: string[]; 
    imageDescription?: string 
  }
): Promise<string | null> => {
  let result: string | null = null;
  
  genQueue = genQueue.then(async () => {
    try {
      console.log(`[generateSingleRecipeImage] Starting generation for: ${recipe.name}`);
      
      const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          title: recipe.name,
          ingredients: recipe.ingredients,
          style: 'hyper-realistic photo, natural lighting, 50mm lens f/1.8, studio-quality food photography',
          recipeId: recipe.id,
        },
      });

      console.log('[generateSingleRecipeImage] Response:', {
        hasData: !!data,
        hasError: !!error,
        success: data?.success,
        hasB64: !!data?.image_base64,
        hasUrl: !!data?.imageUrl,
        errorDetails: error || data?.error
      });

      if (error) {
        console.error('[generateSingleRecipeImage] Supabase function error:', error);
        result = null;
        return;
      }

      if (data?.error || !data?.success) {
        console.error('[generateSingleRecipeImage] Edge function returned error:', data?.error || data?.details);
        result = null;
        return;
      }

      // Prefer the public URL from storage, fallback to base64
      if (data?.imageUrl) {
        result = `${data.imageUrl}?t=${Date.now()}`;
        console.log('[generateSingleRecipeImage] Using public URL:', result);
      } else if (data?.image_base64) {
        result = `data:image/png;base64,${data.image_base64}`;
        console.log('[generateSingleRecipeImage] Using base64 (length:', data.image_base64.length, ')');
      } else {
        console.error('[generateSingleRecipeImage] No image data in response');
        result = null;
      }
    } catch (err) {
      console.error(`[generateSingleRecipeImage] Exception for ${recipe.name}:`, err);
      result = null;
    } finally {
      // Respect OpenAI DALL-E rate limits (5 images per minute for DALL-E 3)
      await sleep(13000);
    }
  });

  await genQueue;
  return result;
};