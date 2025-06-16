<template>
  <div class="bg-gray-50000 min-h-screen dark:bg-gray-900">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="px-4 py-5 sm:p-6">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Settings
                </h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Manage your account information and preferences.
                </p>
              </div>
            </div>

            <!-- Profile Settings -->
            <div class="mt-8">
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Profile Information
              </h2>

              <form class="space-y-6" @submit.prevent="updateProfile">
                <div>
                  <UFormGroup label="Full Name" name="fullName">
                    <UInput v-model="form.fullName" placeholder="Enter your full name" />
                  </UFormGroup>
                </div>

                <div>
                  <UFormGroup label="Email Address" name="email">
                    <UInput v-model="form.email" type="email" disabled class="bg-gray-50000" />
                    <template #help>
                      <span class="text-sm text-gray-500">
                        Email cannot be changed. Contact support if you need to update it.
                      </span>
                    </template>
                  </UFormGroup>
                </div>

                <div class="flex justify-end">
                  <UButton type="submit" :loading="profileLoading" :disabled="profileLoading">
                    Update Profile
                  </UButton>
                </div>
              </form>
            </div>

            <UDivider class="my-8" />

            <!-- Password Settings -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900">Password</h2>

              <form class="space-y-6" @submit.prevent="updatePassword">
                <div>
                  <UFormGroup label="Current Password" name="currentPassword" required>
                    <UInput
                      v-model="passwordForm.currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      required
                    />
                  </UFormGroup>
                </div>

                <div>
                  <UFormGroup label="New Password" name="newPassword" required>
                    <UInput
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      required
                    />
                  </UFormGroup>
                </div>

                <div>
                  <UFormGroup label="Confirm New Password" name="confirmPassword" required>
                    <UInput
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      required
                    />
                  </UFormGroup>
                </div>

                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    :loading="passwordLoading"
                    :disabled="passwordLoading || !isPasswordFormValid"
                  >
                    Update Password
                  </UButton>
                </div>
              </form>
            </div>

            <UDivider class="my-8" />

            <!-- Account Linking -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900">Connected Accounts</h2>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div class="flex items-center">
                    <UIcon name="i-simple-icons-google" class="h-5 w-5 text-red-500" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">Google</p>
                      <p class="text-sm text-gray-500">
                        {{ connectedAccounts.google ? 'Connected' : 'Not connected' }}
                      </p>
                    </div>
                  </div>
                  <UButton
                    variant="outline"
                    size="sm"
                    :loading="linkingLoading === 'google'"
                    @click="toggleAccountConnection('google')"
                  >
                    {{ connectedAccounts.google ? 'Disconnect' : 'Connect' }}
                  </UButton>
                </div>

                <div
                  class="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div class="flex items-center">
                    <UIcon name="i-simple-icons-github" class="h-5 w-5 text-gray-900" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">GitHub</p>
                      <p class="text-sm text-gray-500">
                        {{ connectedAccounts.github ? 'Connected' : 'Not connected' }}
                      </p>
                    </div>
                  </div>
                  <UButton
                    variant="outline"
                    size="sm"
                    :loading="linkingLoading === 'github'"
                    @click="toggleAccountConnection('github')"
                  >
                    {{ connectedAccounts.github ? 'Disconnect' : 'Connect' }}
                  </UButton>
                </div>
              </div>
            </div>

            <UDivider class="my-8" />

            <!-- Danger Zone -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-red-600">Danger Zone</h2>

              <div class="rounded-lg border border-red-200 p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-red-900">Delete Account</h3>
                    <p class="text-sm text-red-700">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <UButton color="red" variant="outline" @click="showDeleteConfirm = true">
                    Delete Account
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium text-gray-900">Delete Account</h3>
        </template>

        <div class="py-4">
          <p class="mb-4 text-sm text-gray-500">
            Are you sure you want to delete your account? This action cannot be undone and will
            permanently delete all your data.
          </p>

          <UFormGroup label="Type 'DELETE' to confirm" name="deleteConfirm" required>
            <UInput v-model="deleteConfirmText" placeholder="DELETE" required />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton variant="outline" @click="showDeleteConfirm = false"> Cancel </UButton>
            <UButton
              color="red"
              :disabled="deleteConfirmText !== 'DELETE'"
              :loading="deleteLoading"
              @click="deleteAccount"
            >
              Delete Account
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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

const profileLoading = ref(false)
const passwordLoading = ref(false)
const linkingLoading = ref<string | null>(null)
const deleteLoading = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')

const form = reactive({
  fullName: '',
  email: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const connectedAccounts = ref({
  google: false,
  github: false,
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordForm.newPassword.length >= 6
  )
})

const updateProfile = async () => {
  try {
    profileLoading.value = true

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.fullName || null,
      })
      .eq('id', user.value.id)

    if (error) throw error

    toast.add({
      title: 'Success!',
      description: 'Profile updated successfully',
      color: 'green',
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      color: 'red',
    })
  } finally {
    profileLoading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({
      title: 'Error',
      description: 'New passwords do not match',
      color: 'red',
    })
    return
  }

  try {
    passwordLoading.value = true

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    })

    if (error) throw error

    toast.add({
      title: 'Success!',
      description: 'Password updated successfully',
      color: 'green',
    })

    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update password',
      color: 'red',
    })
  } finally {
    passwordLoading.value = false
  }
}

const toggleAccountConnection = async (provider: 'google' | 'github') => {
  try {
    linkingLoading.value = provider

    if (connectedAccounts.value[provider]) {
      // Disconnect account
      const { error } = await supabase.auth.unlink({
        provider,
      })

      if (error) throw error

      connectedAccounts.value[provider] = false
      toast.add({
        title: 'Success!',
        description: `${provider} account disconnected`,
        color: 'green',
      })
    } else {
      // Connect account
      const { error } = await supabase.auth.linkIdentity({
        provider,
      })

      if (error) throw error
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description:
        error.message ||
        `Failed to ${connectedAccounts.value[provider] ? 'disconnect' : 'connect'} ${provider}`,
      color: 'red',
    })
  } finally {
    linkingLoading.value = null
  }
}

const deleteAccount = async () => {
  try {
    deleteLoading.value = true

    // Delete user profile and related data
    const { error } = await supabase.from('profiles').delete().eq('id', user.value.id)

    if (error) throw error

    // Sign out and redirect
    await supabase.auth.signOut()

    toast.add({
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted',
      color: 'green',
    })

    await router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete account',
      color: 'red',
    })
  } finally {
    deleteLoading.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(async () => {
  if (user.value) {
    // Load profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (profile) {
      form.fullName = profile.full_name || ''
      form.email = profile.email
    }

    // Check connected accounts
    const identities = user.value.identities || []
    connectedAccounts.value.google = identities.some(i => i.provider === 'google')
    connectedAccounts.value.github = identities.some(i => i.provider === 'github')
  }
})
</script>
