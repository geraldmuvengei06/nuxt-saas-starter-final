<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      color="gray"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="h-8"
      :aria-label="t('language.selectLanguage')"
    >
      <span class="mr-1">{{ currentLocale?.flag }}</span>
      {{ currentLocale?.name }}
    </UButton>

    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <span>{{ item.flag }}</span>
        <span class="truncate">{{ item.label }}</span>
        <UIcon
          v-if="item.code === currentLocale?.code"
          name="i-heroicons-check"
          class="text-primary-500 ml-auto h-4 w-4"
        />
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
// const { t, locale, locales, setLocale } = useI18n()

// const currentLocale = computed(() =>
//     locales.value.find(l => l.code === locale.value)
// )

// const switchLanguage = async (newLocale: string) => {
//   try {
//     await setLocale(newLocale)
//     // Force refresh to apply locale changes without middleware interference
//     await nextTick()
//   } catch (error) {
//     console.error('Error switching language:', error)
//   }
// }

// const items = computed(() => [
//   locales.value.map(locale => ({
//     label: locale.name,
//     flag: locale.flag,
//     code: locale.code,
//     click: () => switchLanguage(locale.code)
//   }))
// ])
const { t } = useI18n()
const { currentLocale, availableLocales, switchLanguage } = useLanguage()

const items = computed(() => [
  availableLocales.value.map(locale => ({
    label: locale.name,
    flag: locale.flag,
    code: locale.code,
    click: () => switchLanguage(locale.code),
  })),
])
</script>
