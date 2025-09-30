import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageDescription, recipeName, recipeId } = await req.json()

    if (!imageDescription || !recipeId) {
      return new Response(
        JSON.stringify({ error: 'Image description and recipe ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for recipe: ${recipeName} (ID: ${recipeId})`)
    console.log(`Image description: ${imageDescription}`)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Generate image using OpenAI's gpt-image-1 model with enhanced food photography prompt
    const enhancedPrompt = [
      `Ultra-realistic professional food photograph, 85mm lens, DSLR, soft studio lighting, shallow depth of field, commercial quality, no text, no watermark, no illustration, no clipart, no cartoons`,
      `Dish: ${recipeName}.`,
      `Render EXACTLY as described: ${imageDescription}.`,
      `Single plated serving on a clean neutral background, appetizing styling, vibrant but natural colors, high detail, photorealistic.`
    ].join('\n');
    
    console.log(`Calling OpenAI API with prompt:`, enhancedPrompt)
    
    const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png',
      }),
    })

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      console.error('OpenAI API error:', openAIResponse.status, errorText)
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`)
    }

    const openAIData = await openAIResponse.json()
    console.log('OpenAI response received')

    // OpenAI returns base64 directly for gpt-image-1
    const base64 = openAIData.data[0].b64_json
    const imageBase64 = `data:image/png;base64,${base64}`

    console.log(`Successfully generated image for recipe: ${recipeName}`)
    console.log(`Image Base64 length: ${base64.length}`)

    return new Response(
      JSON.stringify({ 
        image_base64: base64,
        imageUrl: imageBase64,
        recipeName,
        recipeId,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error instanceof Error ? error.message : String(error),
        success: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})