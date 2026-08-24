import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

async function verifyHmacSha256(secret: string, body: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const hexSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hexSignature.toLowerCase() === signature.toLowerCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    const bodyText = await req.text();

    if (webhookSecret && signature) {
      const isValid = await verifyHmacSha256(webhookSecret, bodyText, signature);
      if (!isValid) {
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
