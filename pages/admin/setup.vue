<!-- filepath: d:\Personal\nuxt\nuxt-saas-starter-final\pages\admin\setup.vue -->
<template>
  <div class="mx-auto max-w-md px-4 py-12">
    <UCard>
      <template #header>
        <div class="text-center">
          <Icon name="i-heroicons-shield-check" class="mx-auto h-12 w-12 text-blue-500" />
          <h1 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">Super Admin Setup</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Initialize the first super admin account
          </p>
        </div>
      </template>

      <div class="space-y-6">
        <div v-if="!hasSuperAdmin" class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div class="flex">
            <Icon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Setup Required</h3>
              <p class="mt-1 text-sm text-blue-700 dark:text-blue-300">
                No super admin exists yet. Click the button below to make yourself the first super
                admin.
              </p>
            </div>
          </div>
        </div>

        <div v-else class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div class="flex">
            <Icon name="i-heroicons-check-circle" class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Setup Complete</h3>
              <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                Super admin has already been configured.
              </p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <UButton v-if="!hasSuperAdmin" size="lg" :loading="loading" @click="setupSuperAdmin">
            Become Super Admin
          </UButton>

          <UButton v-else variant="outline" @click="navigateTo('/admin')">
            Go to Admin Dashboard
          </UButton>
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

const toast = useToast()
const loading = ref(false)
const hasSuperAdmin = ref(false)

// Check if super admin already exists
onMounted(async () => {
  try {
    // This endpoint should check if any super admin exists
    const response = await $fetch('/api/admin/check-super-admin')
    hasSuperAdmin.value = response.exists
  } catch (error) {
    console.error('Error checking super admin status:', error)
  }
})

const setupSuperAdmin = async () => {
  try {
    loading.value = true

    const response = await $fetch('/api/admin/setup-super-admin', {
      method: 'POST',
    })

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'You are now a super admin!',
        color: 'green',
      })

      hasSuperAdmin.value = true

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        navigateTo('/admin')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Error setting up super admin:', error)

    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to setup super admin',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
