<template>
  <div class="py-16">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        Choose the plan that best fits your needs. All plans include a 14-day free trial.
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-4">
      <!-- PricingCards have been renamed to PricingPlans -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UCard
          v-for="(plan, index) in plans"
          :key="index"
          :ui="{
            body: 'h-full flex flex-col',
            header: 'pb-0',
            footer: 'mt-auto pt-6',
          }"
          :class="[
            plan.popular
              ? 'ring-2 ring-primary-500'
              : 'ring-1 ring-neutral-200 dark:ring-neutral-800',
            'relative',
          ]"
        >
          <template #header>
            <div v-if="plan.popular" class="absolute -top-4 left-0 right-0 flex justify-center">
              <UBadge color="primary" variant="soft" class="font-medium"> Most Popular </UBadge>
            </div>
            <div class="pt-4">
              <h3 class="text-lg font-semibold">
                {{ plan.name }}
              </h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold">{{ plan.price }}</span>
                <span class="text-neutral-600 dark:text-neutral-400 ml-1">{{ plan.interval }}</span>
              </div>
              <p class="mt-2 text-neutral-600 dark:text-neutral-400">
                {{ plan.description }}
              </p>
            </div>
          </template>

          <div class="mt-6 space-y-3">
            <div
              v-for="(feature, featureIndex) in plan.features"
              :key="featureIndex"
              class="flex items-center"
            >
              <UIcon name="i-heroicons-check-circle" class="text-success-500 mr-2" />
              <span>{{ feature }}</span>
            </div>
          </div>

          <template #footer>
            <UButton
              block
              :color="plan.popular ? 'primary' : 'neutral'"
              :variant="plan.popular ? 'solid' : 'outline'"
            >
              {{ plan.cta }}
            </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const plans = ref([
  {
    name: 'Free',
    price: '$0',
    interval: 'forever',
    description: 'Perfect for individuals just starting out.',
    features: ['Up to 3 projects', 'Basic analytics', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    interval: '/month',
    description: 'For professionals and growing teams.',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Team collaboration',
      'Custom domains',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    interval: '',
    description: 'For large organizations with specific needs.',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'Enterprise SSO',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
])
</script>
