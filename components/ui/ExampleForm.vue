<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: '',
  newsletter: false,
})

const submit = () => {
  // Handle form submission
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <!-- FormGroup is now FormField -->
    <UFormField label="Name" name="name">
      <UInput v-model="form.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="form.email" type="email" />
    </UFormField>

    <UFormField label="Message" name="message">
      <UTextarea v-model="form.message" />
    </UFormField>

    <UFormField name="newsletter">
      <!-- Toggle is now Switch -->
      <USwitch v-model="form.newsletter"> Subscribe to newsletter </USwitch>
    </UFormField>

    <div>
      <UButton type="submit"> Submit </UButton>
    </div>
  </form>
</template>
