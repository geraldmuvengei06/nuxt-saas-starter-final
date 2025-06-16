<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-lg md:grid md:max-w-none md:grid-cols-2 md:gap-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">Get in touch</h2>
          <div class="mt-3">
            <p class="text-lg text-gray-500">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div class="mt-9">
            <div class="flex">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-phone" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3 text-base text-gray-500">
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="mt-6 flex">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-envelope" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3 text-base text-gray-500">
                <p>support@saas-starter.com</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 sm:mt-16 md:mt-0">
          <h2 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">Send us a message</h2>
          <div class="mt-9">
            <form class="grid grid-cols-1 gap-y-6" @submit.prevent="submitForm">
              <div>
                <UFormGroup label="Name" name="name" required>
                  <UInput v-model="form.name" placeholder="Your name" required />
                </UFormGroup>
              </div>

              <div>
                <UFormGroup label="Email" name="email" required>
                  <UInput v-model="form.email" type="email" placeholder="your@email.com" required />
                </UFormGroup>
              </div>

              <div>
                <UFormGroup label="Message" name="message" required>
                  <UTextarea
                    v-model="form.message"
                    rows="4"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </UFormGroup>
              </div>

              <div>
                <UButton type="submit" block :loading="loading" :disabled="loading">
                  Send Message
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const toast = useToast()
const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitForm = async () => {
  try {
    loading.value = true

    // Submit feedback to API
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
      },
    })

    toast.add({
      title: 'Message sent!',
      description: "Thanks for contacting us. We'll get back to you soon.",
      color: 'green',
    })

    // Reset form
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to send message. Please try again.',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
