<template>
  <div
    class="bg-gray-50000 flex min-h-screen items-center justify-center px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('auth.forgotPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('auth.forgotPassword.subtitle') }}
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="sendResetLink">
          <div>
            <UFormGroup :label="$t('auth.forgotPassword.email')" name="email" required>
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.login.enterEmail')"
                required
              />
            </UFormGroup>
          </div>

          <UButton
            type="submit"
            block
            :loading="loading"
            :disabled="loading || !form.email"
            class="w-full"
          >
            {{ $t('auth.forgotPassword.sendLink') }}
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-primary-600 hover:text-primary-500 text-sm font-medium">
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
  middleware: 'guest',
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const toast = useToast()

const loading = ref(false)
const form = ref({
  email: '',
})

const sendResetLink = async () => {
  if (!form.value.email) return

  loading.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(form.value.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    toast.add({
      title: t('auth.messages.resetLinkSent'),
      description: t('auth.messages.checkEmail'),
      color: 'green',
    })

    // Clear form
    form.value.email = ''
  } catch (error: any) {
    toast.add({
      title: t('auth.messages.resetLinkError'),
      description: error.message,
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
