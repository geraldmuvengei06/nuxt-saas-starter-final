<script setup lang="ts">
import { useI18n } from '#imports'

const { locale, locales } = useI18n()

const switchLocalePath = (locale: string) => {
  const route = useRoute()
  const router = useRouter()

  // Create a new path with the locale
  let path = route.fullPath

  // Handle default locale (no prefix)
  if (locale === 'en') {
    // Remove any existing locale prefix
    locales.value.forEach((loc) => {
      if (loc.code !== 'en') {
        path = path.replace(new RegExp(`^/${loc.code}`), '')
      }
    })
  } else {
    // Remove any existing locale prefix first
    locales.value.forEach((loc) => {
      if (loc.code !== 'en') {
        path = path.replace(new RegExp(`^/${loc.code}`), '')
      }
    })
    // Add the new locale prefix
    path = `/${locale}${path}`
  }

  return path
}

const availableLocales = computed(() => {
  return locales.value.map((l) => ({
    label: `${l.flag} ${l.name}`,
    value: l.code,
    onClick: () => {
      const path = switchLocalePath(l.code)
      navigateTo(path)
    },
    active: locale.value === l.code,
  }))
})

const currentLocale = computed(() => {
  const loc = locales.value.find((l) => l.code === locale.value)
  return loc ? `${loc.flag} ${loc.name}` : 'Language'
})
</script>

<template>
  <div>
    <!-- Replace UDropdown with UDropdownMenu -->
    <UDropdownMenu :items="availableLocales">
      <UButton color="neutral" variant="ghost" class="gap-1">
        {{ currentLocale }}
        <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>
