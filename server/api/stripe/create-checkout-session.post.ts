import { z } from 'zod'

const createCheckoutSessionSchema = z.object({
  priceId: z.string(),
  customerId: z.string().optional(),
})

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

    const body = await readBody(event)
    const { priceId, customerId } = createCheckoutSessionSchema.parse(body)

    // Create or get customer
    let customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId)
    } else {
      customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          userId: user.id,
        },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${getHeader(event, 'origin')}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getHeader(event, 'origin')}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe checkout session creation error:', error)

    if (error.data?.issues) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request data',
        data: error.data.issues,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create checkout session',
    })
  }
})
