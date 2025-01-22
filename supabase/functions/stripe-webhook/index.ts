import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    console.error('No signature provided')
    return new Response('No signature provided', { 
      status: 400,
      headers: corsHeaders 
    })
  }

  try {
    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    )
    
    console.log('Processing webhook event:', event.type)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Processing checkout session:', session.id)
        
        // Get user ID from metadata (more reliable than client_reference_id)
        const userId = session.metadata?.supabase_user_id
        if (!userId) {
          throw new Error('No user ID found in session metadata')
        }

        console.log('User ID from session:', userId)
        
        let tier = 'free'
        if (session.metadata?.price_id === 'price_1Qf3YWF2YoGQdvcW69wTFx7i') {
          tier = 'starter'
        } else if (session.metadata?.price_id === 'price_1Qf3aLF2YoGQdvcWiKMuplKL') {
          tier = 'pro'
        } else if (session.metadata?.price_id === 'price_1Qf3bQF2YoGQdvcWx23MIde4') {
          tier = 'enterprise'
        }

        console.log('Updating to tier:', tier, 'for user:', userId)

        const { error: userError } = await supabase
          .from('users')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active',
            price_id: session.metadata?.price_id,
            metadata: session.metadata || {},
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            subscription_tier: tier
          })
          .eq('id', userId)

        if (userError) {
          console.error('User update failed:', userError)
          throw userError
        }

        console.log('Successfully updated subscription')
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('Processing subscription update:', subscription.id)

        // Get customer details to find user
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const userId = customer.metadata?.supabase_user_id

        if (!userId) {
          console.error('No user ID found in customer metadata')
          throw new Error('User not found')
        }

        const priceId = subscription.items.data[0]?.price.id

        let tier = 'free'
        if (priceId === 'price_1Qf3YWF2YoGQdvcW69wTFx7i') {
          tier = 'starter'
        } else if (priceId === 'price_1Qf3aLF2YoGQdvcWiKMuplKL') {
          tier = 'pro'
        } else if (priceId === 'price_1Qf3bQF2YoGQdvcWx23MIde4') {
          tier = 'enterprise'
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({
            status: subscription.status,
            metadata: subscription.metadata || {},
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            subscription_tier: tier
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Error updating user:', updateError)
          throw updateError
        }

        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          const { error: tierError } = await supabase
            .from('users')
            .update({ subscription_tier: 'free' })
            .eq('id', userId)

          if (tierError) {
            console.error('Error updating tier:', tierError)
            throw tierError
          }
        }

        console.log('Successfully updated subscription status')
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Webhook processing failed:', err)
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})