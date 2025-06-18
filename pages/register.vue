<template>
  <div
    class="bg-gray-50000 flex min-h-screen items-center justify-center px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          {{ $t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('common.or') }}
          <NuxtLink
            to="/login"
            class="text-primary hover:text-primary/80 font-medium"
          >
            {{ $t('auth.register.signIn') }}
          </NuxtLink>
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <UFormGroup :label="$t('auth.register.name')" name="fullName">
              <UInput
                v-model="form.name"
                type="text"
                :placeholder="$t('auth.register.enterName')"
                autocomplete="name"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup
              :label="$t('auth.register.email')"
              name="email"
              required
            >
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.register.enterEmail')"
                autocomplete="email"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup
              :label="$t('auth.register.password')"
              name="password"
              required
            >
              <UInput
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.register.enterPassword')"
                autocomplete="new-password"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup
              :label="$t('auth.register.confirmPassword')"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="form.confirmPassword"
                type="password"
                :placeholder="$t('auth.register.confirmYourPassword')"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UCheckbox
              v-model="form.agreeToTerms"
              label="I agree to the Terms of Service and Privacy Policy"
              required
            />
          </div>

          <UButton
            type="submit"
            class="w-full"
            :loading="form.loading"
            :disabled="form.loading || !isFormValid"
          >
            Create Account
          </UButton>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              :loading="providerLoading === 'google'"
              :disabled="form.loading || providerLoading"
              @click="handleGoogleRegister"
            >
              <Icon name="i-simple-icons-google" class="h-5 w-5" />
              Google
            </UButton>
            <UButton
              variant="outline"
              :loading="providerLoading === 'github'"
              :disabled="form.loading || providerLoading"
              @click="signUpWithProvider('github')"
            >
              <Icon name="i-simple-icons-github" class="h-5 w-5" />
              GitHub
            </UButton>
          </div>
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
const isDemoMode =
  config.public.supabaseUrl === 'https://placeholder.supabase.co'

const loading = ref(false)
const providerLoading = ref<string | null>(null)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  loading: false,
  error: '',
})

const isFormValid = computed(() => {
  return (
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.agreeToTerms
  )
})

const handleRegister = async () => {
  if (isDemoMode) {
    toast.add({
      title: 'Demo Mode',
      description:
        'This is a demo. Please configure Supabase credentials to enable registration.',
      color: 'blue',
    })
    return
  }

  if (form.password !== form.confirmPassword) {
    toast.add({
      title: 'Error',
      description: 'Passwords do not match',
      color: 'red',
    })
    return
  }

  try {
    form.loading = true
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    })

    if (error) {
      form.error = error.message
      toast.add({
        title: 'Registration failed',
        description: error.message,
        color: 'error',
      })
    } else {
      toast.add({
        title: 'Registration successful',
        description: 'Please check your email to verify your account',
        color: 'success',
      })

      await router.push('/login')
    }
  } catch (err) {
    console.error(err)
    form.error = 'An unexpected error occurred'
    toast.add({
      title: 'Registration failed',
      description: 'An unexpected error occurred',
      color: 'error',
    })
  } finally {
    form.loading = false
  }
}

const handleGoogleRegister = async () => {
  try {
    providerLoading.value = 'google'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    })

    if (error) {
      toast.add({
        title: 'Registration failed',
        description: error.message,
        color: 'error',
      })
    }
  } catch (err) {
    console.error(err)
    toast.add({
      title: 'Registration failed',
      description: 'An unexpected error occurred',
      color: 'error',
    })
  } finally {
    providerLoading.value = null
  }
}

const signUpWithProvider = async (provider: 'google' | 'github') => {
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
</script>
