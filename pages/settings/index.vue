<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()

const form = reactive({
  name: user.value?.user_metadata?.name || '',
  email: user.value?.email || '',
  loading: false,
})

const handleUpdateProfile = async () => {
  form.loading = true

  try {
    const { error } = await supabase.auth.updateUser({
      data: { name: form.name },
    })

    if (error) {
      toast.add({
        title: 'Update failed',
        description: error.message,
        color: 'error',
      })
    } else {
      toast.add({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
        color: 'success',
      })
    }
  } catch (err) {
    console.error(err)
    toast.add({
      title: 'Update failed',
      description: 'An unexpected error occurred',
      color: 'error',
    })
  } finally {
    form.loading = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <h1 class="text-2xl font-bold">Settings</h1>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">Personal Information</h2>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="handleUpdateProfile">
        <UFormField label="Full name" name="name">
          <UInput v-model="form.name" placeholder="Your name" />
        </UFormField>

        <UFormField label="Email address" name="email">
          <UInput v-model="form.email" type="email" placeholder="you@example.com" disabled />
          <template #hint>
            <span class="text-xs text-neutral-500">Email cannot be changed</span>
          </template>
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" :loading="form.loading"> Save changes </UButton>
        </div>
      </form>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">Notification Settings</h2>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Toggle is now Switch -->
        <USwitch label="Email notifications" />
        <USwitch label="Push notifications" />
        <USwitch label="Weekly digest" default-value />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-error-600">Danger Zone</h2>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-neutral-600 dark:text-neutral-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <UButton color="error" variant="soft"> Delete account </UButton>
      </div>
    </UCard>
  </div>
</template>
