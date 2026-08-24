import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    const bodyText = await req.text();

    if (webhookSecret && signature) {
      const generatedSignature = hmac('sha256', webhookSecret, bodyText, 'utf8', 'hex');
      if (generatedSignature !== signature) {
        return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (event === 'order.paid' || event === 'payment.captured') {
      const orderEntity = payload.payload?.order?.entity || {};
      const paymentEntity = payload.payload?.payment?.entity || {};

      const razorpayOrderId = orderEntity.id || paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;
      const userId = orderEntity.notes?.userId || paymentEntity.notes?.userId;
      const planTier = orderEntity.notes?.planTier || paymentEntity.notes?.planTier;

      if (razorpayOrderId) {
        // Update Order record
        await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            razorpay_payment_id: razorpayPaymentId,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', razorpayOrderId);
      }

      if (userId && planTier) {
        // Update User Profile with new plan tier
        await supabaseAdmin
          .from('profiles')
          .update({
            plan_tier: planTier,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
