import Stripe from 'stripe'

const config = useRuntimeConfig()

export const stripe = new Stripe(config.stripeSecretKey!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})
