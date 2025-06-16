<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Confirming your account...
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please wait while we verify your account.
        </p>
      </div>

      <UCard v-if="loading">
        <div class="flex items-center justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
        </div>
      </UCard>

      <UCard v-else-if="error">
        <div class="py-8 text-center">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="mx-auto mb-4 h-12 w-12 text-red-500"
          />
          <h3 class="mb-2 text-lg font-medium text-gray-900">Verification Failed</h3>
          <p class="mb-4 text-gray-600">
            {{ error }}
          </p>
          <UButton @click="$router.push('/login')"> Back to Login </UButton>
        </div>
      </UCard>

      <UCard v-else>
        <div class="py-8 text-center">
          <UIcon name="i-heroicons-check-circle" class="mx-auto mb-4 h-12 w-12 text-green-500" />
          <h3 class="mb-2 text-lg font-medium text-gray-900">Account Verified!</h3>
          <p class="mb-4 text-gray-600">
            Your account has been successfully verified. Redirecting to dashboard...
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const { error: authError } = await supabase.auth.exchangeCodeForSession(
      route.query.code as string
    )

    if (authError) throw authError

    toast.add({
      title: 'Welcome!',
      description: 'Your account has been verified successfully.',
      color: 'green',
    })

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err: any) {
    error.value = err.message || 'An error occurred during verification'
  } finally {
    loading.value = false
  }
})
</script>
