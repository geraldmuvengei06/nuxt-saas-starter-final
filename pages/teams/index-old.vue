<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teams</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your teams and collaborate with others
        </p>
      </div>
      <UButton icon="i-heroicons-plus" @click="showCreateModal = true"> Create Team </UButton>
    </div>

    <!-- Teams Grid -->
    <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-32" />
    </div>

    <div v-else-if="teams.length === 0" class="py-12 text-center">
      <div class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
        <Icon name="i-heroicons-users" class="h-12 w-12" />
      </div>
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No teams</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first team.
      </p>
      <div class="mt-6">
        <UButton icon="i-heroicons-plus" @click="showCreateModal = true"> Create Team </UButton>
      </div>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="team in teams"
        :key="team.id"
        class="cursor-pointer transition-shadow duration-200 hover:shadow-lg"
        @click="navigateTo(`/teams/${team.id}`)"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ team.name }}
            </h3>
            <UBadge
              :label="getUserRole(team)"
              :color="getRoleColor(getUserRole(team))"
              variant="subtle"
            />
          </div>
        </template>

        <div class="space-y-3">
          <p v-if="team.description" class="text-sm text-gray-600 dark:text-gray-300">
            {{ team.description }}
          </p>

          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-1">
              <Icon name="i-heroicons-users" class="h-4 w-4" />
              <span
                >{{ team._count.members }} member{{ team._count.members !== 1 ? 's' : '' }}</span
              >
            </div>
            <div class="flex items-center space-x-1">
              <Icon name="i-heroicons-folder" class="h-4 w-4" />
              <span
                >{{ team._count.projects }} project{{ team._count.projects !== 1 ? 's' : '' }}</span
              >
            </div>
          </div>

          <!-- Team Members Avatars -->
          <div class="flex -space-x-2">
            <UAvatar
              v-for="member in team.members.slice(0, 5)"
              :key="member.profile.id"
              :src="member.profile.avatarUrl"
              :alt="member.profile.fullName || member.profile.email"
              size="sm"
              class="border-2 border-white dark:border-gray-800"
            />
            <div
              v-if="team.members.length > 5"
              class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >
              +{{ team.members.length - 5 }}
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created {{ formatDate(team.createdAt) }}</span>
            <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-arrow-right"
              @click.stop="navigateTo(`/teams/${team.id}`)"
            >
              View
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Create Team Modal -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Team</h3>
        </template>

        <UForm
          :schema="createTeamSchema"
          :state="createTeamForm"
          class="space-y-4"
          @submit="createTeam"
        >
          <UFormGroup label="Team Name" name="name" required>
            <UInput v-model="createTeamForm.name" placeholder="Enter team name" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="createTeamForm.description"
              placeholder="Enter team description (optional)"
              :rows="3"
            />
          </UFormGroup>

          <div class="flex justify-end space-x-3">
            <UButton variant="ghost" @click="showCreateModal = false"> Cancel </UButton>
            <UButton type="submit" :loading="creatingTeam"> Create Team </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const toast = useToast()

// Form validation
const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
  description: z.string().max(500, 'Description too long').optional(),
})

// State
const showCreateModal = ref(false)
const creatingTeam = ref(false)
const createTeamForm = reactive({
  name: '',
  description: '',
})

// Fetch teams
const { data: teamsData, pending, refresh } = await useFetch('/api/teams')
const teams = computed(() => (teamsData.value as any[]) || [])

// Methods
const createTeam = async () => {
  try {
    creatingTeam.value = true
    await $fetch('/api/teams', {
      method: 'POST',
      body: createTeamForm,
    })
    toast.add({
      title: 'Success',
      description: 'Team created successfully',
      color: 'green',
    })

    showCreateModal.value = false
    createTeamForm.name = ''
    createTeamForm.description = ''
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to create team',
      color: 'red',
    })
  } finally {
    creatingTeam.value = false
  }
}

const getUserRole = (team: any) => {
  const user = useSupabaseUser()
  const member = team.members.find((m: any) => m.profile.id === user.value?.id)
  return member?.role || 'member'
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'owner':
      return 'red'
    case 'admin':
      return 'orange'
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
