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

    const { metrics: newMetrics } = await req.json();

    // Save metrics
    const today = new Date().toISOString().split('T')[0];
    const { error: metricsError } = await supabase
      .from('metrics')
      .upsert({
        user_id: user.id,
        date: today,
        ...newMetrics,
      }, {
        onConflict: 'user_id,date'
      });

    if (metricsError) throw metricsError;

    // Fetch recent metrics for context
    const { data: recentMetrics } = await supabase
      .from('metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7);

    // Fetch profile and coach state
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: coachState } = await supabase
      .from('coach_state')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Build check-in prompt
    const systemPrompt = `You are MKRO Coach conducting a weekly check-in.
Analyze the user's progress and provide adaptive recommendations.
Output valid JSON only matching this schema:

{
  "summary": "Short recap of the week",
  "adherence_score": 82,
  "training_changes": [
    {"week": 2, "day_index": 3, "swap": "Back Squat → Goblet Squat", "reason": "Knee pain"}
  ],
  "nutrition_changes": {
    "kcal_delta": -150,
    "protein_delta": 0,
    "notes": "Reduce snacks slightly"
  },
  "next_actions": ["Book deload in week 4", "Add mobility block"]
}`;

    const userPrompt = `Analyze this week's check-in:

Recent metrics:
${JSON.stringify(recentMetrics, null, 2)}

User profile:
- Goals: ${JSON.stringify(profile?.goals)}
- Current phase: ${coachState?.current_phase}
- Last adherence: ${coachState?.adherence_score || 0}%

Provide actionable feedback and any necessary plan adjustments.`;

    // Call LLM
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
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const adjustments = JSON.parse(data.choices[0].message.content);

    // Update coach state
    await supabase
      .from('coach_state')
      .update({
        last_checkin_at: new Date().toISOString(),
        next_checkin_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        adherence_score: adjustments.adherence_score,
      })
      .eq('user_id', user.id);

    // Log check-in event
    await supabase
      .from('events')
      .insert({
        user_id: user.id,
        kind: 'checkin',
        summary: adjustments.summary,
        payload: adjustments,
      });

    return new Response(
      JSON.stringify({ success: true, adjustments }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[coach-checkin] Error:', error);
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
