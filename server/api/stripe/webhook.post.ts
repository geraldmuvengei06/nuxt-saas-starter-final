export default defineEventHandler(async event => {
  const config = useRuntimeConfig()

  try {
    const body = await readRawBody(event, 'utf8')
    const signature = getHeader(event, 'stripe-signature')

    if (!signature || !body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing signature or body',
      })
    }

    // Verify webhook signature
    const webhookEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret!
    )

    const supabase = await getServerSupabaseServiceRole(event)

    switch (webhookEvent.type) {
      case 'checkout.session.completed': {
        const session = webhookEvent.data.object as any

        // Get customer and subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription)

        // Update or create subscription record
        await supabase.from('subscriptions').upsert({
          profile_id: session.metadata.userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          stripe_price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })

        console.log('Subscription created:', session.subscription)
        break
      }

      case 'invoice.paid': {
        const invoice = webhookEvent.data.object as any

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)

          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }

        console.log('Invoice paid:', invoice.id)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = webhookEvent.data.object as any

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('Subscription updated:', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = webhookEvent.data.object as any

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('Subscription canceled:', subscription.id)
        break
      }

      default:
        console.log('Unhandled webhook event type:', webhookEvent.type)
    }

    return { received: true }
  } catch (error: any) {
    console.error('Webhook error:', error)

    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Webhook processing failed',
    })
  }
})
