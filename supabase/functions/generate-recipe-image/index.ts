import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { imageDescription, recipeName } = await req.json()

    if (!imageDescription) {
      return new Response(
        JSON.stringify({ error: 'Image description is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for recipe: ${recipeName}`)
    console.log(`Image description: ${imageDescription}`)

    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'))

    // Generate image using FLUX.1-schnell model
    const image = await hf.textToImage({
      inputs: `Food photography, high quality, professional lighting, appetizing, ${imageDescription}`,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log(`Successfully generated image for recipe: ${recipeName}`)

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        recipeName,
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