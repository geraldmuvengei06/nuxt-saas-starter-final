<template>
  <div
    class="bg-gray-50000 flex min-h-screen items-center justify-center px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('auth.resetPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('auth.resetPassword.subtitle') }}
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="updatePassword">
          <div>
            <UFormGroup :label="$t('auth.resetPassword.password')" name="password" required>
              <UInput
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.resetPassword.enterNewPassword')"
                required
                minlength="8"
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup
              :label="$t('auth.resetPassword.confirmPassword')"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="form.confirmPassword"
                type="password"
                :placeholder="$t('auth.resetPassword.confirmNewPassword')"
                required
                minlength="8"
              />
            </UFormGroup>
          </div>

          <UButton
            type="submit"
            class="w-full"
            :loading="loading"
            :disabled="
              loading ||
              !form.password ||
              !form.confirmPassword ||
              form.password !== form.confirmPassword
            "
            class="w-full"
          >
            {{ $t('auth.resetPassword.updatePassword') }}
          </UButton>

          <div
            v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword"
            class="text-center text-sm text-red-500"
          >
            {{ $t('forms.passwordsDoNotMatch') }}
          </div>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-primary hover:text-primary/80 text-sm font-medium">
            {{ $t('auth.forgotPassword.backToLogin') }}
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const form = ref({
  password: '',
  confirmPassword: '',
})

const updatePassword = async () => {
  if (!form.value.password || !form.value.confirmPassword) return

  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      title: t('forms.passwordsDoNotMatch'),
      color: 'red',
    })
    return
  }

  if (form.value.password.length < 8) {
    toast.add({
      title: t('forms.passwordTooShort'),
      color: 'red',
    })
    return
  }

  loading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: form.value.password,
    })

    if (error) throw error

    toast.add({
      title: t('auth.messages.passwordUpdateSuccess'),
      description: t('auth.messages.redirectingToDashboard'),
      color: 'green',
    })

    // Redirect to dashboard after successful password reset
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (error: any) {
    toast.add({
      title: t('auth.messages.passwordUpdateError'),
      description: error.message,
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
