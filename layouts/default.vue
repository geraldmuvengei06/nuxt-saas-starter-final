<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white shadow dark:bg-gray-800 dark:shadow-gray-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <NuxtLink :to="localePath('/')" class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">SaaS Starter</h1>
            </NuxtLink>

            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                :to="localePath('pricing')"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {{ $t('navigation.pricing') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('features')"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {{ $t('navigation.features') }}
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme Switcher -->
            <UiThemeSwitcher />

            <!-- Language Switcher -->
            <UiLanguageSwitcher />

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <UButton
                variant="ghost"
                icon="i-heroicons-bars-3"
                class="text-gray-500 dark:text-gray-300"
                @click="mobileMenuOpen = !mobileMenuOpen"
              />
            </div>

            <template v-if="!user">
              <div class="hidden md:flex md:space-x-2">
                <NuxtLink :to="localePath('login')">
                  <UButton variant="ghost">{{ $t('navigation.signIn') }}</UButton>
                </NuxtLink>
                <NuxtLink :to="localePath('register')">
                  <UButton>{{ $t('navigation.register') }}</UButton>
                </NuxtLink>
              </div>
            </template>
            <template v-else>
              <div class="hidden md:block">
                <NuxtLink :to="localePath('dashboard')">
                  <UButton variant="outline">{{ $t('navigation.dashboard') }}</UButton>
                </NuxtLink>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div
          class="space-y-4 border-t border-gray-200 bg-white px-4 py-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <NuxtLink
            :to="localePath('pricing')"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            {{ $t('navigation.pricing') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('features')"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            {{ $t('navigation.features') }}
          </NuxtLink>

          <div class="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <template v-if="!user">
              <NuxtLink :to="localePath('login')" @click="mobileMenuOpen = false">
                <UButton variant="ghost" class="w-full">{{ $t('navigation.signIn') }}</UButton>
              </NuxtLink>
              <NuxtLink :to="localePath('register')" @click="mobileMenuOpen = false">
                <UButton class="w-full">{{ $t('navigation.register') }}</UButton>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="localePath('dashboard')" @click="mobileMenuOpen = false">
                <UButton variant="outline" class="w-full">{{ $t('navigation.dashboard') }}</UButton>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50000 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div class="col-span-1 md:col-span-2">
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
            >
              SaaS Starter
            </h3>
            <p class="mt-4 text-base text-gray-500 dark:text-gray-400">
              A complete Nuxt 3 SaaS starter kit with everything you need to launch your business.
            </p>
          </div>
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
            >
              Product
            </h3>
            <ul role="list" class="mt-4 space-y-4">
              <li>
                <NuxtLink
                  :to="localePath('pricing')"
                  class="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {{ $t('navigation.pricing') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="localePath('features')"
                  class="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {{ $t('navigation.features') }}
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
            >
              Company
            </h3>
            <ul role="list" class="mt-4 space-y-4">
              <li>
                <NuxtLink
                  :to="localePath('about')"
                  class="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {{ $t('navigation.about') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="localePath('contact')"
                  class="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {{ $t('navigation.contact') }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p class="text-center text-base text-gray-400 dark:text-gray-500">
            &copy; 2025 SaaS Starter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Toast Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const mobileMenuOpen = ref(false)
const localePath = useLocalePath()
const { locales } = useI18n()
const { switchLanguage } = useLanguage()

// Close mobile menu when route changes
watch(
  () => useRoute().path,
  () => {
    mobileMenuOpen.value = false
  }
)

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
