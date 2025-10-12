import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function calculateBMR(weight_kg: number, height_cm: number, age: number, gender: string): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  } else {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  }
}

function getActivityMultiplier(activity_level: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    athlete: 1.9,
  };
  return multipliers[activity_level] || 1.55;
}

function getGoalAdjustment(goal: string): number {
  const adjustments: Record<string, number> = {
    fat_loss: -0.15,
    muscle_gain: 0.10,
    recomp: -0.05,
    performance: 0.05,
    general_health: 0,
  };
  return adjustments[goal] || 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Fetch profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const { weight_kg, height_cm, age, sex, activity_level, goal } = profile;

    if (!weight_kg || !height_cm || !age) {
      throw new Error('Missing required profile data');
    }

    // Calculate BMR
    const bmr = calculateBMR(weight_kg, height_cm, age, sex || 'male');
    
    // Apply activity multiplier
    const tdee = bmr * getActivityMultiplier(activity_level || 'moderate');
    
    // Adjust for goal
    const adjustment = getGoalAdjustment(goal || 'general_health');
    const targetCalories = Math.round(tdee * (1 + adjustment));

    // Calculate macros
    const proteinGramsPerKg = goal === 'muscle_gain' ? 2.0 : 1.8;
    const protein_g = Math.round(weight_kg * proteinGramsPerKg);
    
    const fatCalories = Math.round(targetCalories * 0.28); // 28% from fats
    const fat_g = Math.round(fatCalories / 9);
    
    const proteinCalories = protein_g * 4;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbs_g = Math.round(carbCalories / 4);

    const macroTarget = {
      protein_g,
      carbs_g,
      fat_g,
    };

    // Update profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        daily_calorie_target: targetCalories,
        macro_target: macroTarget,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Log event
    await supabaseClient.from('events').insert({
      user_id: user.id,
      kind: 'macros_recalculated',
      summary: `Recalculated macros: ${targetCalories} kcal`,
      payload: { targetCalories, macroTarget },
    });

    return new Response(
      JSON.stringify({ 
        daily_calorie_target: targetCalories,
        macro_target: macroTarget,
        calculations: {
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-macros-recalc:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});