<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="pending" class="space-y-6">
      <USkeleton class="h-8 w-64" />
      <USkeleton class="h-32" />
      <USkeleton class="h-48" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12 text-center">
      <div class="mx-auto h-12 w-12 text-red-400">
        <Icon name="i-heroicons-exclamation-triangle" class="h-12 w-12" />
      </div>
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Error loading team</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Failed to load team details</p>
      <div class="mt-6">
        <UButton icon="i-heroicons-arrow-left" @click="navigateTo('/teams')">
          Back to Teams
        </UButton>
      </div>
    </div>

    <!-- Team Content -->
    <div v-else-if="team">
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <div class="mb-2 flex items-center space-x-2">
            <UButton variant="ghost" icon="i-heroicons-arrow-left" @click="navigateTo('/teams')">
              Back
            </UButton>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ team.name }}
          </h1>
          <p v-if="team.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ team.description }}
          </p>
          <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-1">
              <Icon name="i-heroicons-users" class="h-4 w-4" />
              <span>{{ team._count?.members || 0 }} members</span>
            </div>
            <div class="flex items-center space-x-1">
              <Icon name="i-heroicons-folder" class="h-4 w-4" />
              <span>{{ team._count?.projects || 0 }} projects</span>
            </div>
            <UBadge :label="userRole" :color="getRoleColor(userRole)" variant="subtle" />
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <UButton
            v-if="canManageTeam"
            variant="outline"
            icon="i-heroicons-cog-6-tooth"
            @click="showSettingsModal = true"
          >
            Settings
          </UButton>
          <UButton
            v-if="canManageMembers"
            icon="i-heroicons-plus"
            @click="showAddMemberModal = true"
          >
            Add Member
          </UButton>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs :items="tabs" class="mb-6">
        <!-- Members Tab -->
        <template #members>
          <div class="space-y-4">
            <div v-if="!team.members || team.members.length === 0" class="py-8 text-center">
              <p class="text-gray-500 dark:text-gray-400">No members found</p>
            </div>
            <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <UCard v-for="member in team.members" :key="member.profile.id">
                <div class="flex items-center space-x-3">
                  <UAvatar
                    :src="member.profile.avatarUrl"
                    :alt="member.profile.fullName || member.profile.email"
                    size="lg"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {{ member.profile.fullName || member.profile.email }}
                    </p>
                    <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                      {{ member.profile.email }}
                    </p>
                    <div class="mt-1 flex items-center space-x-2">
                      <UBadge
                        :label="member.role"
                        :color="getRoleColor(member.role)"
                        variant="subtle"
                        size="xs"
                      />
                      <span class="text-xs text-gray-400">
                        Joined {{ formatDate(member.createdAt) }}
                      </span>
                    </div>
                  </div>
                  <UDropdown
                    v-if="canManageMembers && member.profile.id !== user?.id"
                    :items="getMemberActions(member)"
                  >
                    <UButton icon="i-heroicons-ellipsis-vertical" variant="ghost" size="sm" />
                  </UDropdown>
                </div>
              </UCard>
            </div>
          </div>
        </template>

        <!-- Projects Tab -->
        <template #projects>
          <div class="space-y-4">
            <div v-if="!team.projects || team.projects.length === 0" class="py-12 text-center">
              <div class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                <Icon name="i-heroicons-folder" class="h-12 w-12" />
              </div>
              <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No projects</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This team doesn't have any projects yet.
              </p>
              <div class="mt-6">
                <UButton icon="i-heroicons-plus" @click="navigateTo('/projects/new')">
                  Create Project
                </UButton>
              </div>
            </div>
            <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <UCard
                v-for="project in team.projects"
                :key="project.id"
                class="cursor-pointer transition-shadow duration-200 hover:shadow-lg"
                @click="navigateTo(`/projects/${project.id}`)"
              >
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ project.name }}
                  </h3>
                </template>
                <p v-if="project.description" class="text-sm text-gray-600 dark:text-gray-300">
                  {{ project.description }}
                </p>
                <template #footer>
                  <div
                    class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                  >
                    <span>Created {{ formatDate(project.createdAt) }}</span>
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="i-heroicons-arrow-right"
                      @click.stop="navigateTo(`/projects/${project.id}`)"
                    >
                      View
                    </UButton>
                  </div>
                </template>
              </UCard>
            </div>
          </div>
        </template>
      </UTabs>
    </div>

    <!-- Add Member Modal -->
    <UModal v-model="showAddMemberModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Team Member</h3>
        </template>

        <form class="space-y-4" @submit.prevent="addMember">
          <UFormGroup label="Profile ID" name="profileId" required>
            <UInput
              v-model="addMemberForm.profileId"
              placeholder="Enter user's profile ID"
              required
            />
          </UFormGroup>

          <UFormGroup label="Role" name="role" required>
            <USelect v-model="addMemberForm.role" :options="roleOptions" />
          </UFormGroup>

          <div class="flex justify-end space-x-3">
            <UButton type="button" variant="ghost" @click="showAddMemberModal = false">
              Cancel
            </UButton>
            <UButton type="submit" :loading="addingMember"> Add Member </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Settings Modal -->
    <UModal v-model="showSettingsModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Team Settings</h3>
        </template>

        <form class="space-y-4" @submit.prevent="updateTeam">
          <UFormGroup label="Team Name" name="name" required>
            <UInput v-model="updateTeamForm.name" placeholder="Enter team name" required />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="updateTeamForm.description"
              placeholder="Enter team description (optional)"
              :rows="3"
            />
          </UFormGroup>

          <div class="flex justify-end space-x-3">
            <UButton type="button" variant="ghost" @click="showSettingsModal = false">
              Cancel
            </UButton>
            <UButton type="submit" :loading="updatingTeam"> Update Team </UButton>
          </div>
        </form>

        <!-- Danger Zone -->
        <div
          v-if="userRole === 'owner'"
          class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700"
        >
          <h4 class="mb-4 text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</h4>
          <UButton
            color="red"
            variant="soft"
            :loading="deletingTeam"
            @click="showDeleteModal = true"
          >
            Delete Team
          </UButton>
        </div>
      </UCard>
    </UModal>

    <!-- Delete Team Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Delete Team</h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{{ team?.name }}</strong
            >? This action cannot be undone.
          </p>
          <p class="text-sm text-red-600 dark:text-red-400">
            All team projects and data will be permanently deleted.
          </p>

          <div class="flex justify-end space-x-3">
            <UButton variant="ghost" @click="showDeleteModal = false"> Cancel </UButton>
            <UButton color="red" :loading="deletingTeam" @click="deleteTeam"> Delete Team </UButton>
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

