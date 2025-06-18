<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b">
      <div class="container mx-auto py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-xl">Nuxt SaaS Starter</NuxtLink>
        <ThemeSwitcher />
      </div>
    </header>

    <main class="flex-grow container mx-auto py-8 max-w-md mx-auto">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const { locales } = useI18n()
const { switchLanguage } = useLanguage()
onMounted(() => {
  if (import.meta.client) {
    const savedLocale = localStorage.getItem('preferred-locale')
    if (savedLocale && locales.value.find((l: any) => l.code === savedLocale)) {
      console.log('savedLocale', savedLocale)

      switchLanguage(savedLocale)
    }
  }
})
</script>
