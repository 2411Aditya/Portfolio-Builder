import { supabase } from '../lib/supabase';
import { updatePortfolioStylesAndData } from '../api/client';

const SYSTEM_PROMPT = `You are an elite portfolio designer and copywriter AI.
Given a user's current portfolio data, current custom styles, and natural language instructions, generate strict JSON modifications.

CRITICAL PRECISION RULES:
1. THEME & COLOR PRESERVATION (CRITICAL!):
   - DO NOT change theme colors, background colors, or fonts unless the user EXPLICITLY asks to change colors/theme (e.g. "make it dark", "make theme emerald green", "change background to light blue").
   - If the user asks to change DATA, TEXT, BIO, SKILLS, PROJECTS, LINKS, or CONTACT INFO:
     * Leave "themeOverrides": {} completely EMPTY!
     * DO NOT provide "backgroundColor", "cardBackground", or "primaryColor"!
   - Only populate "themeOverrides" if the user prompt explicitly asks for visual color/font styling changes.

2. CONTENT & DATA UPDATES:
   - If user asks to change or remove DATA:
     * Put all resume data edits inside "dataUpdates".
     * To update project redirect links / demo links / URLs (e.g. "change redirect link of project auoraa to https://www.auoraa.com"):
       Provide the updated projects list in "dataUpdates.projects". Each project MUST have:
       { "name": "...", "description": "...", "tech": [...], "url": "https://..." }
       Ensure the link field is strictly named "url".
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
    "projects": [
      {
        "name": "Project Name",
        "description": "Project summary",
        "tech": ["React", "AI"],
        "url": "https://www.example.com"
      }
    ],
    "experience": [ ... ],
    "education": [ ... ],
    "certifications": [ ... ],
    "contact": { "phone": "", "whatsapp": "", "email": "", "github": "", "linkedin": "", "website": "" }
  },
  "summary": "Short 1-sentence friendly confirmation of what was changed"
}

4. STRICTLY NO raw HTML tags, NO raw CSS strings, NO markdown blocks, NO commentary outside JSON.`;

/**
 * Execute AI Portfolio Customization with Strict JSON Schema and Guaranteed Auto-Save
 */
export async function customizePortfolioWithAI({ portfolioId, currentData, currentCustomStyles, prompt }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
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
              text: `${SYSTEM_PROMPT}\n\nPortfolio Base Data:\n${JSON.stringify(currentData || {})}\n\nCurrent Custom Styles:\n${JSON.stringify(currentCustomStyles || {})}\n\nUser Request:\n"${prompt}"`,
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

  const generatedOutput = JSON.parse(rawText);

  // Merge Custom Styles safely
  const newTheme = (generatedOutput.themeOverrides && typeof generatedOutput.themeOverrides === 'object')
    ? generatedOutput.themeOverrides
    : {};
  const newRefinements = (generatedOutput.contentRefinements && typeof generatedOutput.contentRefinements === 'object')
    ? generatedOutput.contentRefinements
    : {};

  const mergedStyles = {
    themeOverrides: {
      ...(currentCustomStyles?.themeOverrides || {}),
      ...newTheme,
    },
    contentRefinements: {
      ...(currentCustomStyles?.contentRefinements || {}),
      ...newRefinements,
    },
    customSections: Array.isArray(generatedOutput.customSections) && generatedOutput.customSections.length > 0
      ? generatedOutput.customSections
      : (currentCustomStyles?.customSections || []),
  };

  // Merge Base Data safely with explicit deletion and project URL normalization
  let mergedData = { ...(currentData || {}) };
  if (generatedOutput.dataUpdates && typeof generatedOutput.dataUpdates === 'object') {
    const updates = generatedOutput.dataUpdates;
    if (updates.name !== undefined) mergedData.name = updates.name;
    if (updates.title !== undefined) mergedData.title = updates.title;
    if (updates.bio !== undefined) mergedData.bio = updates.bio;

    if (Array.isArray(updates.skills)) {
      mergedData.skills = updates.skills.filter(Boolean);
    }

    if (Array.isArray(updates.projects)) {
      const existingProjects = [...(currentData?.projects || [])];
      if (updates.projects.length < existingProjects.length && updates.projects.length > 0) {
        // AI returned subset of modified projects; merge onto existing list
        updates.projects.forEach(upProj => {
          const matchIdx = existingProjects.findIndex(
            (p) => p.name && upProj.name && p.name.trim().toLowerCase() === upProj.name.trim().toLowerCase()
          );
          const resolvedUrl = upProj.url || upProj.link || upProj.redirect || upProj.liveUrl || upProj.website || upProj.demo || '';
          if (matchIdx !== -1) {
            existingProjects[matchIdx] = {
              ...existingProjects[matchIdx],
              ...upProj,
              ...(resolvedUrl ? { url: resolvedUrl } : {}),
            };
          } else {
            existingProjects.push({
              ...upProj,
              ...(resolvedUrl ? { url: resolvedUrl } : {}),
            });
          }
        });
        mergedData.projects = existingProjects;
      } else {
        mergedData.projects = updates.projects.map((proj, idx) => {
          const existing = existingProjects.find(
            (p) => p.name && proj.name && p.name.trim().toLowerCase() === proj.name.trim().toLowerCase()
          ) || existingProjects[idx] || {};

          const resolvedUrl = proj.url || proj.link || proj.redirect || proj.liveUrl || proj.website || proj.demo || existing.url || existing.link || '';
          
          return {
            ...existing,
            ...proj,
            url: resolvedUrl,
          };
        });
      }
    }

    if (Array.isArray(updates.experience)) {
      mergedData.experience = updates.experience;
    }
    if (Array.isArray(updates.education)) {
      mergedData.education = updates.education;
    }
    if (Array.isArray(updates.certifications)) {
      mergedData.certifications = updates.certifications;
    }

    // Handle contact deletions and updates
    if (updates.contact && typeof updates.contact === 'object') {
      mergedData.contact = { ...(mergedData.contact || {}) };
      for (const [key, val] of Object.entries(updates.contact)) {
        if (val === '' || val === null || val === false) {
          delete mergedData.contact[key];
        } else {
          mergedData.contact[key] = val;
        }
      }
    }
  }

  // Guaranteed Auto-Save to Supabase
  if (portfolioId) {
    try {
      await updatePortfolioStylesAndData(portfolioId, mergedStyles, mergedData);
    } catch (err) {
      console.warn('Auto-save database write notice:', err.message);
    }
  }

  return {
    customStyles: mergedStyles,
    portfolioData: mergedData,
    summary: generatedOutput.summary,
  };
}


