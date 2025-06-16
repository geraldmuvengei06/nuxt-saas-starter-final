<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>
      <UButton variant="outline" icon="i-heroicons-arrow-left" @click="navigateTo('/admin')">
        Back to Admin
      </UButton>
    </div>

    <!-- Users Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Users</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ usersData?.pagination?.totalCount || 0 }} total users
            </span>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <USkeleton v-for="i in 5" :key="i" class="h-16" />
      </div>

      <!-- Users List -->
      <div v-else-if="users && users.length > 0" class="space-y-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div class="flex items-center space-x-4">
            <UAvatar :src="user.avatarUrl" :alt="user.fullName || user.email" size="lg" />
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.fullName || 'No name' }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </p>
              <div class="mt-1 flex items-center space-x-4">
                <span class="text-xs text-gray-400"> Joined {{ formatDate(user.createdAt) }} </span>
                <span class="text-xs text-gray-400"> {{ user._count.projects }} projects </span>
                <span class="text-xs text-gray-400"> {{ user._count.teamMembers }} teams </span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Subscription Status -->
            <UBadge
              v-if="user.subscription"
              :label="user.subscription.status"
              :color="getSubscriptionColor(user.subscription.status)"
              variant="subtle"
            />
            <UBadge v-else label="No subscription" color="gray" variant="subtle" />

            <!-- Actions -->
            <UDropdown :items="getUserActions(user)">
              <UButton icon="i-heroicons-ellipsis-vertical" variant="ghost" size="sm" />
            </UDropdown>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <Icon name="i-heroicons-users" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No users found</h3>
      </div>

      <!-- Pagination -->
      <template v-if="usersData?.pagination && usersData.pagination.totalPages > 1" #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ (usersData.pagination.page - 1) * usersData.pagination.limit + 1 }} to
            {{
              Math.min(
                usersData.pagination.page * usersData.pagination.limit,
                usersData.pagination.totalCount
              )
            }}
            of {{ usersData.pagination.totalCount }} results
          </div>
          <div class="flex items-center space-x-2">
            <UButton
              size="sm"
              variant="outline"
              :disabled="usersData.pagination.page <= 1"
              @click="loadPage(usersData.pagination.page - 1)"
            >
              Previous
            </UButton>
            <UButton
              size="sm"
              variant="outline"
              :disabled="usersData.pagination.page >= usersData.pagination.totalPages"
              @click="loadPage(usersData.pagination.page + 1)"
            >
              Next
            </UButton>
          </div>
        </div>
      </template>
    </UCard>

    <!-- Delete User Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Delete User</h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{{ selectedUser?.email }}</strong
            >? This action cannot be undone.
          </p>
          <p class="text-sm text-red-600 dark:text-red-400">
            All user data, projects, and team memberships will be permanently deleted.
          </p>

          <div class="flex justify-end space-x-3">
            <UButton variant="ghost" @click="showDeleteModal = false"> Cancel </UButton>
            <UButton color="red" :loading="deleting" @click="deleteUser"> Delete User </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const toast = useToast()
const route = useRoute()

// State
const showDeleteModal = ref(false)
const selectedUser = ref<any>(null)
const deleting = ref(false)
const currentPage = ref(Number(route.query.page) || 1)

// Fetch users data
const {
  data: usersData,
  pending,
  refresh,
} = (await useFetch('/api/admin/users', {
  query: { page: currentPage },
  default: () => ({ users: [], pagination: null }),
})) as { data: Ref<any>; pending: Ref<boolean>; refresh: () => Promise<void> }

const users = computed(() => (usersData.value?.users as any[]) || [])

// Methods
const loadPage = async (page: number) => {
  currentPage.value = page
  await navigateTo({ query: { page } })
  await refresh()
}

const deleteUser = async () => {
  if (!selectedUser.value) return

  try {
    deleting.value = true
    await $fetch(`/api/admin/users/${selectedUser.value.id}`, {
      method: 'DELETE',
    })

    toast.add({
      title: 'Success',
      description: 'User deleted successfully',
      color: 'green',
    })

    showDeleteModal.value = false
    selectedUser.value = null
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to delete user',
      color: 'red',
    })
  } finally {
    deleting.value = false
  }
}

const getUserActions = (user: any) => {
  return [
    [
      {
        label: 'View Details',
        icon: 'i-heroicons-eye',
        click: () => {
          // Navigate to user detail page (not implemented)
          toast.add({
            title: 'Info',
            description: 'User detail view not implemented yet',
            color: 'blue',
          })
        },
      },
    ],
    [
      {
        label: 'Delete User',
        icon: 'i-heroicons-trash',
        click: () => {
          selectedUser.value = user
          showDeleteModal.value = true
        },
      },
    ],
  ]
}

const getSubscriptionColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'canceled':
      return 'red'
    case 'incomplete':
      return 'yellow'
    default:
      return 'gray'
  }
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
</script>
