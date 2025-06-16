<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p class="text-gray-600 dark:text-gray-400">Monitor system activity and user actions</p>
      </div>
    </div>

    <!-- Activity Logs Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Recent Activity</h3>
          <div class="flex items-center gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="Search activities..."
              icon="i-heroicons-magnifying-glass"
              class="w-64"
            />
          </div>
        </div>
      </template>

      <div v-if="pending" class="flex items-center justify-center py-8">
        <div class="border-primary-500 h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>

      <div v-else-if="error" class="py-8 text-center">
        <p class="text-red-500">Error loading activity logs: {{ error }}</p>
        <UButton variant="ghost" class="mt-2" @click="refresh()"> Try Again </UButton>
      </div>

      <div v-else>
        <UTable :rows="filteredLogs" :columns="columns" :loading="pending" class="w-full">
          <template #action-data="{ row }">
            <div class="flex items-center gap-2">
              <UBadge :color="getActionColor(row.action)" variant="soft">
                {{ formatAction(row.action) }}
              </UBadge>
            </div>
          </template>

          <template #user-data="{ row }">
            <div v-if="row.user" class="flex items-center gap-3">
              <UAvatar
                :src="row.user.avatarUrl"
                :alt="row.user.fullName || row.user.email"
                size="sm"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ row.user.fullName || row.user.email }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.user.email }}
                </p>
              </div>
            </div>
            <div v-else>
              <UBadge variant="soft" color="gray"> System </UBadge>
            </div>
          </template>

          <template #description-data="{ row }">
            <div class="max-w-md">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ row.description || 'No description' }}
              </p>
              <div v-if="row.entityType && row.entityId" class="mt-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.entityType }}: {{ row.entityId }}
                </p>
              </div>
            </div>
          </template>

          <template #metadata-data="{ row }">
            <div v-if="row.metadata" class="max-w-xs">
              <details class="text-xs">
                <summary
                  class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  View Details
                </summary>
                <pre
                  class="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >{{ JSON.stringify(row.metadata, null, 2) }}</pre
                >
              </details>
            </div>
            <span v-else class="text-xs text-gray-400">-</span>
          </template>

          <template #createdAt-data="{ row }">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ new Date(row.createdAt).toLocaleDateString() }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(row.createdAt).toLocaleTimeString() }}
              </p>
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div
          v-if="data?.pagination && data.pagination.totalPages > 1"
          class="mt-6 flex justify-center"
        >
          <UPagination
            v-model="currentPage"
            :page-count="data.pagination.totalPages"
            :total="data.pagination.totalCount"
            :per-page="data.pagination.limit"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredLogs.length === 0" class="py-8 text-center">
          <Icon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity logs</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Activity logs will appear here as actions are performed.
          </p>
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

// Check if user is admin
const { data: user } = await useSupabaseUser()
if (!user.value?.email?.includes('admin')) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access denied. Admin privileges required.',
  })
}

// Reactive state
const currentPage = ref(1)
const searchQuery = ref('')

// Fetch activity logs data
const { data, pending, error, refresh } = await useFetch('/api/admin/activity-logs', {
  query: {
    page: currentPage,
    limit: 50,
  },
  default: () => ({ logs: [], pagination: { totalPages: 1, totalCount: 0, limit: 50 } }),
})

// Computed
const filteredLogs = computed(() => {
  if (!data.value?.logs) return []

  const logs = data.value.logs
  if (!searchQuery.value) return logs

  const query = searchQuery.value.toLowerCase()
  return logs.filter(
    log =>
      log.action.toLowerCase().includes(query) ||
      log.description?.toLowerCase().includes(query) ||
      log.user?.email.toLowerCase().includes(query) ||
      log.user?.fullName?.toLowerCase().includes(query) ||
      log.entityType?.toLowerCase().includes(query) ||
      log.entityId?.toLowerCase().includes(query)
  )
})

// Table configuration
const columns = [
  { key: 'action', label: 'Action' },
  { key: 'user', label: 'User' },
  { key: 'description', label: 'Description' },
  { key: 'metadata', label: 'Details' },
  { key: 'createdAt', label: 'Time' },
]

// Helper functions
const getActionColor = (action: string) => {
  if (action.includes('delete')) return 'red'
  if (action.includes('create')) return 'green'
  if (action.includes('update')) return 'blue'
  return 'gray'
}

const formatAction = (action: string) => {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Watch for page changes
watch(currentPage, () => {
  refresh()
})

// Set page title
useHead({
  title: 'Admin - Activity Logs',
})
</script>
