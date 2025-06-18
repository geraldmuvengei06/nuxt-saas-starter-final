<template>
  <div
    class="bg-gray-50000 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-800"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('common.or') }}
          <NuxtLink to="/register" class="text-primary hover:text-primary/80 font-medium">
            {{ $t('auth.login.createAccount') }}
          </NuxtLink>
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="signIn">
          <div>
            <UFormGroup :label="$t('auth.login.email')" name="email" required>
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.login.enterEmail')"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup :label="$t('auth.login.password')" name="password" required>
              <UInput
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.login.enterPassword')"
                required
              />
            </UFormGroup>
          </div>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="form.rememberMe" :label="$t('auth.login.rememberMe')" />
            <NuxtLink
              to="/forgot-password"
              class="text-primary hover:text-primary/80 text-sm font-medium"
            >
              {{ $t('auth.login.forgotPassword') }}
            </NuxtLink>
          </div>

          <UButton type="submit" class="w-full" :loading="loading" :disabled="loading">
            {{ $t('auth.login.signIn') }}
          </UButton>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">{{
                $t('auth.login.orContinueWith')
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              :loading="providerLoading === 'google'"
              :disabled="loading || providerLoading"
              @click="signInWithProvider('google')"
            >
              <UIcon name="i-simple-icons-google" class="h-5 w-5" />
              {{ $t('auth.login.google') }}
            </UButton>
            <UButton
              variant="outline"
              :loading="providerLoading === 'github'"
              :disabled="loading || providerLoading"
              @click="signInWithProvider('github')"
            >
              <Icon name="i-simple-icons-github" class="h-5 w-5" />
              {{ $t('auth.login.github') }}
            </UButton>
          </div>

          <UButton
            variant="outline"
            class="w-full"
            :loading="magicLinkLoading"
            :disabled="loading || !form.email"
            @click="signInWithMagicLink"
          >
            {{ $t('auth.login.sendMagicLink') }}
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig()

// Check if we're in demo mode
const isDemoMode = config.public.supabaseUrl === 'https://placeholder.supabase.co'

const loading = ref(false)
const providerLoading = ref<string | null>(null)
const magicLinkLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const signIn = async () => {
  if (isDemoMode) {
    toast.add({
      title: 'Demo Mode',
      description:
        'This is a demo. Please configure Supabase credentials to enable authentication.',
      color: 'blue',
    })
    return
  }

  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) throw error

    toast.add({
      title: 'Success!',
      description: 'Welcome back!',
      color: 'green',
    })

    await router.push('/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const signInWithProvider = async (provider: 'google' | 'github') => {
  if (isDemoMode) {
    toast.add({
      title: 'Demo Mode',
      description: 'Social authentication requires Supabase configuration.',
      color: 'blue',
    })
    return
  }

  try {
    providerLoading.value = provider
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    })

    if (error) throw error
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red',
    })
  } finally {
    providerLoading.value = null
  }
}

const signInWithMagicLink = async () => {
  if (isDemoMode) {
    toast.add({
      title: 'Demo Mode',
      description: 'Magic link authentication requires Supabase configuration.',
      color: 'blue',
    })
    return
  }

  try {
    magicLinkLoading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    })

    if (error) throw error

    toast.add({
      title: 'Magic link sent!',
      description: 'Check your email for the login link.',
      color: 'green',
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red',
    })
  } finally {
    magicLinkLoading.value = false
  }
}
</script>
