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

    // Generate image using FLUX.1-schnell model
    const image = await hf.textToImage({
      inputs: `Food photography, high quality, professional lighting, appetizing, clean background, ${imageDescription}`,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to array buffer for storage
    const arrayBuffer = await image.arrayBuffer()
    const imageFile = new Uint8Array(arrayBuffer)

    // Create a filename for the image
    const fileName = `${recipeId}.png`
    
    console.log(`Uploading image to storage: ${fileName}`)

    // Upload image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageFile, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to upload image to storage', 
          details: uploadError.message,
          success: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl

    console.log(`Successfully generated and stored image for recipe: ${recipeName}`)
    console.log(`Image URL: ${imageUrl}`)

    return new Response(
      JSON.stringify({ 
        imageUrl,
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