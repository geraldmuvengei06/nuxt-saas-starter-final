import type Stripe from 'stripe'

export interface StripePrice {
  id: string
  object: 'price'
  active: boolean
  billing_scheme: string
  created: number
  currency: string
  livemode: boolean
  lookup_key: string | null
  metadata: Record<string, string>
  nickname: string | null
  product: string | Stripe.Product
  recurring: {
    aggregate_usage: string | null
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
    trial_period_days: number | null
    usage_type: 'licensed' | 'metered'
  } | null
  tax_behavior: string | null
  tiers_mode: string | null
  transform_quantity: any | null
  type: 'one_time' | 'recurring'
  unit_amount: number | null
  unit_amount_decimal: string | null
}

export interface StripeProduct {
  id: string
  object: 'product'
  active: boolean
  created: number
  default_price: string | StripePrice | null
  description: string | null
  images: string[]
  livemode: boolean
  metadata: Record<string, string>
  name: string
  package_dimensions: any | null
  shippable: boolean | null
  statement_descriptor: string | null
  tax_code: string | null
  unit_label: string | null
  updated: number
  url: string | null
}

export interface StripeCustomer {
  id: string
  object: 'customer'
  address: any | null
  balance: number
  created: number
  currency: string | null
  default_source: string | null
  delinquent: boolean
  description: string | null
  discount: any | null
  email: string | null
  invoice_prefix: string
  invoice_settings: any
  livemode: boolean
  metadata: Record<string, string>
  name: string | null
  next_invoice_sequence: number
  phone: string | null
  preferred_locales: string[]
  shipping: any | null
  tax_exempt: string | null
  test_clock: string | null
}

export interface StripeSubscription {
  id: string
  object: 'subscription'
  application: string | null
  application_fee_percent: number | null
  automatic_tax: any
  billing_cycle_anchor: number
  billing_thresholds: any | null
  cancel_at: number | null
  cancel_at_period_end: boolean
  canceled_at: number | null
  collection_method: 'charge_automatically' | 'send_invoice'
  created: number
  currency: string
  current_period_end: number
  current_period_start: number
  customer: string | StripeCustomer
  days_until_due: number | null
  default_payment_method: string | null
  default_source: string | null
  default_tax_rates: any[]
  description: string | null
  discount: any | null
  ended_at: number | null
  items: {
    object: 'list'
    data: any[]
    has_more: boolean
    total_count: number
    url: string
  }
  latest_invoice: string | null
  livemode: boolean
  metadata: Record<string, string>
  next_pending_invoice_item_invoice: number | null
  pause_collection: any | null
  payment_settings: any
  pending_invoice_item_interval: any | null
  pending_setup_intent: string | null
  pending_update: any | null
  schedule: string | null
  start_date: number
  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'paused'
  test_clock: string | null
  transfer_data: any | null
  trial_end: number | null
  trial_start: number | null
}
