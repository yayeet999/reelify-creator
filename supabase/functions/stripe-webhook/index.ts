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
        
        let tier = 'free'
        if (session.metadata?.price_id === 'price_1Qf3YWF2YoGQdvcW69wTFx7i') {
          tier = 'starter'
        } else if (session.metadata?.price_id === 'price_1Qf3aLF2YoGQdvcWiKMuplKL') {
          tier = 'pro'
        } else if (session.metadata?.price_id === 'price_1Qf3bQF2YoGQdvcWx23MIde4') {
          tier = 'enterprise'
        }

        console.log('Updating to tier:', tier, 'for user:', session.client_reference_id)

        // Update subscription record with metadata
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.client_reference_id,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active',
            price_id: session.metadata?.price_id,
            metadata: session.metadata || {},
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })

        if (subscriptionError) {
          console.error('Subscription update failed:', subscriptionError)
          throw subscriptionError
        }

        // Update user's subscription tier
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', session.client_reference_id)

        if (profileError) {
          console.error('Profile update failed:', profileError)
          throw profileError
        }

        console.log('Successfully updated subscription and profile')
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('Processing subscription update:', subscription.id)

        // First, try to find the customer's user_id through the subscriptions table
        const { data: existingSubscription, error: fetchError } = await supabase
          .from('subscriptions')
          .select('id, user_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching subscription:', fetchError)
          throw fetchError
        }

        if (!existingSubscription) {
          console.log('No existing subscription found, creating new record')
          
          const priceId = subscription.items.data[0]?.price.id

          let tier = 'free'
          if (priceId === 'price_1Qf3YWF2YoGQdvcW69wTFx7i') {
            tier = 'starter'
          } else if (priceId === 'price_1Qf3aLF2YoGQdvcWiKMuplKL') {
            tier = 'pro'
          } else if (priceId === 'price_1Qf3bQF2YoGQdvcWx23MIde4') {
            tier = 'enterprise'
          }

          // Find user by customer ID in subscriptions table
          const { data: customerSubscription } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer)
            .maybeSingle()

          if (!customerSubscription?.user_id) {
            console.error('Could not find user for customer:', subscription.customer)
            throw new Error('User not found')
          }

          // Create new subscription record with metadata
          const { error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: customerSubscription.user_id,
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              price_id: priceId,
              metadata: subscription.metadata || {},
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })

          if (createError) {
            console.error('Error creating subscription:', createError)
            throw createError
          }

          // Update user's subscription tier
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ subscription_tier: tier })
            .eq('id', customerSubscription.user_id)

          if (profileError) {
            console.error('Error updating profile:', profileError)
            throw profileError
          }

          console.log('Successfully created subscription and updated profile')
        } else {
          // Update existing subscription with metadata
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              metadata: subscription.metadata || {},
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', existingSubscription.id)

          if (updateError) {
            console.error('Error updating subscription:', updateError)
            throw updateError
          }

          // If subscription is canceled or deleted, revert to free tier
          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ subscription_tier: 'free' })
              .eq('id', existingSubscription.user_id)

            if (profileError) {
              console.error('Error updating profile:', profileError)
              throw profileError
            }
          }

          console.log('Successfully updated existing subscription')
        }
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