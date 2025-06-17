<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        System overview and management tools
      </p>
    </div>

    <!-- Stats Cards -->
    <div v-if="pending" class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <USkeleton v-for="i in 4" :key="i" class="h-24" />
    </div>

    <div v-else-if="stats" class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="i-heroicons-users" class="h-8 w-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.usersCount }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="i-heroicons-user-group" class="h-8 w-8 text-green-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Teams</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.teamsCount }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="i-heroicons-credit-card" class="h-8 w-8 text-orange-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subscriptions</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.subscriptionsCount }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
    <!-- Quick Actions -->
    <div class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <UCard
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="navigateTo('/admin/users')"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manage Users</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage user accounts</p>
          </div>
          <Icon name="i-heroicons-arrow-right" class="h-5 w-5 text-gray-400" />
        </div>
      </UCard>

      <UCard
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="navigateTo('/admin/teams')"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manage Teams</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage teams</p>
          </div>
          <Icon name="i-heroicons-arrow-right" class="h-5 w-5 text-gray-400" />
        </div>
      </UCard>

      <UCard
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="navigateTo('/admin/feedback')"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">User Feedback</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Review user feedback</p>
          </div>
          <Icon name="i-heroicons-arrow-right" class="h-5 w-5 text-gray-400" />
        </div>
      </UCard>

      <UCard
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="navigateTo('/admin/activity')"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Activity Logs</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Monitor system activity</p>
          </div>
          <Icon name="i-heroicons-arrow-right" class="h-5 w-5 text-gray-400" />
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </template>

      <div class="space-y-4">
        <div class="bg-gray-50000 flex items-center space-x-3 rounded-lg p-3 dark:bg-gray-800">
          <Icon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-500" />
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Admin Dashboard</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Welcome to the admin dashboard. Access is controlled by user roles.
            </p>
          </div>
        </div>

        <div class="bg-gray-50000 flex items-center space-x-3 rounded-lg p-3 dark:bg-gray-800">
          <Icon name="i-heroicons-shield-check" class="h-5 w-5 text-green-500" />
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Role-Based Access</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              You have admin privileges. Only users with ADMIN or SUPER_ADMIN roles can access this
              area.
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

// Check user role from API
const { data: userProfile } = await useFetch('/api/auth/profile', {
  server: false,
})

console.log('userProfile', userProfile)

// Redirect if not admin
if (!userProfile.value || !['ADMIN', 'SUPER_ADMIN'].includes((userProfile.value as any).role)) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Admin access required',
  })
}

// Fetch admin stats
const { data: stats, pending } = await useFetch('/api/admin/stats', {
  default: () => ({
    usersCount: 0,
    teamsCount: 0,
    subscriptionsCount: 0,
  }),
})
</script>
