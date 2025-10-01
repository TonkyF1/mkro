import { supabase } from "@/integrations/supabase/client";

export interface FeatureImagePrompt {
  name: string;
  prompt: string;
  filename: string;
}

export const featureImagePrompts: FeatureImagePrompt[] = [
  {
    name: "AI Coach",
    prompt: "A friendly, modern 3D icon representing an AI coach - glowing chat bubble with sparkles and AI neural network patterns, vibrant green and blue gradient, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "ai-coach.png"
  },
  {
    name: "Food Scanner",
    prompt: "A modern 3D icon of a smartphone camera scanning food on a plate, with AR scanning lines and nutritional data overlay, orange and yellow gradient, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "food-scanner.png"
  },
  {
    name: "Shopping List",
    prompt: "A modern 3D icon of a shopping cart with fresh groceries and a checklist, vibrant green gradient with checkmarks, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "shopping-list.png"
  },
  {
    name: "Meal Planner",
    prompt: "A modern 3D icon of a calendar with healthy meal icons and planning elements, green and teal gradient, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "meal-planner.png"
  },
  {
    name: "Exercise Tracker",
    prompt: "A modern 3D icon of fitness dumbbells with progress tracking graph and energy burst, orange and yellow gradient, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "exercise-tracker.png"
  },
  {
    name: "Recipe Library",
    prompt: "A modern 3D icon of a chef's hat with cookbook and recipe cards, green and mint gradient, clean minimalist style, floating on soft shadow, 256x256 pixel square format",
    filename: "recipe-library.png"
  }
];

export const generateFeatureImage = async (imagePrompt: FeatureImagePrompt): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-feature-image', {
      body: { prompt: imagePrompt.prompt }
    });

    if (error) throw error;
    if (!data?.imageUrl) throw new Error('No image URL returned');

    return data.imageUrl;
  } catch (error) {
    console.error(`Error generating image for ${imagePrompt.name}:`, error);
    throw error;
  }
};

export const downloadBase64Image = (base64Data: string, filename: string) => {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
