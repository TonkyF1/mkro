import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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

    // Initialize Supabase client with service role key for storage operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'))

    // Generate image using FLUX.1-schnell model with enhanced food photography prompt
    const image = await hf.textToImage({
      inputs: `Professional food photography, high resolution, studio lighting, appetizing presentation, clean white background, shallow depth of field, ${imageDescription}, food styling, commercial quality, vibrant colors, Instagram worthy`,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
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