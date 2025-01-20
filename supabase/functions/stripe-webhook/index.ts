import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    console.error('No signature provided')
    return new Response('No signature provided', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    
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
        console.log('Checkout session completed:', session.id)
        
        // Map price IDs to subscription tiers
        let tier = 'free'
        if (session.metadata?.price_id === 'price_1Qf3YWF2YoGQdvcW69wTFx7i') {
          tier = 'starter'
        } else if (session.metadata?.price_id === 'price_1Qf3aLF2YoGQdvcWiKMuplKL') {
          tier = 'pro'
        } else if (session.metadata?.price_id === 'price_1Qf3bQF2YoGQdvcWx23MIde4') {
          tier = 'enterprise'
        }

        console.log('Updating subscription tier to:', tier)

        // Update subscription record
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.client_reference_id,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active',
            price_id: session.metadata?.price_id,
          })

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError)
          throw subscriptionError
        }

        // Update user's subscription tier
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', session.client_reference_id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
          throw profileError
        }

        console.log('Successfully updated subscription and profile')
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Subscription changed:', subscription.id)

        const { data: subscriptionData, error: fetchError } = await supabase
          .from('subscriptions')
          .select('id, user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (fetchError) {
          console.error('Error fetching subscription:', fetchError)
          throw fetchError
        }

        if (subscriptionData) {
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', subscriptionData.id)

          if (updateError) {
            console.error('Error updating subscription:', updateError)
            throw updateError
          }

          if (subscription.status === 'canceled' || event.type === 'customer.subscription.deleted') {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ subscription_tier: 'free' })
              .eq('id', subscriptionData.user_id)

            if (profileError) {
              console.error('Error updating profile:', profileError)
              throw profileError
            }
          }
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})