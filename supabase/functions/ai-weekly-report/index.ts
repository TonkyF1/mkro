import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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

    const { week_start } = await req.json();
    const weekStartDate = week_start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weekEndDate = new Date(new Date(weekStartDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Fetch week's diary meals
    const { data: meals } = await supabaseClient
      .from('diary_meals')
      .select('*, recipes(*)')
      .eq('user_id', user.id)
      .gte('date', weekStartDate)
      .lte('date', weekEndDate);

    // Fetch week's exercise logs
    const { data: exercises } = await supabaseClient
      .from('exercise_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekStartDate)
      .lte('date', weekEndDate);

    // Fetch week's hydration
    const { data: hydration } = await supabaseClient
      .from('hydration_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekStartDate)
      .lte('date', weekEndDate);

    // Calculate stats
    const completedMeals = meals?.filter(m => m.is_completed) || [];
    const totalMeals = meals?.length || 0;
    const adherenceRate = totalMeals > 0 ? (completedMeals.length / totalMeals * 100).toFixed(0) : 0;

    const daysWithHydration = new Set(hydration?.map(h => h.date) || []).size;
    const hydrationRate = (daysWithHydration / 7 * 100).toFixed(0);

    const workoutCount = exercises?.length || 0;

    // Calculate badges
    const badges: string[] = [];
    if (parseInt(adherenceRate) >= 70) badges.push('5-Day Consistency');
    if (parseInt(hydrationRate) >= 70) badges.push('Hydration Hero');
    if (workoutCount >= 3) badges.push('Training Champion');

    // Build AI prompt for insights
    const systemPrompt = `You are MKRO Coach. Analyze this week's data and provide:
1. A motivating 2-3 sentence summary
2. Top 3 suggestions for next week

User profile: ${JSON.stringify(profile)}
Adherence: ${adherenceRate}%
Hydration: ${hydrationRate}%
Workouts: ${workoutCount}

Be specific, actionable, and encouraging.`;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
          { role: 'user', content: 'Generate weekly report' }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const aiResult = await openaiResponse.json();
    const aiSummary = aiResult.choices[0].message.content;

    // Save report
    const { data: report, error: reportError } = await supabaseClient
      .from('weekly_reports')
      .insert({
        user_id: user.id,
        week_start: weekStartDate,
        week_end: weekEndDate,
        summary: aiSummary,
        badges,
        suggestions: `Adherence: ${adherenceRate}%, Hydration: ${hydrationRate}%, Workouts: ${workoutCount}`,
        ai_raw: { adherenceRate, hydrationRate, workoutCount },
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // Log event
    await supabaseClient.from('events').insert({
      user_id: user.id,
      name: 'weekly_report_generated',
      meta: { week_start: weekStartDate, report_id: report.id },
    });

    return new Response(
      JSON.stringify({ report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-weekly-report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});