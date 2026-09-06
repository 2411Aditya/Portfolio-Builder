import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ plan_tier: 'free', subscription_status: 'inactive' });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId, email, username) => {
    if (!userId) {
      setProfile({ plan_tier: 'free', subscription_status: 'inactive' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        // Automatic 1-month subscription expiry verification
        if (data.subscription_status === 'active' && data.subscription_expires_at) {
          const isExpired = new Date(data.subscription_expires_at) < new Date();
          if (isExpired) {
            // Downgrade locally to free tier
            const downgraded = {
              ...data,
              plan_tier: 'free',
              subscription_status: 'inactive',
            };
            setProfile(downgraded);

            // Persist downgrade to Supabase
            try {
              await supabase
                .from('profiles')
                .update({
                  plan_tier: 'free',
                  subscription_status: 'inactive',
                  updated_at: new Date().toISOString(),
                })
                .eq('id', userId);
            } catch (updateErr) {
              console.warn('Could not persist profile downgrade to Supabase:', updateErr);
            }
            return;
          }
        }
        setProfile(data);
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, create default free starter profile
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: email,
              username: username,
              plan_tier: 'free',
              subscription_status: 'inactive',
            },
          ])
          .select()
          .single();

        if (newProfile) setProfile(newProfile);
      }
    } catch (err) {
      console.warn('Profile fetch error, defaulting to free tier:', err);
      setProfile({ plan_tier: 'free', subscription_status: 'inactive' });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email, user.username);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
        };
        setUser(u);
        fetchProfile(u.id, u.email, u.username);
      } else {
        setUser(null);
        setProfile({ plan_tier: 'free', subscription_status: 'inactive' });
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
        };
        setUser(u);
        fetchProfile(u.id, u.email, u.username);
      } else {
        setUser(null);
        setProfile({ plan_tier: 'free', subscription_status: 'inactive' });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const register = async ({ email, password, username }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) throw error;
    return data;
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile({ plan_tier: 'free', subscription_status: 'inactive' });
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, register, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
