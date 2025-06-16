<template>
  <div class="bg-gray-50000 min-h-screen dark:bg-gray-900">
    <!-- Top navigation with logo and switchers -->
    <nav class="absolute left-0 right-0 top-0 z-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">SaaS Starter</h1>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme Switcher -->
            <UiThemeSwitcher />

            <!-- Language Switcher -->
            <UiLanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-16">
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
