<template>
  <div class="bg-gray-50000 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Billing & Subscription</h1>
                <p class="mt-2 text-sm text-gray-700">
                  Manage your subscription and billing information.
                </p>
              </div>
            </div>

            <!-- Current Subscription -->
            <div class="mt-8">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Current Plan</h2>

              <div
                v-if="!subscription"
                class="rounded-md border border-yellow-200 bg-yellow-50 p-4"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="h-5 w-5 text-yellow-400"
                    />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">No Active Subscription</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>You're currently on the free plan. Upgrade to unlock more features.</p>
                    </div>
                    <div class="mt-4">
                      <div class="-mx-2 -my-1.5 flex">
                        <UButton variant="outline" color="yellow" @click="$router.push('/pricing')">
                          View Plans
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="rounded-lg border border-gray-200 bg-white p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ getPlanName(subscription.stripe_price_id) }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      Status:
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        :class="getStatusColor(subscription.status)"
                      >
                        {{ subscription.status }}
                      </span>
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                      Current period: {{ formatDate(subscription.current_period_start) }} -
                      {{ formatDate(subscription.current_period_end) }}
                    </p>
                    <p v-if="subscription.cancel_at_period_end" class="mt-1 text-sm text-red-600">
                      Your subscription will be canceled at the end of the current period.
                    </p>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <UButton
                      :loading="billingLoading"
                      :disabled="billingLoading"
                      @click="manageBilling"
                    >
                      Manage Billing
                    </UButton>
                    <UButton variant="outline" @click="$router.push('/pricing')">
                      Change Plan
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="route.query.success" class="mt-8">
              <div class="rounded-md border border-green-200 bg-green-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Subscription Updated</h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>Your subscription has been successfully updated!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Canceled Message -->
            <div v-if="route.query.canceled" class="mt-8">
              <div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="h-5 w-5 text-yellow-400"
                    />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">Checkout Canceled</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>Your subscription update was canceled. No changes were made.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Billing History -->
            <div class="mt-8">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Billing History</h2>
              <div class="bg-gray-50000 rounded-md p-4">
                <p class="text-center text-sm text-gray-500">
                  Billing history will appear here once you have an active subscription. You can
                  manage your invoices through the billing portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()
const toast = useToast()

const subscription = ref(null)
const billingLoading = ref(false)

const manageBilling = async () => {
  try {
    billingLoading.value = true

    const { data } = await $fetch('/api/stripe/create-portal-session', {
      method: 'POST',
    })

    if (data?.url) {
      window.location.href = data.url
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to open billing portal',
      color: 'red',
    })
  } finally {
    billingLoading.value = false
  }
}

const getPlanName = (priceId: string | null) => {
  if (!priceId) return 'Free'

  if (priceId.includes('pro')) return 'Pro Plan'
  if (priceId.includes('enterprise')) return 'Enterprise Plan'
  return 'Premium Plan'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    case 'past_due':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  if (user.value) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.value.id)
      .single()

    subscription.value = data
  }
})

// Show success message from URL query
onMounted(() => {
  if (route.query.success) {
    toast.add({
      title: 'Success!',
      description: 'Your subscription has been updated successfully.',
      color: 'green',
    })
  }
})
</script>
