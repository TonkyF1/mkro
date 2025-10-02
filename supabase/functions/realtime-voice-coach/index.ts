import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    let openAISocket: WebSocket | null = null;
    let userProfile: any = null;

    socket.onopen = () => {
      console.log("Client WebSocket connected");
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received from client:", message.type);

        // Initialize connection with user profile
        if (message.type === "session.init" && message.profile) {
          userProfile = message.profile;
          
          // Connect to OpenAI Realtime API
          const model = "gpt-4o-realtime-preview-2024-12-17";
          openAISocket = new WebSocket(
            `wss://api.openai.com/v1/realtime?model=${model}`,
            {
              headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "OpenAI-Beta": "realtime=v1",
              },
            }
          );

          openAISocket.onopen = () => {
            console.log("Connected to OpenAI Realtime API");
            
            // Build personalized system prompt with user data
            const systemPrompt = buildSystemPrompt(userProfile);
            
            // Configure session
            openAISocket?.send(JSON.stringify({
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: systemPrompt,
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                temperature: 0.8,
                max_response_output_tokens: 4096
              }
            }));
          };

          openAISocket.onmessage = (event) => {
            // Forward all messages from OpenAI to client
            socket.send(event.data);
          };

          openAISocket.onerror = (error) => {
            console.error("OpenAI WebSocket error:", error);
            socket.send(JSON.stringify({
              type: "error",
              error: "Connection to AI service failed"
            }));
          };

          openAISocket.onclose = () => {
            console.log("OpenAI WebSocket closed");
            socket.send(JSON.stringify({
              type: "session.closed"
            }));
          };

          // Notify client that session is ready
          socket.send(JSON.stringify({
            type: "session.ready"
          }));
        } 
        // Forward all other messages to OpenAI
        else if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
          openAISocket.send(event.data);
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    };

    socket.onclose = () => {
      console.log("Client WebSocket closed");
      if (openAISocket) {
        openAISocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error);
      if (openAISocket) {
        openAISocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error("WebSocket upgrade error:", error);
    return new Response("Failed to upgrade to WebSocket", { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

function buildSystemPrompt(profile: any): string {
  const name = profile?.name || "there";
  const goal = formatGoal(profile?.goal);
  const activityLevel = formatActivityLevel(profile?.activity_level);
  const dietaryPrefs = profile?.dietary_preferences?.join(", ") || "none specified";
  const allergies = profile?.allergies?.join(", ") || "none";
  const healthConditions = profile?.health_conditions?.join(", ") || "none";
  
  return `You are MKRO, an expert AI personal trainer and nutrition coach. You provide personalized fitness and nutrition advice.

USER PROFILE:
- Name: ${name}
- Goal: ${goal}
- Activity Level: ${activityLevel}
- Age: ${profile?.age || "not specified"}
- Height: ${profile?.height || "not specified"} ${profile?.height_unit || ""}
- Weight: ${profile?.weight || "not specified"} ${profile?.weight_unit || ""}
- Dietary Preferences: ${dietaryPrefs}
- Allergies: ${allergies}
- Health Conditions: ${healthConditions}
- Target Macros: ${profile?.target_protein || 0}g protein, ${profile?.target_carbs || 0}g carbs, ${profile?.target_fats || 0}g fats
- Meal Frequency: ${profile?.meal_frequency || 3} meals per day
- Sleep: ${profile?.sleep_hours || "not specified"} hours
- Stress Level: ${profile?.stress_level ? `${profile.stress_level}/10` : "not specified"}

INSTRUCTIONS:
- Always address the user by name when you know it
- Reference their goals and profile data in your advice
- Be encouraging, motivating, and supportive
- Provide specific, actionable advice based on their profile
- When creating meal plans, respect their dietary preferences and allergies
- When creating workout plans, consider their activity level and goals
- Keep responses conversational but informative
- If asked about their progress, ask clarifying questions about their current situation
- Remember previous conversations and build on them

RESPONSE STYLE:
- Be warm, friendly, and professional
- Use natural, conversational language
- Keep audio responses concise (2-3 sentences) but informative
- For detailed plans, mention you can provide them in text
- Always prioritize user safety and well-being`;
}

function formatGoal(goal?: string): string {
  const goals: Record<string, string> = {
    "weight_loss": "Weight Loss",
    "muscle_gain": "Muscle Gain",
    "maintenance": "Weight Maintenance",
    "general_health": "General Health & Wellness"
  };
  return goals[goal || ""] || "General Health";
}

function formatActivityLevel(level?: string): string {
  const levels: Record<string, string> = {
    "sedentary": "Sedentary (Little to no exercise)",
    "lightly_active": "Lightly Active (1-3 days/week)",
    "moderately_active": "Moderately Active (3-5 days/week)",
    "very_active": "Very Active (6-7 days/week)",
    "extremely_active": "Extremely Active (Physical job + training)"
  };
  return levels[level || ""] || "Not specified";
}
