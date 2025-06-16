<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">Projects</h1>
          <p class="mt-2 text-sm text-gray-700">Manage all your projects in one place.</p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <UButton @click="$router.push('/projects/new')">
            <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
            New Project
          </UButton>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="mt-8">
        <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="overflow-hidden rounded-lg bg-white shadow">
            <div class="p-6">
              <div class="animate-pulse">
                <div class="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                <div class="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="projects.length === 0" class="py-12 text-center">
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

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="project in projects"
            :key="project.id"
            class="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
            @click="$router.push(`/projects/${project.id}`)"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-lg font-medium text-gray-900">
                    {{ project.name }}
                  </h3>
                  <p class="mt-1 truncate text-sm text-gray-500">
                    {{ project.description || 'No description' }}
                  </p>
                </div>
                <UDropdown :items="getProjectActions(project)">
                  <UButton variant="ghost" size="sm" square @click.stop>
                    <UIcon name="i-heroicons-ellipsis-vertical" />
                  </UButton>
                </UDropdown>
              </div>
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <UIcon name="i-heroicons-calendar" class="mr-1 h-4 w-4" />
                Created {{ formatDate(project.created_at) }}
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
const router = useRouter()
const toast = useToast()

const projects = ref([])
const loading = ref(true)

const fetchProjects = async () => {
  if (!user.value) return

  try {
    loading.value = true
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    projects.value = data || []
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to fetch projects',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const deleteProject = async (project: any) => {
  if (
    !confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)
  ) {
    return
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', project.id)

    if (error) {
      throw error
    } else {
      toast.add({
        title: 'Success',
        description: 'Project deleted successfully',
        color: 'green',
      })
    }

    await fetchProjects()
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to delete project',
      color: 'red',
    })
  }
}

const getProjectActions = (project: any) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      click: () => router.push(`/projects/${project.id}/edit`),
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => deleteProject(project),
    },
  ],
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchProjects()
})
</script>
