-- ═══════════════════════════════════════════════════════════════════════════════
-- SUPABASE MIGRATION: 1-Month Subscription Expiry & Auto-Downgrade
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<YOUR_PROJECT_ID>/sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Add subscription timestamp columns to `profiles` table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'subscribed_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN subscribed_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'subscription_expires_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_expires_at TIMESTAMPTZ;
    END IF;
END $$;

-- 2. SQL Function to automatically downgrade expired subscriptions
-- Can be called via client RPC or scheduled via pg_cron
CREATE OR REPLACE FUNCTION public.check_and_downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET plan_tier = 'free',
        subscription_status = 'inactive',
        updated_at = timezone('utc'::text, now())
    WHERE subscription_status = 'active'
      AND subscription_expires_at IS NOT NULL
      AND subscription_expires_at < timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
