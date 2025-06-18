<template>
  <div
    class="bg-gray-50000 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-800"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>
      </div>

      <UCard>
        <UForm :state="formState" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="your@email.com"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
          </UFormGroup>

          <div class="mt-6">
            <UButton type="submit" block color="primary"> Login </UButton>
          </div>
        </UForm>

        <div class="mt-4 text-center text-sm">
          <p>
            Don't have an account?
            <NuxtLink to="/register" class="text-primary-500 hover:underline">
              Register
            </NuxtLink>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
})

const formState = ref({
  email: '',
  password: '',
})

const onSubmit = async () => {
  try {
    const client = useSupabaseClient()
    await client.auth.signInWithPassword({
      email: formState.value.email,
      password: formState.value.password,
    })
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
