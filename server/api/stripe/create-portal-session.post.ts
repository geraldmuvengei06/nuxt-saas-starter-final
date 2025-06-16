export default defineEventHandler(async event => {
  try {
    // Check authentication
    const user = await getServerSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Get customer from Supabase
    const supabase = await getServerSupabaseServiceRole(event)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('profile_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No subscription found',
      })
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${getHeader(event, 'origin')}/billing`,
    })

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe portal session creation error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create portal session',
    })
  }
})
