import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlanDay {
  date: string;
  kcal: number;
  meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipe_id?: string;
    custom?: {
      title: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      cost_gbp?: number;
    };
  }>;
  training?: Array<{
    name: string;
    duration_min: number;
    focus: string;
    notes?: string;
  }>;
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

    const { days = 7, plan_type = 'both' } = await req.json();

    // Fetch user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Fetch available recipes
    const { data: recipes } = await supabaseClient
      .from('recipes')
      .select('*')
      .limit(50);

    // Build AI prompt
    const systemPrompt = `You are MKRO Coach, a UK-based fitness and nutrition AI coach.
Generate a ${days}-day plan for a user with these details:
- Goal: ${profile.goal || 'general_health'}
- Activity: ${profile.activity_level || 'moderate'}
- Daily calorie target: ${profile.daily_calorie_target || 2000} kcal
- Macro targets: ${JSON.stringify(profile.macro_target || { protein: 150, carbs: 200, fats: 65 })}
- Dietary preferences: ${JSON.stringify(profile.dietary_prefs || {})}
- Allergies: ${JSON.stringify(profile.allergies || [])}

Available recipes (match by ID when possible):
${JSON.stringify(recipes?.slice(0, 20) || [])}

Return ONLY valid JSON matching this structure:
{
  "days": [
    {
      "date": "2025-10-09",
      "kcal": 2000,
      "meals": [
        {
          "type": "breakfast",
          "recipe_id": "uuid-if-matched",
          "custom": {
            "title": "High Protein Oats",
            "calories": 450,
            "protein": 35,
            "carbs": 55,
            "fats": 12,
            "cost_gbp": 2.50
          }
        }
      ],
      "training": [
        {
          "name": "Upper Body Strength",
          "duration_min": 45,
          "focus": "strength",
          "notes": "Focus on progressive overload"
        }
      ]
    }
  ]
}`;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI for plan generation...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a ${days}-day ${plan_type} plan starting from today.` }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiResult = await openaiResponse.json();
    const content = aiResult.choices[0].message.content;
    
    console.log('AI response received:', content.substring(0, 200));

    let planPayload;
    try {
      planPayload = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Save plan
    const { data: savedPlan, error: planError } = await supabaseClient
      .from('ai_plans')
      .insert({
        user_id: user.id,
        plan_type,
        start_date: startDate,
        end_date: endDate,
        payload: planPayload,
      })
      .select()
      .single();

    if (planError) throw planError;

    // Populate diary_meals from plan
    const mealInserts = [];
    for (const day of planPayload.days) {
      for (const meal of day.meals) {
        mealInserts.push({
          user_id: user.id,
          date: day.date,
          meal_slot: meal.type,
          recipe_id: meal.recipe_id || null,
          custom_entry: meal.custom || null,
          is_completed: false,
        });
      }
    }

    if (mealInserts.length > 0) {
      const { error: diaryError } = await supabaseClient
        .from('diary_meals')
        .insert(mealInserts);

      if (diaryError) console.error('Error inserting diary meals:', diaryError);
    }

    // Log event
    await supabaseClient.from('events').insert({
      user_id: user.id,
      kind: 'plan_generated',
      summary: `Generated ${days}-day ${plan_type} plan`,
      payload: { plan_type, days, plan_id: savedPlan.id },
    });

    return new Response(
      JSON.stringify({ 
        plan_id: savedPlan.id, 
        payload: planPayload,
        message: 'Plan generated and diary populated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-generate-plan:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});