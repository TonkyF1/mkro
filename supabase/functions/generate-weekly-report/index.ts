import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Calculate week range
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    // Fetch nutrition data from last week
    const { data: mealHistory } = await supabaseClient
      .from('meal_history')
      .select('*')
      .gte('created_at', weekStart.toISOString())
      .order('created_at', { ascending: false });

    // Fetch training data from last week
    const { data: trainingPlan } = await supabaseClient
      .from('weekly_training_plans')
      .select('*')
      .eq('user_id', user.id)
      .gte('week_start', weekStart.toISOString().split('T')[0])
      .single();

    // Fetch meal completions
    const { data: completions } = await supabaseClient
      .from('meal_completions')
      .select('*')
      .eq('user_id', user.id)
      .gte('week_start', weekStart.toISOString().split('T')[0]);

    // Calculate stats
    const totalMeals = mealHistory?.length || 0;
    const totalCalories = mealHistory?.reduce((sum, m) => sum + m.calories, 0) || 0;
    const avgCalories = totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0;
    const totalProtein = mealHistory?.reduce((sum, m) => sum + m.protein, 0) || 0;
    const completedMeals = completions?.filter(c => c.completed).length || 0;

    const prompt = `You are an AI fitness and nutrition coach analyzing a user's weekly performance.

User Profile:
- Goal: ${profile?.goal || 'Not set'}
- Target Protein: ${profile?.target_protein || 'Not set'}g
- Target Carbs: ${profile?.target_carbs || 'Not set'}g
- Target Fats: ${profile?.target_fats || 'Not set'}g

Week Stats (Last 7 days):
- Total meals logged: ${totalMeals}
- Average calories per meal: ${avgCalories}
- Total protein consumed: ${totalProtein}g
- Meal plan completions: ${completedMeals}
- Has active training plan: ${trainingPlan ? 'Yes' : 'No'}

Please provide:
1. A brief summary of their week (2-3 sentences)
2. Nutrition insights (analyze their eating patterns, macros adherence)
3. Training insights (comment on consistency and adherence)
4. 3-5 specific, actionable recommendations for next week
5. Highlight 2-3 achievements or wins from this week

Keep the tone supportive, motivating, and professional. Be specific and data-driven.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI fitness and nutrition coach providing weekly performance reports.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API Error:', error);
      throw new Error('Failed to generate report');
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    // Parse the AI response into structured sections
    const report = {
      summary: aiResponse.split('2.')[0].replace('1.', '').trim(),
      nutrition_insights: aiResponse.split('3.')[0].split('2.')[1]?.trim() || '',
      training_insights: aiResponse.split('4.')[0].split('3.')[1]?.trim() || '',
      recommendations: extractList(aiResponse.split('5.')[0].split('4.')[1] || ''),
      achievements: extractList(aiResponse.split('5.')[1] || ''),
      week_start: weekStart.toISOString(),
      week_end: now.toISOString(),
    };

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error generating weekly report:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractList(text: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .filter(line => line.trim().match(/^[-•*\d.]/))
    .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
    .filter(line => line.length > 0);
}
