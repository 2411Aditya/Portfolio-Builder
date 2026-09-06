import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an elite portfolio designer and copywriter AI.
Given a user's current portfolio data, current custom styles, and natural language instructions, generate strict JSON modifications.

CRITICAL PRECISION RULES:
1. THEME & COLOR PRESERVATION (CRITICAL!):
   - DO NOT change theme colors, background colors, or fonts unless the user EXPLICITLY asks to change colors/theme (e.g. "make it dark", "make theme emerald green", "change background to light blue").
   - If the user asks to change DATA, TEXT, BIO, SKILLS, or CONTACT INFO:
     * Leave "themeOverrides": {} completely EMPTY!
     * DO NOT provide "backgroundColor", "cardBackground", or "primaryColor"!
   - Only populate "themeOverrides" if the user prompt explicitly asks for visual color/font styling changes.

2. CONTENT & DATA UPDATES:
   - If user asks to change or remove DATA (e.g. "remove my contact number", "change my name", "add skill Docker", "rewrite my bio"):
     * Put all resume data edits inside "dataUpdates".
     * To remove phone/whatsapp: set "contact": { "phone": "", "whatsapp": "" } in "dataUpdates".
     * To remove a contact link: set that key to "" in "dataUpdates.contact".
     * To remove or update skills: provide the updated array in "dataUpdates.skills".
     * To update name/title/bio: provide "name", "title", "bio" in "dataUpdates".

3. STRICT JSON SCHEMA:
{
  "themeOverrides": {}, 
  "contentRefinements": {}, 
  "customSections": [], 
  "dataUpdates": {
    "name": "optional",
    "title": "optional",
    "bio": "optional",
    "skills": ["optional"],
    "projects": [ ... ],
    "experience": [ ... ],
    "education": [ ... ],
    "certifications": [ ... ],
    "contact": { "phone": "", "whatsapp": "", "email": "", "github": "", "linkedin": "", "website": "" }
  },
  "summary": "Short 1-sentence friendly confirmation of what was changed"
}

4. STRICTLY NO raw HTML tags, NO raw CSS strings, NO markdown code blocks, NO text commentary outside the JSON.`;

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

    const generatedOutput = JSON.parse(rawOutput);

    // Merge with existing custom styles
    const mergedCustomStyles = {
      themeOverrides: {
        ...(currentCustomStyles?.themeOverrides || {}),
        ...(generatedOutput.themeOverrides || {}),
      },
      contentRefinements: {
        ...(currentCustomStyles?.contentRefinements || {}),
        ...(generatedOutput.contentRefinements || {}),
      },
      customSections: generatedOutput.customSections || currentCustomStyles?.customSections || [],
    };

    // Merge base data
    let mergedData = { ...(currentData || {}) };
    if (generatedOutput.dataUpdates && typeof generatedOutput.dataUpdates === 'object') {
      const updates = generatedOutput.dataUpdates;
      if (updates.name) mergedData.name = updates.name;
      if (updates.title) mergedData.title = updates.title;
      if (updates.bio) mergedData.bio = updates.bio;
      if (Array.isArray(updates.skills) && updates.skills.length > 0) {
        mergedData.skills = updates.skills;
      }
      if (updates.contact && typeof updates.contact === 'object') {
        mergedData.contact = { ...(mergedData.contact || {}), ...updates.contact };
      }
    }

    // Save to database if portfolioId is provided
    if (portfolioId) {
      await supabaseClient
        .from('portfolios')
        .update({
          custom_styles: mergedCustomStyles,
          data: mergedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id);
    }

    return new Response(
      JSON.stringify({
        customStyles: mergedCustomStyles,
        portfolioData: mergedData,
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

