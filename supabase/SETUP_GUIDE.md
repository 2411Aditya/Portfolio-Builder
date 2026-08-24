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
