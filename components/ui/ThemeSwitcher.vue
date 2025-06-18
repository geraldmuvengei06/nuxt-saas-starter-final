<template>
  <UDropdown :items="themeOptions">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-moon-20-solid"
      :aria-label="'Change theme'"
    />

    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <UIcon :name="item.icon" class="h-4 w-4" />
        <span>{{ item.label }}</span>
        <UIcon
          v-if="item.key === colorMode.preference"
          name="i-heroicons-check"
          class="text-primary-500 ml-auto h-4 w-4"
        />
      </div>
    </template>
  </UDropdown>
</template>

<script setup>
const colorMode = useColorMode()

// Define theme options with proper structure
const themeOptions = computed(() => [
  {
    key: 'light',
    label: 'Light',
    icon: 'i-heroicons-sun-20-solid',
    click: () => (colorMode.preference = 'light'),
  },
  {
    key: 'dark',
    label: 'Dark',
    icon: 'i-heroicons-moon-20-solid',
    click: () => (colorMode.preference = 'dark'),
  },
  {
    key: 'system',
    label: 'System',
    icon: 'i-heroicons-computer-desktop-20-solid',
    click: () => (colorMode.preference = 'system'),
  },
])
</script>
