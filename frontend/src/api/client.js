import { supabase } from '../lib/supabase';
import { parseResumeWithAI } from '../utils/aiParser';

/**
 * Generate and store portfolio in Supabase
 */
export async function generatePortfolio({ file, theme }) {
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
 * Get public portfolio by ID
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
      title: data.title,
      theme: data.theme,
      data: data.data,
      created_at: data.created_at,
      owner: data.username,
    },
  };
}
