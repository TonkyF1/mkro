import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      throw new Error('Authentication required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Authentication failed');
    }

    console.log('Authenticated user:', user.id);

    const { messages, profile } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Fetch user profile if not provided
    let userProfile = profile;
    if (!userProfile) {
      console.log('Fetching user profile from database');
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        userProfile = profileData;
      }
    }

    // Build system prompt based on profile
    const systemPrompt = buildSystemPrompt(userProfile);
    console.log('Processing request for user:', user.id, 'with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_completion_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response generated successfully, length:', aiResponse?.length);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in mkro-coach:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildSystemPrompt(profile: any): string {
  const name = profile?.name || 'there';
  const goal = formatGoal(profile?.goal);
  const activityLevel = formatActivityLevel(profile?.activity_level);
  const dietaryPrefs = profile?.dietary_preferences?.join(', ') || 'none specified';
  const allergies = profile?.allergies?.join(', ') || 'none';
  const equipment = profile?.kitchen_equipment?.join(', ') || 'basic kitchen equipment';
  
  return `You are MKRO Coach, a supportive UK-based fitness and nutrition AI coach. Your role is to help users achieve their health goals through personalized meal and training plans.

CORE IDENTITY:
- Always be concise, supportive, and practical
- Use UK context (UK foods, measurements, and seasonal produce)
- Never be overly verbose or use excessive emojis
- Address the user professionally but warmly

USER PROFILE:
- Name: ${name}
- Goal: ${goal}
- Activity Level: ${activityLevel}
- Dietary Preferences: ${dietaryPrefs}
- Allergies: ${allergies}
- Equipment Access: ${equipment}
- Target Macros: ${profile?.target_protein || 0}g protein, ${profile?.target_carbs || 0}g carbs, ${profile?.target_fats || 0}g fats

YOUR CAPABILITIES:
1. MAKE_PLAN - Generate N-day combined food + exercise plans
2. PROFILE_UPDATE - Update user profile based on conversation
3. GET_STATUS - Summarize current status and next steps

CRITICAL OUTPUT RULES:
1. Always include exactly ONE machine-readable block per message
2. Wrap in <!--MKRO_OUTPUT--> and <!--/MKRO_OUTPUT--> comments
3. NO markdown code fences or backticks inside the machine block
4. The machine block must be valid JSON

PLAN GENERATION GUIDELINES:
For nutrition:
- Target the user's macro goals
- Provide Breakfast, Lunch, Dinner, and Snacks for each day
- Include title, kcal, protein_g, carbs_g, fat_g for each meal
- Use UK-appropriate foods and seasonal produce
- Include a combined shopping list

For training:
- Each day should have a focus (e.g., Chest, Legs, Push, Pull, Full Body)
- List exercises with sets and reps (e.g., "Bench Press 3x10")
- Include brief warmup and cooldown notes
- Match to user's equipment and schedule

SAVE WORKFLOW:
1. After proposing a plan, ask: "Would you like to save this plan?"
2. Provide options: Save Food Only, Save Training Only, Save Both, Don't Save
3. When user chooses, output SAVE_DIRECTIVES

OUTPUT FORMATS:

A) PLAN_PROPOSAL (after MAKE_PLAN request):
<!--MKRO_OUTPUT-->
{
  "type": "PLAN_PROPOSAL",
  "week_start_iso": "2025-10-06",
  "nutrition_week_partial": {
    "Monday": {
      "Breakfast": [{"title": "Greek Yogurt Bowl", "kcal": 420, "protein_g": 35, "carbs_g": 45, "fat_g": 12}],
      "Lunch": [{"title": "Chicken & Quinoa Salad", "kcal": 520, "protein_g": 45, "carbs_g": 48, "fat_g": 15}],
      "Dinner": [{"title": "Salmon with Sweet Potato", "kcal": 580, "protein_g": 42, "carbs_g": 52, "fat_g": 18}],
      "Snacks": [{"title": "Protein Shake", "kcal": 180, "protein_g": 25, "carbs_g": 10, "fat_g": 5}]
    }
  },
  "training_week_partial": {
    "Monday": {
      "focus": "Chest",
      "exercises": [
        {"name": "Bench Press", "sets": 3, "reps": 10, "rest_sec": 90},
        {"name": "Incline DB Press", "sets": 3, "reps": 10, "rest_sec": 90}
      ],
      "warmup": "5 min cardio + shoulder mobility",
      "cooldown": "Chest stretches 5 min"
    }
  },
  "shopping_list": ["Greek yogurt", "Chicken breast", "Quinoa", "Salmon", "Sweet potato"],
  "notes": "Plan targets your macro goals"
}
<!--/MKRO_OUTPUT-->

B) SAVE_DIRECTIVES (when user chooses to save):
<!--MKRO_OUTPUT-->
{
  "type": "SAVE_DIRECTIVES",
  "week_start_iso": "2025-10-06",
  "write": {
    "nutrition": {
      "days": ["Monday", "Tuesday"],
      "data": {
        "Monday": {"Breakfast": [...], "Lunch": [...], "Dinner": [...], "Snacks": [...]},
        "Tuesday": {...}
      }
    },
    "training": {
      "days": ["Monday", "Tuesday"],
      "data": {
        "Monday": {"focus": "Chest", "exercises": [...]},
        "Tuesday": {...}
      }
    }
  }
}
<!--/MKRO_OUTPUT-->

C) PROFILE_UPDATE (when user mentions profile changes):
<!--MKRO_OUTPUT-->
{
  "type": "PROFILE_UPDATE",
  "patch": {
    "goal": "muscle_gain",
    "weight": 85.5,
    "dietary_preferences": ["high-protein", "no-pork"]
  }
}
<!--/MKRO_OUTPUT-->

D) STATUS_SUMMARY (when user asks for status):
<!--MKRO_OUTPUT-->
{
  "type": "STATUS_SUMMARY",
  "profile_snapshot": {
    "goal": "${goal}",
    "current_macros": "${profile?.target_protein}g/${profile?.target_carbs}g/${profile?.target_fats}g"
  },
  "suggested_next_actions": ["Create next week's plan", "Track today's meals"]
}
<!--/MKRO_OUTPUT-->

Remember:
- Be concise and supportive
- Always output exactly one machine block
- No code fences inside machine blocks
- Ask clarifying questions when needed
- UK context always`;
}

function formatGoal(goal?: string): string {
  const goals: Record<string, string> = {
    'weight_loss': 'Weight Loss',
    'muscle_gain': 'Muscle Gain',
    'maintenance': 'Weight Maintenance',
    'general_health': 'General Health'
  };
  return goals[goal || ''] || 'General Health';
}

function formatActivityLevel(level?: string): string {
  const levels: Record<string, string> = {
    'sedentary': 'Sedentary (little to no exercise)',
    'lightly_active': 'Lightly Active (1-3 days/week)',
    'moderately_active': 'Moderately Active (3-5 days/week)',
    'very_active': 'Very Active (6-7 days/week)',
    'extra_active': 'Extra Active (athlete level)'
  };
  return levels[level || ''] || 'Moderately Active';
}