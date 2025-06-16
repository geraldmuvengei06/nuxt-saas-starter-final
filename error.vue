<template>
  <div class="flex min-h-screen flex-col justify-center bg-white py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-gray-200">
          {{ error.statusCode }}
        </h1>
        <h2 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          {{ getErrorTitle(error.statusCode) }}
        </h2>
        <p class="mt-4 text-base text-gray-500">
          {{ error.statusMessage || getErrorMessage(error.statusCode) }}
        </p>
        <div class="mt-6 flex justify-center space-x-4">
          <UButton @click="handleError"> Try again </UButton>
          <UButton variant="outline" @click="$router.push('/')"> Go home </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    data?: any
  }
}

defineProps<ErrorProps>()

const getErrorTitle = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'Page not found'
    case 500:
      return 'Server error'
    case 403:
      return 'Access forbidden'
    case 401:
      return 'Unauthorized'
    default:
      return 'Something went wrong'
  }
}

const getErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return "Sorry, we couldn't find the page you're looking for."
    case 500:
      return "We're experiencing some technical difficulties. Please try again later."
    case 403:
      return "You don't have permission to access this resource."
    case 401:
      return 'You need to sign in to access this page.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

const handleError = () => {
  // Clear error and reload
  clearError({ redirect: '/' })
}
</script>
