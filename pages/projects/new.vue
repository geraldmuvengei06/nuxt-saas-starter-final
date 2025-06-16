<template>
  <div class="bg-gray-50000 min-h-screen">
    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <div class="md:flex md:items-center md:justify-between">
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Create New Project
            </h1>
          </div>
          <div class="mt-4 flex md:ml-4 md:mt-0">
            <UButton variant="outline" @click="$router.back()"> Cancel </UButton>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <UCard>
          <form class="space-y-6" @submit.prevent="createProject">
            <div>
              <UFormGroup label="Project Name" name="name" required>
                <UInput v-model="form.name" placeholder="Enter project name" required />
              </UFormGroup>
            </div>
            <div>
              <UFormGroup label="Description" name="description">
                <UTextarea
                  v-model="form.description"
                  placeholder="Enter project description (optional)"
                  rows="3"
                />
              </UFormGroup>
            </div>

            <div>
              <UFormGroup label="Team" name="teamId">
                <USelect
                  v-model="form.teamId"
                  :options="teamOptions"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Select a team (optional)"
                />
              </UFormGroup>
            </div>

            <div class="flex justify-end space-x-3">
              <UButton type="button" variant="outline" @click="$router.back()"> Cancel </UButton>
              <UButton type="submit" :loading="loading" :disabled="loading || !form.name.trim()">
                Create Project
              </UButton>
            </div>
          </form>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

// const user = useSupabaseUser()
// const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  teamId: null as string | null,
})

// Fetch user's teams
const { data: teamsData } = await useFetch('/api/teams')
const teams = computed(() => teamsData.value || [])

const teamOptions = computed(() => [
  { label: 'Personal Project', value: null },
  ...teams.value.map((team: any) => ({
    label: team.name,
    value: team.id,
  })),
])

const createProject = async () => {
  try {
    loading.value = true

    const response = (await $fetch('/api/projects', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        description: form.description.trim() || null,
        teamId: form.teamId,
      },
    })) as any

    toast.add({
      title: 'Success!',
      description: 'Project created successfully',
      color: 'green',
    })

    await router.push(`/projects/${response.project.id}`)
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to create project',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
