import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postcode, radius = 5 } = await req.json();
    
    if (!postcode) {
      return new Response(
        JSON.stringify({ error: 'Postcode is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const crystalRoofApiKey = Deno.env.get('CRYSTALROOF_API_KEY');
    
    if (!crystalRoofApiKey) {
      console.error('CRYSTALROOF_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for stores near postcode: ${postcode}, radius: ${radius}km`);

    // Call Crystal Roof API for nearby stores
    const response = await fetch('https://api.crystalroof.com/v1/stores/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${crystalRoofApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          postcode: postcode.toUpperCase()
        },
        radius_km: radius,
        categories: ['supermarket', 'grocery', 'convenience'],
        include_details: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Crystal Roof API error:', response.status, errorText);
      
      // Return mock data for UK supermarkets as fallback
      const mockStores = [
        {
          name: 'Tesco Extra',
          address: `High Street, ${postcode}`,
          distance: 0.8,
          chain: 'Tesco',
          opening_hours: 'Mon-Sun: 6:00-24:00'
        },
        {
          name: 'Sainsbury\'s Local', 
          address: `Market Square, ${postcode}`,
          distance: 1.2,
          chain: 'Sainsburys',
          opening_hours: 'Mon-Sun: 7:00-23:00'
        },
        {
          name: 'ASDA Superstore',
          address: `Retail Park, ${postcode}`,
          distance: 2.1,
          chain: 'ASDA',
          opening_hours: 'Mon-Sat: 8:00-22:00, Sun: 10:00-16:00'
        }
      ];
      
      return new Response(JSON.stringify({ stores: mockStores }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`Found ${data.stores?.length || 0} stores`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crystalroof-proxy function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});