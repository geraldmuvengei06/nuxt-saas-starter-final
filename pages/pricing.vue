<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="sm:align-center sm:flex sm:flex-col">
        <h1 class="text-5xl font-extrabold text-gray-900 sm:text-center">Pricing Plans</h1>
        <p class="mt-5 text-xl text-gray-500 sm:text-center">
          Start building for free, then add a site plan to go live. Account plans unlock additional
          features.
        </p>
        <div class="relative mt-6 flex self-center rounded-lg bg-gray-100 p-0.5 sm:mt-8">
          <button
            type="button"
            class="focus:ring-primary-500 relative w-1/2 whitespace-nowrap rounded-md border-gray-200 bg-white py-2 text-sm font-medium text-gray-900 shadow-sm focus:z-10 focus:outline-none focus:ring-2 sm:w-auto sm:px-8"
            :class="{ 'bg-primary/5 border-primary/20 text-primary': !isYearly }"
            @click="isYearly = false"
          >
            Monthly billing
          </button>
          <button
            type="button"
            class="focus:ring-primary-500 relative ml-0.5 w-1/2 whitespace-nowrap rounded-md border border-transparent py-2 text-sm font-medium text-gray-700 focus:z-10 focus:outline-none focus:ring-2 sm:w-auto sm:px-8"
            :class="{ 'bg-primary/5 border-primary/20 text-primary': isYearly }"
            @click="isYearly = true"
          >
            Yearly billing
          </button>
        </div>
      </div>
      <div
        class="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm"
          :class="{ 'border-primary-200 shadow-primary-100': plan.featured }"
        >
          <div class="p-6">
            <h2 class="text-lg font-medium leading-6 text-gray-900">
              {{ plan.name }}
            </h2>
            <p class="mt-4 text-sm text-gray-500">
              {{ plan.description }}
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">
                ${{ isYearly ? plan.yearlyPrice : plan.monthlyPrice }}
              </span>
              <span class="text-base font-medium text-gray-500">
                /{{ isYearly ? 'year' : 'month' }}
              </span>
            </p>
            <UButton
              :variant="plan.featured ? 'solid' : 'outline'"
              class="mt-8 w-full"
              :disabled="loading"
              @click="selectPlan(plan)"
            >
              {{ plan.cta }}
            </UButton>
          </div>
          <div class="px-6 pb-8 pt-6">
            <h3 class="text-xs font-medium uppercase tracking-wide text-gray-900">
              What's included
            </h3>
            <ul role="list" class="mt-6 space-y-4">
              <li v-for="feature in plan.features" :key="feature" class="flex space-x-3">
                <UIcon name="i-heroicons-check" class="h-5 w-5 flex-shrink-0 text-green-500" />
                <span class="text-sm text-gray-500">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const user = useSupabaseUser()
const router = useRouter()
const toast = useToast()

const isYearly = ref(false)
const loading = ref(false)

const plans = ref([
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    featured: false,
    cta: 'Get started',
    features: ['1 project', 'Basic features', 'Community support', '1GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for growing businesses',
    monthlyPrice: 29,
    yearlyPrice: 290,
    featured: true,
    cta: 'Start free trial',
    priceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly',
    },
    features: [
      'Unlimited projects',
      'Advanced features',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'Advanced analytics',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthlyPrice: 99,
    yearlyPrice: 990,
    featured: false,
    cta: 'Contact sales',
    priceId: {
      monthly: 'price_enterprise_monthly',
      yearly: 'price_enterprise_yearly',
    },
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Unlimited storage',
      'SSO',
      'Advanced security',
      'Custom contracts',
    ],
  },
])

const selectPlan = async (plan: any) => {
  if (plan.id === 'free') {
    if (!user.value) {
      await router.push('/register')
    } else {
      await router.push('/dashboard')
    }
    return
  }

  if (plan.id === 'enterprise') {
    window.open('mailto:sales@example.com?subject=Enterprise Plan Inquiry')
    return
  }

  if (!user.value) {
    await router.push('/register')
    return
  }

  try {
    loading.value = true

    const priceId = isYearly.value ? plan.priceId.yearly : plan.priceId.monthly

    const { data } = await $fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        priceId,
      },
    })

    if (data?.url) {
      window.location.href = data.url
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to create checkout session',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
