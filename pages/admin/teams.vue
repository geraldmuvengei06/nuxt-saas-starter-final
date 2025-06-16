<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teams Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage all teams in the system</p>
      </div>
    </div>

    <!-- Teams Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">All Teams</h3>
          <div class="flex items-center gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="Search teams..."
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
        <p class="text-red-500">Error loading teams: {{ error }}</p>
        <UButton variant="ghost" class="mt-2" @click="refresh()"> Try Again </UButton>
      </div>

      <div v-else>
        <UTable :rows="filteredTeams" :columns="columns" :loading="pending" class="w-full">
          <template #name-data="{ row }">
            <div class="flex items-center gap-3">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ row.name }}
                </p>
                <p v-if="row.description" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ row.description }}
                </p>
              </div>
            </div>
          </template>

          <template #members-data="{ row }">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  v-for="member in row.members.slice(0, 3)"
                  :key="member.profile.id"
                  class="relative"
                >
                  <UAvatar
                    :src="member.profile.avatarUrl"
                    :alt="member.profile.fullName || member.profile.email"
                    size="sm"
                    class="border-2 border-white dark:border-gray-800"
                  />
                </div>
                <div
                  v-if="row.members.length > 3"
                  class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300"
                >
                  +{{ row.members.length - 3 }}
                </div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ row._count.members }} member{{ row._count.members !== 1 ? 's' : '' }}
              </span>
            </div>
          </template>

          <template #projects-data="{ row }">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ row._count.projects }} project{{ row._count.projects !== 1 ? 's' : '' }}
            </span>
          </template>

          <template #createdAt-data="{ row }">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ new Date(row.createdAt).toLocaleDateString() }}
            </span>
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

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Delete Team</h3>
        </template>

        <div class="space-y-4">
          <p>Are you sure you want to delete the team "{{ teamToDelete?.name }}"?</p>
          <p class="text-sm text-red-600 dark:text-red-400">
            This will permanently delete the team and remove all members. Projects will be
            unassigned but not deleted.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="showDeleteModal = false"> Cancel </UButton>
            <UButton color="red" :loading="deletingTeam" @click="confirmDeleteTeam">
              Delete Team
            </UButton>
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
const showDeleteModal = ref(false)
const teamToDelete = ref<any>(null)
const deletingTeam = ref(false)

// Fetch teams data
const { data, pending, error, refresh } = await useFetch('/api/admin/teams', {
  query: {
    page: currentPage,
    limit: 20,
  },
  default: () => ({ teams: [], pagination: { totalPages: 1, totalCount: 0, limit: 20 } }),
})

// Computed
const filteredTeams = computed(() => {
  if (!data.value?.teams) return []

  const teams = data.value.teams
  if (!searchQuery.value) return teams

  const query = searchQuery.value.toLowerCase()
  return teams.filter(
    team =>
      team.name.toLowerCase().includes(query) ||
      team.description?.toLowerCase().includes(query) ||
      team.members.some(
        member =>
          member.profile.email.toLowerCase().includes(query) ||
          member.profile.fullName?.toLowerCase().includes(query)
      )
  )
})

// Table configuration
const columns = [
  { key: 'name', label: 'Team Name' },
  { key: 'members', label: 'Members' },
  { key: 'projects', label: 'Projects' },
  { key: 'createdAt', label: 'Created' },
  { key: 'actions', label: '' },
]

// Action items for dropdown
const getActionItems = (team: any) => [
  [
    {
      label: 'View Details',
      icon: 'i-heroicons-eye',
      click: () => navigateTo(`/teams/${team.id}`),
    },
  ],
  [
    {
      label: 'Delete Team',
      icon: 'i-heroicons-trash',
      click: () => deleteTeam(team),
    },
  ],
]

// Methods
const deleteTeam = (team: any) => {
  teamToDelete.value = team
  showDeleteModal.value = true
}

const confirmDeleteTeam = async () => {
  if (!teamToDelete.value) return

  deletingTeam.value = true

  try {
    await $fetch(`/api/admin/teams/${teamToDelete.value.id}`, {
      method: 'DELETE',
    })

    toast.add({
      title: 'Team deleted',
      description: `Team "${teamToDelete.value.name}" has been deleted successfully.`,
      color: 'green',
    })

    showDeleteModal.value = false
    teamToDelete.value = null
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to delete team',
      color: 'red',
    })
  } finally {
    deletingTeam.value = false
  }
}

// Watch for page changes
watch(currentPage, () => {
  refresh()
})

// Set page title
useHead({
  title: 'Admin - Teams Management',
})
</script>
