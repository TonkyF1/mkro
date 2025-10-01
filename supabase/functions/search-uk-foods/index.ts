import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FoodResult {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving_size?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search Open Food Facts UK database
    const searchUrl = `https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform the results to our format
    const results: FoodResult[] = data.products
      .filter((product: any) => product.nutriments && product.product_name)
      .map((product: any) => {
        const nutriments = product.nutriments;
        
        return {
          name: product.product_name,
          brand: product.brands || undefined,
          calories: Math.round(nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184 || 0),
          protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
          fats: Math.round((nutriments.fat_100g || 0) * 10) / 10,
          serving_size: product.serving_size || '100g'
        };
      })
      .filter((item: FoodResult) => item.calories > 0); // Only return items with calorie data

    return new Response(
      JSON.stringify({ results: results.slice(0, 15) }), // Limit to 15 results
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error searching foods:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search foods', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
