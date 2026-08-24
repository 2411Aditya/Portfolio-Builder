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

  const portfolios = (data || []).map((p) => ({
    ...p,
    template_id: p.template_id || 'minimal',
    custom_styles: p.custom_styles || {},
    public_url: `/p/${p.username}/${p.id}`,
  }));

  return { data: { portfolios } };
}

/**
 * Delete a portfolio from Supabase
 */
export async function deletePortfolio(id) {
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
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', portfolioId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Portfolio not found.');
  }

  return {
    data: {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      theme: data.theme || 'dark',
      template_id: data.template_id || 'minimal',
      custom_styles: data.custom_styles || {},
      data: data.data,
      created_at: data.created_at,
      owner: data.username,
    },
  };
}

/**
 * Update portfolio custom styles
 */
export async function updatePortfolioStyles(portfolioId, customStyles) {
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      custom_styles: customStyles,
      updated_at: new Date().toISOString(),
    })
    .eq('id', portfolioId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update custom styles: ${error.message}`);
  }

  return data;
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
