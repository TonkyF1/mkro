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

    // Return mock UK supermarket data (replace with real API integration later)
    const mockStores = [
      {
        name: 'Tesco Extra',
        address: `High Street, ${postcode.toUpperCase()}`,
        distance: 0.8,
        chain: 'Tesco',
        opening_hours: 'Mon-Sun: 6:00-24:00'
      },
      {
        name: 'Sainsbury\'s Local', 
        address: `Market Square, ${postcode.toUpperCase()}`,
        distance: 1.2,
        chain: 'Sainsburys',
        opening_hours: 'Mon-Sun: 7:00-23:00'
      },
      {
        name: 'ASDA Superstore',
        address: `Retail Park, ${postcode.toUpperCase()}`,
        distance: 2.1,
        chain: 'ASDA',
        opening_hours: 'Mon-Sat: 8:00-22:00, Sun: 10:00-16:00'
      },
      {
        name: 'Morrisons',
        address: `Shopping Centre, ${postcode.toUpperCase()}`,
        distance: 1.5,
        chain: 'Morrisons',
        opening_hours: 'Mon-Sun: 7:00-22:00'
      },
      {
        name: 'Waitrose',
        address: `Town Centre, ${postcode.toUpperCase()}`,
        distance: 2.3,
        chain: 'Waitrose',
        opening_hours: 'Mon-Sun: 8:00-21:00'
      }
    ];

    console.log(`Found ${mockStores.length} stores near ${postcode.toUpperCase()}`);
    
    const data = { stores: mockStores };

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