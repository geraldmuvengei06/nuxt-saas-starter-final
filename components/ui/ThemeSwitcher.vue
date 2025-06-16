<template>
  <UDropdown :items="themeMenuItems" :popper="{ placement: 'bottom-start' }">
    <UButton
      variant="ghost"
      color="gray"
      :icon="currentTheme.icon"
      class="h-8 w-8"
      :aria-label="t('theme.selectTheme')"
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

<script setup lang="ts">
const { t } = useI18n()
const { colorMode, themeOptions, currentTheme, setTheme } = useTheme()

const themeMenuItems = computed(() => [
  themeOptions.map(theme => ({
    ...theme,
    label: t(`theme.${theme.key}`),
    click: () => setTheme(theme.key),
  })),
])
</script>
