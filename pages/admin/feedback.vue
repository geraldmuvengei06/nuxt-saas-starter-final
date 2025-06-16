<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Feedback Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage user feedback and support requests</p>
      </div>
    </div>

    <!-- Status Filter -->
    <div class="flex gap-4">
      <UButton
        v-for="status in statusFilters"
        :key="status.value"
        :variant="selectedStatus === status.value ? 'solid' : 'ghost'"
        :color="status.color as any"
        @click="selectedStatus = status.value"
      >
        {{ status.label }}
      </UButton>
    </div>

    <!-- Feedback Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Feedback Items</h3>
          <div class="flex items-center gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="Search feedback..."
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
        <p class="text-red-500">Error loading feedback: {{ error }}</p>
        <UButton variant="ghost" class="mt-2" @click="refresh()"> Try Again </UButton>
      </div>

      <div v-else>
        <UTable :rows="filteredFeedback" :columns="columns" :loading="pending" class="w-full">
          <template #message-data="{ row }">
            <div class="max-w-md">
              <p class="line-clamp-2 text-sm text-gray-900 dark:text-white">
                {{ row.message }}
              </p>
            </div>
          </template>

          <template #user-data="{ row }">
            <div v-if="row.profile" class="flex items-center gap-3">
              <UAvatar
                :src="row.profile.avatarUrl"
                :alt="row.profile.fullName || row.profile.email"
                size="sm"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ row.profile.fullName || row.profile.email }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.profile.email }}
                </p>
              </div>
            </div>
            <div v-else>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ row.name || 'Anonymous' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.email || 'No email provided' }}
                </p>
              </div>
            </div>
          </template>

          <template #status-data="{ row }">
            <UBadge :color="getStatusColor(row.status)" variant="soft">
              {{ getStatusLabel(row.status) }}
            </UBadge>
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

          <template #actions-data="{ row }">
            <UDropdown :items="getActionItems(row)">
              <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
            </UDropdown>
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
      </div>
    </UCard>

    <!-- Feedback Detail Modal -->
    <UModal v-model="showDetailModal" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Feedback Details</h3>
            <UBadge :color="getStatusColor(selectedFeedback?.status)" variant="soft">
              {{ getStatusLabel(selectedFeedback?.status) }}
            </UBadge>
          </div>
        </template>

        <div v-if="selectedFeedback" class="space-y-6">
          <!-- User Info -->
          <div class="flex items-center gap-4">
            <UAvatar
              v-if="selectedFeedback.profile"
              :src="selectedFeedback.profile.avatarUrl"
              :alt="selectedFeedback.profile.fullName || selectedFeedback.profile.email"
              size="lg"
            />
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ selectedFeedback.profile?.fullName || selectedFeedback.name || 'Anonymous' }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{
                  selectedFeedback.profile?.email || selectedFeedback.email || 'No email provided'
                }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                Submitted on {{ new Date(selectedFeedback.createdAt).toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Message -->
          <div>
            <h5 class="mb-2 font-medium text-gray-900 dark:text-white">Message</h5>
            <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {{ selectedFeedback.message }}
            </p>
          </div>

          <!-- Status Update -->
          <div>
            <h5 class="mb-2 font-medium text-gray-900 dark:text-white">Update Status</h5>
            <div class="flex gap-2">
              <UButton
                v-for="status in ['pending', 'reviewed', 'resolved']"
                :key="status"
                :variant="selectedFeedback.status === status ? 'solid' : 'ghost'"
                :color="getStatusColor(status)"
                size="sm"
                :loading="updatingStatus === status"
                @click="updateFeedbackStatus(selectedFeedback.id, status)"
              >
                {{ getStatusLabel(status) }}
              </UButton>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton variant="ghost" @click="showDetailModal = false"> Close </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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

const toast = useToast()

// Reactive state
const currentPage = ref(1)
const searchQuery = ref('')
const selectedStatus = ref('all')
const showDetailModal = ref(false)
const selectedFeedback = ref<any>(null)
const updatingStatus = ref<string | null>(null)

// Status configuration
const statusFilters = [
  { value: 'all', label: 'All', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'reviewed', label: 'Reviewed', color: 'blue' },
  { value: 'resolved', label: 'Resolved', color: 'green' },
]

// Fetch feedback data
const { data, pending, error, refresh } = await useFetch('/api/admin/feedback', {
  query: {
    page: currentPage,
    limit: 20,
  },
  default: () => ({ feedback: [], pagination: { totalPages: 1, totalCount: 0, limit: 20 } }),
})

// Computed
const filteredFeedback = computed(() => {
  if (!data.value?.feedback) return []

  let feedback = data.value.feedback

  // Filter by status
  if (selectedStatus.value !== 'all') {
    feedback = feedback.filter(item => item.status === selectedStatus.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    feedback = feedback.filter(
      item =>
        item.message.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.profile?.email.toLowerCase().includes(query) ||
        item.profile?.fullName?.toLowerCase().includes(query)
    )
  }

  return feedback
})

// Table configuration
const columns = [
  { key: 'message', label: 'Message' },
  { key: 'user', label: 'User' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: '' },
]

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'reviewed':
      return 'blue'
    case 'resolved':
      return 'green'
    default:
      return 'gray'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'reviewed':
      return 'Reviewed'
    case 'resolved':
      return 'Resolved'
    default:
      return 'Unknown'
  }
}

// Action items for dropdown
const getActionItems = (feedback: any) => [
  [
    {
      label: 'View Details',
      icon: 'i-heroicons-eye',
      click: () => viewFeedback(feedback),
    },
  ],
  [
    {
      label: 'Mark as Reviewed',
      icon: 'i-heroicons-check-circle',
      click: () => updateFeedbackStatus(feedback.id, 'reviewed'),
      disabled: feedback.status === 'reviewed',
    },
    {
      label: 'Mark as Resolved',
      icon: 'i-heroicons-check-badge',
      click: () => updateFeedbackStatus(feedback.id, 'resolved'),
      disabled: feedback.status === 'resolved',
    },
  ],
]

// Methods
const viewFeedback = (feedback: any) => {
  selectedFeedback.value = feedback
  showDetailModal.value = true
}

const updateFeedbackStatus = async (feedbackId: string, status: string) => {
  updatingStatus.value = status

  try {
    await $fetch(`/api/admin/feedback/${feedbackId}`, {
      method: 'PATCH',
      body: { status },
    })

    toast.add({
      title: 'Status updated',
      description: `Feedback status updated to ${getStatusLabel(status)}.`,
      color: 'green',
    })

    // Update local data
    if (selectedFeedback.value?.id === feedbackId) {
      selectedFeedback.value.status = status
    }

    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update status',
      color: 'red',
    })
  } finally {
    updatingStatus.value = null
  }
}

// Watch for page changes
watch(currentPage, () => {
  refresh()
})

// Set page title
useHead({
  title: 'Admin - Feedback Management',
})
</script>
