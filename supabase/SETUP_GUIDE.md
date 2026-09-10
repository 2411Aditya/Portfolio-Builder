# Supabase & Razorpay Configuration Guide

This guide covers all manual setup steps required to connect your Supabase database, deploy Edge Functions, configure Razorpay webhooks, and set up your environment variables.

---

## 1. Supabase Database Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and navigate to the **SQL Editor** tab.
3. Open `supabase/migrations/20250101_init_payments_and_templates.sql` from this codebase.
4. Copy and paste the entire script into the SQL Editor and click **Run**.
5. This will:
   - Create/alter `profiles` with `plan_tier` (`free`, `lite`, `pro`), `subscription_status`, and `razorpay_customer_id`.
   - Update `portfolios` with `template_id` (default `'minimal'`) and `custom_styles` (JSONB).
   - Create the `orders` table with RLS.
   - Attach automatic user profile provisioning triggers on signup.

---

## 2. Razorpay Dashboard Configuration

1. Log into the [Razorpay Dashboard](https://dashboard.razorpay.com/) (Test mode for development or Live for production).
2. Go to **Settings** > **API Keys** and generate a new **Key ID** and **Key Secret**.
3. Go to **Settings** > **Webhooks** > **Add New Webhook**:
   - **Webhook URL:** `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/functions/v1/razorpay-webhook`
   - **Secret:** Generate a secure random string (e.g. `rzp_whsec_xyz123`) and save it.
   - **Active Events:** Select:
     - `order.paid`
     - `payment.captured`
     - `payment.failed`

---

## 3. Supabase Secrets & Edge Functions Deployment

### Set Secrets in Supabase CLI or Dashboard:
In **Project Settings** > **Edge Functions** > **Secrets** (or via Supabase CLI `supabase secrets set ...`):
```bash
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
GEMINI_API_KEY="AIzaSy..."
```

### Deploy Functions:
```bash
supabase functions deploy create-razorpay-order --no-verify-jwt
supabase functions deploy razorpay-webhook --no-verify-jwt
supabase functions deploy ai-customize-portfolio --no-verify-jwt
```

---

## 4. Frontend Environment Variables

Ensure your `frontend/.env` contains:
```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 5. Google Sign-In / OAuth Setup (100% Free on Supabase)

Supabase includes OAuth authentication for Google on its **Free Plan** with up to 50,000 monthly active users.

### Step 1: Create OAuth Credentials in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `Auoraa Portfolio Builder`) or select an existing one.
3. In the left navigation, go to **APIs & Services** > **OAuth consent screen**:
   - User Type: **External** -> Click **Create**.
   - Fill in **App Name** (`auoraa`), **User support email**, and **Developer contact email**.
   - Click **Save and Continue** through the scopes and test users steps.
   - Under **Publishing status**, click **Publish App** (or add your test Google account if in testing mode).
4. Go to **APIs & Services** > **Credentials** > **+ Create Credentials** > **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `Auoraa Web App`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for local dev)
     - `https://your-production-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
   - Click **Create**.
5. Copy your **Client ID** and **Client Secret**.

### Step 2: Enable Google Provider in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** > **Providers** > click **Google**.
3. Toggle **Enable Sign in with Google** to ON.
4. Paste your **Client ID** and **Client Secret** copied from Google Cloud Console.
5. Click **Save**.

### Step 3: Configure URL Redirects in Supabase
1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to `http://localhost:5173` (or your production URL).
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/**`
   - `https://your-production-domain.com/**`
4. Click **Save**.

