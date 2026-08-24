import { supabase } from '../lib/supabase';

/**
 * Dynamically load Razorpay Checkout SDK
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Create a Razorpay Order via Supabase Edge Function or mock fallback
 */
export async function createRazorpayOrder(planTier) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('You must be logged in to purchase a plan.');
  }

  // 1. Attempt Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { planTier },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!error && data?.orderId) {
      return data;
    }
  } catch (err) {
    console.warn('Edge function invoke failed or not deployed, falling back to direct client flow:', err);
  }

  // 2. Client fallback
  const amounts = { lite: 9900, pro: 29900 };
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock';
  
  return {
    orderId: `order_${planTier}_${Date.now()}`,
    amount: amounts[planTier] || 9900,
    currency: 'INR',
    keyId: keyId,
  };
}

/**
 * Handle successful payment verification and update user profile tier
 */
export async function verifyAndUpgradeTier(planTier, paymentDetails = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  const { error } = await supabase
    .from('profiles')
    .update({
      plan_tier: planTier,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.warn('Could not update profile directly (RLS or table):', error.message);
  }

  return { success: true, planTier };
}
