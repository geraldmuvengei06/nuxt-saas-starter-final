<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="signUp">
          <div>
            <UFormGroup label="Full Name" name="fullName">
              <UInput v-model="form.fullName" type="text" placeholder="Enter your full name" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Email address" name="email" required>
              <UInput v-model="form.email" type="email" placeholder="Enter your email" required />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Password" name="password" required>
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Create a password"
                required
              />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Confirm Password" name="confirmPassword" required>
              <UInput
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm your password"
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
            block
            :loading="loading"
            :disabled="loading || !isFormValid"
            class="w-full"
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
              :disabled="loading || providerLoading"
              @click="signUpWithProvider('google')"
            >
              <Icon name="i-simple-icons-google" class="h-5 w-5" />
              Google
            </UButton>
            <UButton
              variant="outline"
              :loading="providerLoading === 'github'"
              :disabled="loading || providerLoading"
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
const isDemoMode = config.public.supabaseUrl === 'https://placeholder.supabase.co'

const loading = ref(false)
const providerLoading = ref<string | null>(null)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
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

const signUp = async () => {
  if (isDemoMode) {
    toast.add({
      title: 'Demo Mode',
      description: 'This is a demo. Please configure Supabase credentials to enable registration.',
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
    loading.value = true
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

    if (error) throw error

    toast.add({
      title: 'Success!',
      description: 'Please check your email to verify your account.',
      color: 'green',
    })

    await router.push('/login')
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
