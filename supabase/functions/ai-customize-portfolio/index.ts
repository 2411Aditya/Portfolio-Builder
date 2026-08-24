import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an elite portfolio designer and copywriter AI.
Given a user's current portfolio data, current custom styles, and natural language instructions, generate strict JSON modifications that refine their portfolio aesthetic and copy.

CRITICAL CONSTRAINTS:
1. Output MUST be ONLY valid JSON matching this exact schema:
{
  "themeOverrides": {
    "primaryColor": "hex or hsl string (e.g. #10b981)",
    "fontFamily": "font family string (e.g. 'Space Grotesk', 'Outfit', 'Inter', 'Playfair Display')",
    "accentGlow": "glow color (e.g. rgba(16,185,129,0.3))",
    "backgroundColor": "dark/light hex color",
    "cardBackground": "card hex color"
  },
  "contentRefinements": {
    "headline": "Elevated punchy headline or full name",
    "bio": "Compelling, refined 2-3 sentence bio tailored to the request",
    "highlightedSkills": ["skill1", "skill2", "skill3"]
  },
  "customSections": [
    {
      "title": "Section Title (e.g. Strategic Impact, Cloud Architecture)",
      "content": "Detailed custom paragraph or achievements."
    }
  ]
}

2. STRICTLY NO raw HTML tags, NO raw CSS strings, NO markdown code blocks, NO text commentary outside the JSON.
3. If the prompt is vague (e.g. "make it look cool" or "upgrade it"), make tasteful, modern, high-contrast enhancements suited to a top-tier software engineer or professional.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check Plan Tier in `profiles`
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('plan_tier')
      .eq('id', user.id)
      .single();

    if (profile?.plan_tier !== 'pro') {
      return new Response(
        JSON.stringify({
          error: 'AI Portfolio Customizer is an exclusive Pro Tier feature. Please upgrade to Pro to unlock.',
          requiresUpgrade: true,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { portfolioId, currentData, currentCustomStyles, prompt } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('VITE_GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API Key is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Gemini Model
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nPortfolio Data:\n${JSON.stringify(currentData || {})}\n\nCurrent Custom Styles:\n${JSON.stringify(currentCustomStyles || {})}\n\nUser Request:\n"${prompt}"`,
              },
            ],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      return new Response(JSON.stringify({ error: err.error?.message || 'Gemini API call failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiRes.json();
    let rawOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Sanitize JSON
    if (rawOutput.includes('```')) {
      const match = rawOutput.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) rawOutput = match[1].trim();
    }
    const start = rawOutput.indexOf('{');
    const end = rawOutput.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      rawOutput = rawOutput.substring(start, end + 1);
    }

    const generatedCustomStyles = JSON.parse(rawOutput);

    // Merge with existing custom styles
    const mergedCustomStyles = {
      themeOverrides: {
        ...(currentCustomStyles?.themeOverrides || {}),
        ...(generatedCustomStyles.themeOverrides || {}),
      },
      contentRefinements: {
        ...(currentCustomStyles?.contentRefinements || {}),
        ...(generatedCustomStyles.contentRefinements || {}),
      },
      customSections: generatedCustomStyles.customSections || currentCustomStyles?.customSections || [],
    };

    // Save to database if portfolioId is provided
    if (portfolioId) {
      await supabaseClient
        .from('portfolios')
        .update({
          custom_styles: mergedCustomStyles,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id);
    }

    return new Response(
      JSON.stringify({
        customStyles: mergedCustomStyles,
        success: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