const route = useRoute()
const user = useSupabaseUser()
const toast = useToast()

// State
const showAddMemberModal = ref(false)
const showSettingsModal = ref(false)
const showDeleteModal = ref(false)
const addingMember = ref(false)
const updatingTeam = ref(false)
const deletingTeam = ref(false)

const addMemberForm = reactive({
  profileId: '',
  role: 'member',
})

const updateTeamForm = reactive({
  name: '',
  description: '',
})

// Fetch team data
const {
  data: team,
  pending,
  error,
  refresh,
} = await useFetch(`/api/teams/${route.params.id}`, {
  default: () => null,
})

// Initialize form data when team is loaded
watch(
  team,
  newTeam => {
    if (newTeam) {
      updateTeamForm.name = newTeam.name || ''
      updateTeamForm.description = newTeam.description || ''
    }
  },
  { immediate: true }
)

// Computed
const userRole = computed(() => {
  if (!team.value?.members || !user.value) return 'member'
  const member = team.value.members.find((m: any) => m.profile.id === user.value.id)
  return member?.role || 'member'
})

const canManageTeam = computed(() => {
  return ['owner', 'admin'].includes(userRole.value)
})

const canManageMembers = computed(() => {
  return ['owner', 'admin'].includes(userRole.value)
})

const tabs = [
  { key: 'members', label: 'Members', slot: 'members' },
  { key: 'projects', label: 'Projects', slot: 'projects' },
]

const roleOptions = [
  { label: 'Member', value: 'member' },
  { label: 'Admin', value: 'admin' },
]

// Methods
const addMember = async () => {
  if (!addMemberForm.profileId.trim()) return

  try {
    addingMember.value = true
    await $fetch(`/api/teams/${route.params.id}/members`, {
      method: 'POST',
      body: addMemberForm,
    })

    toast.add({
      title: 'Success',
      description: 'Member added successfully',
      color: 'green',
    })

    showAddMemberModal.value = false
    addMemberForm.profileId = ''
    addMemberForm.role = 'member'
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to add member',
      color: 'red',
    })
  } finally {
    addingMember.value = false
  }
}

const updateTeam = async () => {
  if (!updateTeamForm.name.trim()) return

  try {
    updatingTeam.value = true
    await $fetch(`/api/teams/${route.params.id}`, {
      method: 'PUT',
      body: {
        name: updateTeamForm.name.trim(),
        description: updateTeamForm.description.trim() || undefined,
      },
    })

    toast.add({
      title: 'Success',
      description: 'Team updated successfully',
      color: 'green',
    })

    showSettingsModal.value = false
    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to update team',
      color: 'red',
    })
  } finally {
    updatingTeam.value = false
  }
}

const deleteTeam = async () => {
  try {
    deletingTeam.value = true
    await $fetch(`/api/teams/${route.params.id}`, {
      method: 'DELETE',
    })

    toast.add({
      title: 'Success',
      description: 'Team deleted successfully',
      color: 'green',
    })

    await navigateTo('/teams')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to delete team',
      color: 'red',
    })
  } finally {
    deletingTeam.value = false
  }
}

const removeMember = async (profileId: string) => {
  try {
    await $fetch(`/api/teams/${route.params.id}/members?profileId=${profileId}`, {
      method: 'DELETE',
    })

    toast.add({
      title: 'Success',
      description: 'Member removed successfully',
      color: 'green',
    })

    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to remove member',
      color: 'red',
    })
  }
}

const changeRole = async (profileId: string, role: string) => {
  try {
    await $fetch(`/api/teams/${route.params.id}/members?profileId=${profileId}`, {
      method: 'PUT',
      body: { role },
    })

    toast.add({
      title: 'Success',
      description: 'Member role updated successfully',
      color: 'green',
    })

    await refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to update member role',
      color: 'red',
    })
  }
}

const getMemberActions = (member: any) => {
  const actions = []

  if (userRole.value === 'owner') {
    // Owners can change roles
    if (member.role !== 'owner') {
      actions.push([
        { label: 'Make Admin', click: () => changeRole(member.profile.id, 'admin') },
        { label: 'Make Member', click: () => changeRole(member.profile.id, 'member') },
      ])
    }
    if (member.role !== 'owner') {
      actions.push([{ label: 'Make Owner', click: () => changeRole(member.profile.id, 'owner') }])
    }
  }

  // Owners and admins can remove members (except owners can't remove other owners)
  if (canManageMembers.value && !(member.role === 'owner' && userRole.value !== 'owner')) {
    actions.push([{ label: 'Remove Member', click: () => removeMember(member.profile.id) }])
  }

  return actions
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
