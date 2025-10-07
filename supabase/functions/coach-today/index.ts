import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // Get current active plan
    const { data: currentPlan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', user.id)
      .lte('start_date', todayISO)
      .gte('end_date', todayISO)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (planError) throw planError;

    if (!currentPlan) {
      return new Response(
        JSON.stringify({ 
          workout: null, 
          meals: [], 
          message: 'No active plan found. Generate a new plan to get started!' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate day index (1-7, Monday = 1)
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const dayIndex = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Get today's workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_id', currentPlan.id)
      .eq('day_index', dayIndex)
      .maybeSingle();

    if (workoutError) console.error('Workout fetch error:', workoutError);

    // Get today's meals
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_id', currentPlan.id)
      .eq('day_index', dayIndex)
      .order('meal_time', { ascending: true });

    if (mealsError) console.error('Meals fetch error:', mealsError);

    return new Response(
      JSON.stringify({
        workout: workout || null,
        meals: meals || [],
        plan_summary: currentPlan.payload?.plan_summary || null,
        daily_targets: currentPlan.payload?.nutrition?.daily_targets || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[coach-today] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
