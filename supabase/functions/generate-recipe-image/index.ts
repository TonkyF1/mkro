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
    const { title, ingredients, style, recipeId } = await req.json()

    if (!title || !recipeId) {
      return new Response(
        JSON.stringify({ error: 'Title and recipe ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for recipe: ${title} (ID: ${recipeId})`)
    console.log(`Ingredients:`, ingredients)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Initialize Supabase client for storage operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sb = createClient(supabaseUrl, supabaseServiceKey)

    // Generate photorealistic food photography with zero text/typography
    const enhancedPrompt = `
Ultra-realistic professional food photography of ${title}. 
Single plated dish only, centered on a neutral background. 
Natural lighting, shallow depth of field, crisp texture, vibrant detail, appetizing presentation. 

STRICT NEGATIVE: text, words, numbers, captions, typography, menus, signs, packaging, logos, watermarks, stickers, napkins with writing, books, papers, receipts, menus, chalkboards, blackboards. 
ONLY the food and plate should appear.
`;

    
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

    // Upload to Supabase Storage for persistence and CDN delivery
    const path = `recipes/${recipeId}.png`
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const { error: uploadError } = await sb.storage
      .from('recipe-images')
      .upload(path, bytes, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.error('Failed to upload to storage:', uploadError)
    }

    const { data: publicData } = sb.storage
      .from('recipe-images')
      .getPublicUrl(path)

    const publicUrl = publicData?.publicUrl || imageBase64

    console.log(`Successfully generated image for recipe: ${title}`)
    console.log(`Image Base64 length: ${base64.length}`)

    return new Response(
      JSON.stringify({ 
        image_base64: base64,
        imageUrl: publicUrl,
        storage_path: path,
        recipeName: title,
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