<template>
  <div class="bg-gray-50000 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">
                  {{ $t('dashboard.title') }}
                </h1>
                <p class="mt-2 text-sm text-gray-700">
                  {{ $t('dashboard.welcome') }},
                  {{ user?.user_metadata?.full_name || user?.email }}!
                </p>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-8">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="overflow-hidden rounded-lg bg-white shadow">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <UIcon name="i-heroicons-users" class="h-6 w-6 text-gray-400" />
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="truncate text-sm font-medium text-gray-500">Team Members</dt>
                          <dd class="text-lg font-medium text-gray-900">
                            {{ stats.teamMembers }}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-lg bg-white shadow">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <UIcon name="i-heroicons-credit-card" class="h-6 w-6 text-gray-400" />
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="truncate text-sm font-medium text-gray-500">Subscription</dt>
                          <dd class="text-lg font-medium text-gray-900">
                            {{ subscription?.status || 'None' }}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Quick Actions</h2>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <UIcon name="i-heroicons-users" class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-gray-900">Manage Teams</h3>
                      <p class="text-sm text-gray-500">Create and manage your teams</p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <UButton size="sm" @click="$router.push('/teams')"> View Teams </UButton>
                  </div>
                </div>
                <div class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <UIcon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-gray-900">Account Settings</h3>
                      <p class="text-sm text-gray-500">Manage your account and billing</p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <UButton size="sm" @click="$router.push('/settings')"> Settings </UButton>
                  </div>
                </div>
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

const stats = ref({
  teamMembers: 0,
})

const subscription = ref(null)

onMounted(async () => {
  // Fetch user stats
  if (user.value) {
    // Get subscription
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.value.id)
      .single()

    subscription.value = subscriptionData

    // Get team members count
    const { count: teamMembersCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.value.id)

    stats.value.teamMembers = teamMembersCount || 0
  }
})
</script>
