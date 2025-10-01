import { supabase } from "@/integrations/supabase/client";

export const testImageGeneration = async () => {
  console.log('🧪 TESTING: Starting image generation test...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-recipe-image', {
      body: {
        title: 'Grilled Chicken Salad',
        ingredients: ['chicken', 'lettuce', 'tomatoes'],
        recipeId: 'test-123',
      },
    });

    console.log('🧪 TEST RESULT:', { 
      success: !error, 
      hasData: !!data,
      data,
      error 
    });

    if (error) {
      console.error('🧪 TEST FAILED:', error);
    } else {
      console.log('🧪 TEST SUCCESS:', data);
    }
    
    return { data, error };
  } catch (e) {
    console.error('🧪 TEST EXCEPTION:', e);
    return { data: null, error: e };
  }
};
