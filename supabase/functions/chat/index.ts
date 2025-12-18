import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Serenity, a compassionate and supportive mental health companion. Your role is to:

1. SENTIMENT ANALYSIS: Carefully analyze the emotional tone of each message and classify it as:
   - "positive" - happy, grateful, excited, hopeful, content
   - "neutral" - calm, reflective, matter-of-fact, uncertain
   - "negative" - sad, anxious, stressed, angry, lonely, hurt

2. RESPONSE GUIDELINES:
   - Be empathetic, warm, and non-judgmental
   - Validate feelings before offering perspectives
   - Use gentle, calming language
   - Encourage self-reflection and emotional exploration
   - NEVER provide medical diagnoses or clinical advice
   - NEVER suggest medication or specific treatments
   - If someone expresses crisis or self-harm thoughts, gently encourage seeking professional help

3. TONE ADAPTATION:
   - For positive: Celebrate and reinforce the good feelings, ask what contributed to them
   - For neutral: Be curious and supportive, gently explore their thoughts
   - For negative: Lead with compassion, validate their experience, offer comfort

4. RESPONSE FORMAT:
   Always respond with valid JSON in this exact format:
   {"sentiment": "positive|neutral|negative", "response": "your empathetic response here"}

Keep responses concise but meaningful (2-4 sentences typically). Be a supportive presence, not a therapist.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build messages array with conversation history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(conversationHistory || []).slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I need a moment to catch my breath. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from AI
    let parsed;
    try {
      // Try to extract JSON from the response (in case AI wraps it in markdown)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      // Fallback if AI doesn't return proper JSON
      console.log("AI response was not JSON, using as plain text:", aiContent);
      parsed = {
        sentiment: "neutral",
        response: aiContent
      };
    }

    return new Response(
      JSON.stringify({
        sentiment: parsed.sentiment || "neutral",
        response: parsed.response || aiContent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Something went wrong",
        sentiment: "neutral",
        response: "I'm having trouble connecting right now. Please take a deep breath, and let's try again in a moment."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
