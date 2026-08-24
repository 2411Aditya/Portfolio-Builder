import { supabase } from '../lib/supabase';

const SYSTEM_PROMPT = `You are an elite portfolio designer and copywriter AI.
Given a user's current portfolio data, current custom styles, and natural language instructions, generate strict JSON modifications that refine their portfolio aesthetic and copy.

CRITICAL CONSTRAINTS:
1. Output MUST be ONLY valid JSON matching this exact schema:
{
  "themeOverrides": {
    "primaryColor": "hex string (e.g. #10b981)",
    "fontFamily": "font family string (e.g. 'Space Grotesk', 'Outfit', 'Inter', 'Playfair Display', 'Plus Jakarta Sans')",
    "accentGlow": "glow color (e.g. rgba(16,185,129,0.35))",
    "backgroundColor": "dark or light hex color (e.g. #090d16 or #f8fafc)",
    "cardBackground": "card hex color (e.g. #131b2e or #ffffff)"
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
3. If the prompt is vague (e.g. "make it look cool" or "upgrade it"), make tasteful modern enhancements suited to a senior engineer.`;

/**
 * Execute AI Portfolio Customization with Strict JSON Schema
 */
export async function customizePortfolioWithAI({ portfolioId, currentData, currentCustomStyles, prompt }) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // 1. Try Supabase Edge Function first
  if (token) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-customize-portfolio', {
        body: {
          portfolioId,
          currentData,
          currentCustomStyles,
          prompt,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!error && data?.customStyles) {
        return data.customStyles;
      }
      if (data?.requiresUpgrade) {
        throw new Error('AI Customizer requires a Pro Tier plan.');
      }
    } catch (err) {
      if (err.message?.includes('Pro Tier')) throw err;
      console.warn('Edge function invoke fallback to direct Gemini API:', err);
    }
  }

  // 2. Client Gemini Fallback
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
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

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `AI customization failed with status ${response.status}`);
  }

  const data = await response.json();
  let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  // Sanitize JSON
  if (rawText.includes('```')) {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) rawText = match[1].trim();
  }
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    rawText = rawText.substring(start, end + 1);
  }

  const generatedCustomStyles = JSON.parse(rawText);

  // Merge safely
  const merged = {
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

  // If portfolioId is present, persist in Supabase
  if (portfolioId) {
    await supabase
      .from('portfolios')
      .update({
        custom_styles: merged,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId);
  }

  return merged;
}
