<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage all projects in the system</p>
      </div>
    </div>

    <!-- Projects Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">All Projects</h3>
          <div class="flex items-center gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="Search projects..."
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
        <p class="text-red-500">Error loading projects: {{ error }}</p>
        <UButton variant="ghost" class="mt-2" @click="refresh()"> Try Again </UButton>
      </div>

      <div v-else>
        <UTable :rows="filteredProjects" :columns="columns" :loading="pending" class="w-full">
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

          <template #owner-data="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="row.owner.avatarUrl"
                :alt="row.owner.fullName || row.owner.email"
                size="sm"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ row.owner.fullName || row.owner.email }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.owner.email }}
                </p>
              </div>
            </div>
          </template>

          <template #team-data="{ row }">
            <div v-if="row.team">
              <UBadge variant="soft" color="blue">
                {{ row.team.name }}
              </UBadge>
            </div>
            <div v-else>
              <UBadge variant="soft" color="gray"> Personal </UBadge>
            </div>
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
          <h3 class="text-lg font-semibold">Delete Project</h3>
        </template>

        <div class="space-y-4">
          <p>Are you sure you want to delete the project "{{ projectToDelete?.name }}"?</p>
          <p class="text-sm text-red-600 dark:text-red-400">
            This action cannot be undone. All project data will be permanently deleted.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="showDeleteModal = false"> Cancel </UButton>
            <UButton color="red" :loading="deletingProject" @click="confirmDeleteProject">
              Delete Project
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
const projectToDelete = ref<any>(null)
const deletingProject = ref(false)

// Fetch projects data
const { data, pending, error, refresh } = await useFetch('/api/admin/projects', {
  query: {
    page: currentPage,
    limit: 20,
  },
  default: () => ({ projects: [], pagination: { totalPages: 1, totalCount: 0, limit: 20 } }),
})

// Computed
const filteredProjects = computed(() => {
  if (!data.value?.projects) return []

  const projects = data.value.projects
  if (!searchQuery.value) return projects

  const query = searchQuery.value.toLowerCase()
  return projects.filter(
    project =>
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.owner.email.toLowerCase().includes(query) ||
      project.owner.fullName?.toLowerCase().includes(query) ||
      project.team?.name.toLowerCase().includes(query)
  )
})

// Table configuration
const columns = [
  { key: 'name', label: 'Project Name' },
  { key: 'owner', label: 'Owner' },
  { key: 'team', label: 'Team' },
  { key: 'createdAt', label: 'Created' },
  { key: 'actions', label: '' },
]

// Action items for dropdown
const getActionItems = (project: any) => [
  [
    {
      label: 'View Project',
      icon: 'i-heroicons-eye',
      click: () => navigateTo(`/projects/${project.id}`),
    },
  ],
  [
    {
      label: 'Delete Project',
      icon: 'i-heroicons-trash',
      click: () => deleteProject(project),
    },
  ],
]

// Methods
const deleteProject = (project: any) => {
  projectToDelete.value = project
  showDeleteModal.value = true
}

const confirmDeleteProject = async () => {
  if (!projectToDelete.value) return

  deletingProject.value = true

  try {
    await $fetch(`/api/admin/projects/${projectToDelete.value.id}`, {
      method: 'DELETE',
    })

    toast.add({
      title: 'Project deleted',
      description: `Project "${projectToDelete.value.name}" has been deleted successfully.`,
      color: 'green',
    })

    showDeleteModal.value = false
    projectToDelete.value = null
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to delete project',
      color: 'red',
    })
  } finally {
    deletingProject.value = false
  }
}

// Watch for page changes
watch(currentPage, () => {
  refresh()
})

// Set page title
useHead({
  title: 'Admin - Projects Management',
})
</script>
