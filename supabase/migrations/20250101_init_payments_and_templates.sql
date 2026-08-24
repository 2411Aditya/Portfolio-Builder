-- ═══════════════════════════════════════════════════════════════════════════════
-- PORTFOLIO BUILDER: SUPABASE DATABASE MIGRATION SCRIPT
-- Adds Plan Tiers, Razorpay Integration, Orders Table, and Template Custom Styles
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Create or Update `profiles` table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE,
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'lite', 'pro')),
    subscription_status TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active')),
    razorpay_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure columns exist if `profiles` table already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='plan_tier') THEN
        ALTER TABLE public.profiles ADD COLUMN plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'lite', 'pro'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='subscription_status') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='razorpay_customer_id') THEN
        ALTER TABLE public.profiles ADD COLUMN razorpay_customer_id TEXT;
    END IF;
END $$;

-- 2. Update `portfolios` table with `template_id` and `custom_styles`
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    theme TEXT NOT NULL DEFAULT 'dark',
    template_id TEXT NOT NULL DEFAULT 'minimal',
    custom_styles JSONB NOT NULL DEFAULT '{}'::jsonb,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='portfolios' AND column_name='template_id') THEN
        ALTER TABLE public.portfolios ADD COLUMN template_id TEXT NOT NULL DEFAULT 'minimal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='portfolios' AND column_name='custom_styles') THEN
        ALTER TABLE public.portfolios ADD COLUMN custom_styles JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 3. Create `orders` table for Razorpay tracking
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('lite', 'pro')),
    amount INTEGER NOT NULL, -- In paise (e.g. 9900 = ₹99, 29900 = ₹299)
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ─── Profiles Policies ───
DROP POLICY IF EXISTS "Public profiles can be viewed by anyone" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by anyone" 
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── Portfolios Policies ───
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON public.portfolios;
CREATE POLICY "Public portfolios are viewable by everyone" 
    ON public.portfolios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own portfolios" ON public.portfolios;
CREATE POLICY "Users can manage their own portfolios" 
    ON public.portfolios FOR ALL USING (auth.uid() = user_id);

-- ─── Orders Policies ───
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
    ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders" 
    ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Trigger for automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, plan_tier, subscription_status)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        'free',
        'inactive'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        username = COALESCE(EXCLUDED.username, profiles.username);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER set_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
