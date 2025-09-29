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
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Processing MKRO coaching request');

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Use OpenAI's GPT model for coaching with enhanced prompt structure
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are MKRO, a friendly and knowledgeable UK Personal Trainer and Nutrition Coach. Have natural conversations with users about fitness, health, and nutrition. 

Key traits:
- Be conversational, supportive, and encouraging
- Use UK units (kg, cm, stone if relevant)
- Give practical, evidence-based advice
- Ask follow-up questions naturally in conversation
- Adapt your communication style to what the user needs
- Be motivational but realistic
- Share tips, answer questions, and provide guidance on workouts, nutrition, weight management, etc.

You can discuss anything fitness and health related - from workout routines and form tips to meal planning and motivation. Keep responses helpful but conversational, like chatting with a knowledgeable personal trainer friend.` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      // Fallback response for MKRO
      const fallbackResponse = `Hello! I'm MKRO, your AI PT & Nutrition Coach. I'm currently having some technical difficulties, but I'm here to help you achieve your fitness goals.

To get started, I'd like to know:
1. What's your main fitness goal? (fat loss, muscle gain, performance, maintenance)
2. What are your current stats? (age, height, weight)
3. How many days per week can you train and what equipment do you have access to?

Once I have this information, I can create a personalized training and nutrition plan for you!

**Next 3 Actions:**
• Share your fitness goal and current stats
• Let me know your training availability 
• Tell me about any injuries or limitations`;

      return new Response(
        JSON.stringify({ text: fallbackResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI response received');

    // Extract the generated text
    const generatedText = data.choices?.[0]?.message?.content || `I'm MKRO, your AI PT & Nutrition Coach! I'm here to help you achieve your fitness goals with personalized training and nutrition plans.

Based on your message, I'd like to gather some information to create the best plan for you.

**Please tell me:**
1. Your main goal (fat loss, muscle gain, performance, maintenance)
2. Your stats (age, height, weight, sex)
3. Training availability (days per week, session length, equipment access)

**Next 3 Actions:**
• Share your fitness goals and current stats
• Describe your training schedule and equipment
• Mention any injuries or dietary restrictions`;

    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in MKRO coaching function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});