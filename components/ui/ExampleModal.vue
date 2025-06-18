<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <!-- Updated modal implementation -->
    <UModal v-model:open="isOpen" title="Example Modal">
      <UButton @click="isOpen = true"> Open Modal </UButton>

      <!-- Content is now inside template #content -->
      <template #content>
        <!-- Using #header, #body, #footer slots -->
        <template #header>
          <div class="text-xl font-bold">Modal Title</div>
        </template>

        <template #body>
          <p>This is the modal content updated for Nuxt UI v3.</p>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="soft" @click="isOpen = false"> Cancel </UButton>
            <UButton @click="isOpen = false"> Confirm </UButton>
          </div>
        </template>
      </template>
    </UModal>
  </div>
</template>
