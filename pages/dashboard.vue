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
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div class="overflow-hidden rounded-lg bg-white shadow">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <UIcon name="i-heroicons-folder" class="h-6 w-6 text-gray-400" />
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="truncate text-sm font-medium text-gray-500">Total Projects</dt>
                          <dd class="text-lg font-medium text-gray-900">
                            {{ stats.projects }}
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

            <!-- Recent Projects -->
            <div class="mt-8">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Recent Projects</h2>
              <div v-if="projects.length === 0" class="py-12 text-center">
                <UIcon name="i-heroicons-folder-plus" class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div class="mt-6">
                  <UButton @click="$router.push('/projects/new')">
                    <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
                    New Project
                  </UButton>
                </div>
              </div>
              <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  v-for="project in projects"
                  :key="project.id"
                  class="focus-within:ring-primary-500 relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div class="min-w-0 flex-1">
                    <NuxtLink :to="`/projects/${project.id}`" class="focus:outline-none">
                      <span class="absolute inset-0" aria-hidden="true" />
                      <p class="text-sm font-medium text-gray-900">
                        {{ project.name }}
                      </p>
                      <p class="truncate text-sm text-gray-500">
                        {{ project.description || 'No description' }}
                      </p>
                    </NuxtLink>
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
  projects: 0,
  teamMembers: 0,
})

const subscription = ref(null)
const projects = ref([])

onMounted(async () => {
  // Fetch user stats
  if (user.value) {
    // Get projects count
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.value.id)

    stats.value.projects = projectsCount || 0

    // Get recent projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(4)

    projects.value = projectsData || []

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
