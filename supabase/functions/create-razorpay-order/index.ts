import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_PRICES: Record<string, number> = {
  lite: 9900, // ₹99 in paise
  pro: 29900, // ₹299 in paise
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { planTier } = body;

    if (!planTier || !PLAN_PRICES[planTier]) {
      return new Response(JSON.stringify({ error: 'Invalid plan tier selected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amount = PLAN_PRICES[planTier];
    const currency = 'INR';

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      // In dev sandbox when test keys are missing, return mock order for seamless local testing
      const mockOrderId = `order_mock_${Date.now()}`;
      return new Response(
        JSON.stringify({
          orderId: mockOrderId,
          amount,
          currency,
          keyId: 'rzp_test_mock_key',
          isMock: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Razorpay Orders API
    const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const receipt = `rcpt_${user.id.substring(0, 8)}_${Date.now()}`;

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
        notes: {
          userId: user.id,
          planTier,
        },
      }),
    });

    if (!rzpResponse.ok) {
      const err = await rzpResponse.json();
      return new Response(JSON.stringify({ error: err.error?.description || 'Failed to create order with Razorpay' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rzpOrder = await rzpResponse.json();

    // Record order in Supabase `orders` table using service role client for security
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    await supabaseAdmin.from('orders').insert([
      {
        user_id: user.id,
        razorpay_order_id: rzpOrder.id,
        plan_tier: planTier,
        amount: amount,
        currency: currency,
        status: 'created',
      },
    ]);

    return new Response(
      JSON.stringify({
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
