import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
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

    const { weeks = 4 } = await req.json();

    console.log('[generate-plan] Fetching profile for user:', user.id);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    // Fetch or create coach state
    let { data: coachState } = await supabase
      .from('coach_state')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!coachState) {
      const { data: newState, error: stateError } = await supabase
        .from('coach_state')
        .insert({
          user_id: user.id,
          current_phase: 'base',
          next_checkin_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (stateError) throw stateError;
      coachState = newState;
    }

    console.log('[generate-plan] Building prompt for', weeks, 'weeks');

    // Build system prompt
    const systemPrompt = `You are MKRO Coach, an evidence-based UK personal trainer + nutrition coach.
Produce valid JSON only (see schemas).
Your job: create realistic, goal-aligned training + nutrition programs that fit user data.

Behaviour rules:
- Never require long conversations — base all logic on stored profile.
- Use progressive overload, clear RPE, tempo, rest.
- Meal plans must be practical, tasty, UK-realistic (no calorie extremes).
- Rotate foods weekly, keep each day balanced.
- Always respect allergies / restrictions / time / equipment.
- For fat loss: 10–20% deficit; muscle gain: 5–10% surplus.
- Protein 1.6–2.2 g/kg/day by default.
- Output must match JSON schemas exactly.

User Profile:
- Age: ${profile.age || 'unknown'}, Sex: ${profile.sex || 'unknown'}
- Height: ${profile.height_cm || 'unknown'} cm, Weight: ${profile.weight_kg || 'unknown'} kg
- Bodyfat: ${profile.bodyfat_pct || 'unknown'}%
- Experience: ${profile.experience_level || 'beginner'}
- Goals: ${JSON.stringify(profile.goals || [])}
- Diet preferences: ${JSON.stringify(profile.diet_prefs || {})}
- Allergies: ${JSON.stringify(profile.allergies || [])}
- Injuries: ${JSON.stringify(profile.injuries || [])}
- Equipment: ${JSON.stringify(profile.equipment || [])}
- Days available: ${JSON.stringify(profile.days_available || [])}
- Budget: ${profile.budget_level || 'moderate'}
- Meals per day: ${profile.meals_per_day || 3}
- Current phase: ${coachState.current_phase}

Generate a ${weeks}-week ${coachState.current_phase} phase plan.`;

    const userPrompt = `Create a comprehensive ${weeks}-week training and nutrition plan. Output valid JSON matching this exact schema:

{
  "plan_summary": {
    "phase": "base|build|peak|deload",
    "weeks": ${weeks},
    "goals": ["fat_loss","strength","hypertrophy","conditioning","mobility"],
    "weekly_structure": ["Mon Pull", "Tue Conditioning", ...]
  },
  "training": [
    {
      "week": 1,
      "days": [
        {
          "day_index": 1,
          "session_name": "Upper Pull",
          "time_min": 50,
          "focus": "hypertrophy",
          "rpe_goal": 7,
          "exercises": [
            {
              "name": "Barbell Row",
              "sets": 4,
              "reps": "6-8",
              "tempo": "3011",
              "rest_sec": 90,
              "notes": "Neutral spine"
            }
          ],
          "finisher": { "type": "emom", "minutes": 10, "details": "10 burpees" },
          "substitutions": ["DB Row","Band Pulldown"]
        }
      ]
    }
  ],
  "nutrition": {
    "daily_targets": { "kcal": 2200, "protein_g": 170, "carbs_g": 210, "fat_g": 70 },
    "meal_plan": [
      {
        "day_index": 1,
        "meals": [
          {
            "meal_time": "breakfast",
            "recipe_title": "High-Protein Overnight Oats (UK)",
            "kcal": 520,
            "p": 45,
            "c": 60,
            "f": 14,
            "ingredients": [{"item":"Rolled oats","qty":"70g"}],
            "instructions": "Mix and chill overnight.",
            "tags": ["quick","budget","prep"]
          }
        ]
      }
    ]
  },
  "habits": [{"name":"10k steps","target":"daily"}],
  "checkins": {
    "frequency_days": 7,
    "questions": ["Energy 1–10?","Hunger 1–10?"],
    "adjustment_rules": ["If weight change > ±0.7%/wk → tweak kcal by 5–10%"]
  }
}`;

    // Call LLM
    console.log('[generate-plan] Calling LLM');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-plan] LLM error:', errorText);
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const planData = JSON.parse(data.choices[0].message.content);

    console.log('[generate-plan] Plan generated, saving to database');

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (weeks * 7));

    // Save plan
    const { data: savedPlan, error: planError } = await supabase
      .from('plans')
      .insert({
        user_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        plan_type: 'hybrid',
        payload: planData,
      })
      .select()
      .single();

    if (planError) throw planError;

    // Save workouts
    const workoutInserts = [];
    for (const week of planData.training || []) {
      for (const day of week.days || []) {
        workoutInserts.push({
          user_id: user.id,
          plan_id: savedPlan.id,
          day_index: day.day_index,
          session_name: day.session_name,
          focus: day.focus,
          exercises: day.exercises,
          time_min: day.time_min,
          rpe_goal: day.rpe_goal,
          instructions: JSON.stringify(day),
        });
      }
    }

    if (workoutInserts.length > 0) {
      const { error: workoutError } = await supabase
        .from('workouts')
        .insert(workoutInserts);
      
      if (workoutError) console.error('[generate-plan] Workout save error:', workoutError);
    }

    // Save meals
    const mealInserts = [];
    for (const dayPlan of planData.nutrition?.meal_plan || []) {
      for (const meal of dayPlan.meals || []) {
        mealInserts.push({
          user_id: user.id,
          plan_id: savedPlan.id,
          day_index: dayPlan.day_index,
          meal_time: meal.meal_time,
          recipe_title: meal.recipe_title,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          kcal: meal.kcal,
          protein_g: meal.p,
          carbs_g: meal.c,
          fat_g: meal.f,
          tags: meal.tags,
        });
      }
    }

    if (mealInserts.length > 0) {
      const { error: mealError } = await supabase
        .from('meals')
        .insert(mealInserts);
      
      if (mealError) console.error('[generate-plan] Meal save error:', mealError);
    }

    // Update coach state
    await supabase
      .from('coach_state')
      .update({
        last_checkin_at: new Date().toISOString(),
        next_checkin_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('user_id', user.id);

    // Log event
    await supabase
      .from('events')
      .insert({
        user_id: user.id,
        kind: 'plan_update',
        summary: `Generated ${weeks}-week ${coachState.current_phase} plan`,
        payload: { plan_id: savedPlan.id },
      });

    console.log('[generate-plan] Success!');

    return new Response(
      JSON.stringify({ success: true, plan_id: savedPlan.id, plan: planData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-plan] Error:', error);
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
