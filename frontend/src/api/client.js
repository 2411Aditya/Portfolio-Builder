import { supabase } from '../lib/supabase';
import { parseResumeWithAI } from '../utils/aiParser';

/**
 * Generate and store portfolio in Supabase with template_id and custom_styles
 */
export async function generatePortfolio({ file, theme = 'dark', templateId = 'minimal', customStyles = {} }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to generate a portfolio.');
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0];

  // 1. AI Parse Resume
  const parsedData = await parseResumeWithAI(file);
  const title = `${parsedData.name || username} — ${parsedData.title || 'Portfolio'}`;

  // 2. Insert into Supabase 'portfolios' table
  const { data, error } = await supabase
    .from('portfolios')
    .insert([
      {
        user_id: user.id,
        username: username,
        title: title,
        theme: theme || 'dark',
        template_id: templateId || 'minimal',
        custom_styles: customStyles || {},
        data: parsedData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return {
    data: {
      ...data,
      public_url: `/p/${data.username}/${data.id}`,
    },
  };
}

/**
 * Get user's portfolio history from Supabase
 */
export async function getHistory() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: { portfolios: [] } };
  }

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const portfolios = (data || []).map((p) => {
    let styles = p.custom_styles || {};
    let resumeData = p.data;
    try {
      const cachedStr = localStorage.getItem(`auoraa_portfolio_${p.id}`);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (cached.custom_styles) styles = cached.custom_styles;
        if (cached.data) resumeData = cached.data;
      }
    } catch (e) {}

    return {
      ...p,
      template_id: p.template_id || 'minimal',
      custom_styles: styles,
      data: resumeData,
      public_url: `/p/${p.username}/${p.id}`,
    };
  });

  return { data: { portfolios } };
}

/**
 * Delete a portfolio from Supabase
 */
export async function deletePortfolio(id) {
  try {
    localStorage.removeItem(`auoraa_portfolio_${id}`);
  } catch (e) {}
  const { error } = await supabase.from('portfolios').delete().eq('id', id);
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  return { data: { success: true } };
}

/**
 * Get public portfolio by ID (with fallback to minimal template_id and custom_styles)
 */
export async function getPublicPortfolio(username, portfolioId) {
  let dbData = null;

  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (!error && data) {
      dbData = data;
    }
  } catch (e) {
    console.warn('Database fetch warning:', e.message);
  }

  // Check LocalStorage cache fallback
  let localCached = null;
  try {
    const cachedStr = localStorage.getItem(`auoraa_portfolio_${portfolioId}`);
    if (cachedStr) {
      localCached = JSON.parse(cachedStr);
    }
  } catch (e) {
    console.warn('LocalStorage read warning:', e);
  }

  if (!dbData && !localCached) {
    throw new Error('Portfolio not found.');
  }

  const base = dbData || {};

  // Extract custom_styles with multiple fallbacks:
  // 1. localCached.custom_styles
  // 2. base.custom_styles
  // 3. base.data?._custom_styles
  let resolvedStyles = {};
  if (localCached && localCached.custom_styles && Object.keys(localCached.custom_styles).length > 0) {
    resolvedStyles = localCached.custom_styles;
  } else if (base.custom_styles && Object.keys(base.custom_styles).length > 0) {
    resolvedStyles = base.custom_styles;
  } else if (base.data?._custom_styles && Object.keys(base.data._custom_styles).length > 0) {
    resolvedStyles = base.data._custom_styles;
  }

  // Extract resume data
  let resolvedData = base.data || {};
  if (localCached && localCached.data) {
    resolvedData = localCached.data;
  }

  return {
    data: {
      id: base.id || portfolioId,
      user_id: base.user_id,
      title: base.title,
      theme: base.theme || 'dark',
      template_id: base.template_id || 'minimal',
      custom_styles: resolvedStyles,
      data: resolvedData,
      created_at: base.created_at,
      owner: base.username || username,
    },
  };
}

/**
 * Update portfolio custom styles
 */
export async function updatePortfolioStyles(portfolioId, customStyles) {
  return updatePortfolioStylesAndData(portfolioId, customStyles, undefined);
}

/**
 * Update portfolio custom styles and/or resume JSON data
 */
export async function updatePortfolioStylesAndData(portfolioId, customStyles, resumeData) {
  if (!portfolioId) return null;

  // 1. Instant local persistence caching
  try {
    const cachedStr = localStorage.getItem(`auoraa_portfolio_${portfolioId}`);
    const cached = cachedStr ? JSON.parse(cachedStr) : {};
    if (customStyles !== undefined) cached.custom_styles = customStyles;
    if (resumeData !== undefined) cached.data = resumeData;
    localStorage.setItem(`auoraa_portfolio_${portfolioId}`, JSON.stringify(cached));
  } catch (e) {
    console.warn('LocalStorage save notice:', e);
  }

  // 2. Prepare merged data with embedded _custom_styles fallback
  let payloadData = resumeData;
  if (customStyles !== undefined) {
    payloadData = {
      ...(resumeData || {}),
      _custom_styles: customStyles,
    };
  }

  // 3. Persistent Supabase cloud update
  const payload = {
    updated_at: new Date().toISOString(),
  };
  if (customStyles !== undefined) {
    payload.custom_styles = customStyles;
  }
  if (payloadData !== undefined) {
    payload.data = payloadData;
  }

  try {
    const { data, error } = await supabase
      .from('portfolios')
      .update(payload)
      .eq('id', portfolioId);

    if (error) {
      console.warn('Supabase update with custom_styles column notice:', error.message);
      // Fallback: If custom_styles column is missing in Supabase, update data JSON only
      if (payloadData !== undefined) {
        await supabase
          .from('portfolios')
          .update({
            data: payloadData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', portfolioId);
      }
    }
    return data;
  } catch (err) {
    console.warn('Supabase update exception:', err.message);
  }
  return null;
}

/**
 * Update portfolio template ID
 */
export async function updatePortfolioTemplate(portfolioId, templateId) {
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      template_id: templateId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', portfolioId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update template: ${error.message}`);
  }

  return data;
}

