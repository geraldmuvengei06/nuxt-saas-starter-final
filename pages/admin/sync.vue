<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Auth ↔ Profile Synchronization
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Monitor and manage synchronization between Supabase auth.users and profiles table
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <UCard>
        <div class="flex items-center">
          <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
            <UIcon name="i-heroicons-users" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Auth Users</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.authUsers }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
            <UIcon name="i-heroicons-user-group" class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Profiles</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.profiles }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Sync Issues</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.syncIssues }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Action Buttons -->
    <div class="mb-6 flex flex-wrap gap-4">
      <UButton color="blue" :loading="isValidating" @click="validateIntegrity">
        <UIcon name="i-heroicons-shield-check" class="mr-2 h-4 w-4" />
        Validate Integrity
      </UButton>

      <UButton color="green" :loading="isBulkSyncing" @click="performBulkSync">
        <UIcon name="i-heroicons-arrow-path" class="mr-2 h-4 w-4" />
        Bulk Sync All Users
      </UButton>

      <UButton color="orange" :loading="isRetryingSyncs" @click="retryFailedSyncs">
        <UIcon name="i-heroicons-arrow-path" class="mr-2 h-4 w-4" />
        Retry Failed Syncs
      </UButton>
    </div>

    <!-- Results -->
    <div class="space-y-6">
      <!-- Validation Results -->
      <div v-if="lastValidation" class="mt-4">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Validation Results</h3>
          </template>

          <div
            v-if="
              lastValidation.issues.usersWithoutProfiles.length === 0 &&
              lastValidation.issues.profilesWithoutUsers.length === 0
            "
            class="rounded-md bg-green-50 p-3 dark:bg-green-900/20"
          >
            <p class="text-green-800 dark:text-green-200">✅ All users and profiles are in sync!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-if="lastValidation.issues.usersWithoutProfiles.length > 0"
              class="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20"
            >
              <h4 class="mb-2 font-medium text-yellow-800 dark:text-yellow-200">
                Users without Profiles ({{ lastValidation.issues.usersWithoutProfiles.length }})
              </h4>
              <div class="space-y-1">
                <p
                  v-for="user in lastValidation.issues.usersWithoutProfiles.slice(0, 5)"
                  :key="user.id"
                  class="text-sm text-yellow-700 dark:text-yellow-300"
                >
                  {{ user.email }} ({{ user.id }})
                </p>
                <p
                  v-if="lastValidation.issues.usersWithoutProfiles.length > 5"
                  class="text-sm text-yellow-600 dark:text-yellow-400"
                >
                  ... and {{ lastValidation.issues.usersWithoutProfiles.length - 5 }} more
                </p>
              </div>
            </div>

            <div
              v-if="lastValidation.issues.profilesWithoutUsers.length > 0"
              class="rounded-md bg-red-50 p-3 dark:bg-red-900/20"
            >
              <h4 class="mb-2 font-medium text-red-800 dark:text-red-200">
                Orphaned Profiles ({{ lastValidation.issues.profilesWithoutUsers.length }})
              </h4>
              <div class="space-y-1">
                <p
                  v-for="profile in lastValidation.issues.profilesWithoutUsers.slice(0, 5)"
                  :key="profile.id"
                  class="text-sm text-red-700 dark:text-red-300"
                >
                  {{ profile.email }} ({{ profile.id }})
                </p>
                <p
                  v-if="lastValidation.issues.profilesWithoutUsers.length > 5"
                  class="text-sm text-red-600 dark:text-red-400"
                >
                  ... and {{ lastValidation.issues.profilesWithoutUsers.length - 5 }} more
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Bulk Sync Results -->
      <div v-if="lastBulkSync" class="mt-4">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Bulk Sync Results</h3>
          </template>

          <div class="space-y-2">
            <p class="text-sm">
              <span class="font-medium">Synced:</span> {{ lastBulkSync.synced }}
            </p>
            <p class="text-sm">
              <span class="font-medium">Errors:</span> {{ lastBulkSync.errors }}
            </p>
            <div v-if="lastBulkSync.details.length > 0" class="mt-3">
              <h4 class="mb-2 text-sm font-medium">Details:</h4>
              <div class="max-h-40 space-y-1 overflow-y-auto">
                <p v-for="(detail, index) in lastBulkSync.details" :key="index" class="text-sm">
                  {{ detail }}
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'super-admin',
  layout: 'dashboard',
})

// Reactive data
const isValidating = ref(false)
const isBulkSyncing = ref(false)
const isRetryingSyncs = ref(false)

const stats = ref({
  authUsers: 0,
  profiles: 0,
  syncIssues: 0,
})

const lastValidation = ref<any>(null)
const lastBulkSync = ref<any>(null)

// Functions
const validateIntegrity = async () => {
  isValidating.value = true
  try {
    const result = await $fetch('/api/admin/validate-integrity')
    lastValidation.value = result

    // Update stats
    stats.value.authUsers = result.summary.totalAuthUsers
    stats.value.profiles = result.summary.totalProfiles
    stats.value.syncIssues =
      result.summary.usersWithoutProfiles + result.summary.profilesWithoutUsers

    useNotifications().add({
      title: 'Validation Complete',
      description: `Found ${stats.value.syncIssues} sync issues`,
      color: stats.value.syncIssues === 0 ? 'green' : 'yellow',
    })
  } catch (error: any) {
    useNotifications().add({
      title: 'Validation Failed',
      description: error.message || 'Failed to validate integrity',
      color: 'red',
    })
  } finally {
    isValidating.value = false
  }
}

const performBulkSync = async () => {
  isBulkSyncing.value = true
  try {
    const result = await $fetch('/api/admin/sync-users', {
      method: 'POST',
    })
    lastBulkSync.value = result

    useNotifications().add({
      title: 'Bulk Sync Complete',
      description: `Synced ${result.synced} users with ${result.errors} errors`,
      color: result.errors === 0 ? 'green' : 'yellow',
    })

    // Refresh validation after bulk sync
    await validateIntegrity()
  } catch (error: any) {
    useNotifications().add({
      title: 'Bulk Sync Failed',
      description: error.message || 'Failed to perform bulk sync',
      color: 'red',
    })
  } finally {
    isBulkSyncing.value = false
  }
}

const retryFailedSyncs = async () => {
  isRetryingSyncs.value = true
  try {
    const result = await $fetch('/api/admin/retry-failed-syncs', {
      method: 'POST',
    })

    useNotifications().add({
      title: 'Retry Complete',
      description: `Retried ${result.retried} syncs with ${result.errors} errors`,
      color: result.errors === 0 ? 'green' : 'yellow',
    })

    // Refresh validation after retry
    await validateIntegrity()
  } catch (error: any) {
    useNotifications().add({
      title: 'Retry Failed',
      description: error.message || 'Failed to retry failed syncs',
      color: 'red',
    })
  } finally {
    isRetryingSyncs.value = false
  }
}

// Initialize
onMounted(async () => {
  await validateIntegrity()
})
</script>
