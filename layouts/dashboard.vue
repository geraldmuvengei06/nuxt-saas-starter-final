<template>
  <div class="bg-gray-50000 min-h-screen dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">SaaS Starter</h1>
            </NuxtLink>

            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                to="/dashboard"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
              >
                {{ $t('navigation.dashboard') }}
              </NuxtLink>
              <NuxtLink
                to="/teams"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
              >
                {{ $t('navigation.teams') }}
              </NuxtLink>
              <NuxtLink
                v-if="user?.email?.includes('admin')"
                to="/admin"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
              >
                {{ $t('navigation.admin') }}
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme Switcher -->
            <UiThemeSwitcher />

            <!-- Language Switcher -->
            <UiLanguageSwitcher />

            <!-- User Menu -->
            <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
              <UAvatar
                :src="user?.user_metadata?.avatar_url"
                :alt="user?.user_metadata?.full_name || user?.email"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdown>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Toast Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()

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

const userMenuItems = computed(() => [
  [
    {
      label: user.value?.email || 'User',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: t('navigation.settings'),
      icon: 'i-heroicons-cog-6-tooth',
      click: () => router.push('/settings'),
    },
    {
      label: t('navigation.billing'),
      icon: 'i-heroicons-credit-card',
      click: () => router.push('/billing'),
    },
  ],
  [
    {
      label: t('navigation.signOut'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: async () => {
        await supabase.auth.signOut()
        toast.add({
          title: t('auth.messages.logoutSuccess'),
          description: 'You have been signed out successfully.',
          color: 'green',
        })
        await router.push('/')
      },
    },
  ],
])

const isSidebarOpen = ref(true)

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-heroicons-home' },
  { label: 'Projects', to: '/projects', icon: 'i-heroicons-folder' },
  { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' },
  { label: 'Billing', to: '/billing', icon: 'i-heroicons-credit-card' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <UHeader class="border-b border-neutral-200 dark:border-neutral-800">
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="text-primary-500 size-8" />
          <span class="font-semibold text-lg">SaaS Starter</span>
        </NuxtLink>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <ThemeSwitcher />

          <!-- Using DropdownMenu instead of Dropdown -->
          <UDropdownMenu
            :items="[
              { label: 'Profile', to: '/settings/profile', icon: 'i-heroicons-user-circle' },
              {
                label: 'Logout',
                to: '/api/auth/logout',
                icon: 'i-heroicons-arrow-right-on-rectangle',
              },
            ]"
          >
            <UButton color="neutral" variant="ghost" icon="i-heroicons-user-circle">
              Account
            </UButton>
          </UDropdownMenu>
        </div>
      </template>
    </UHeader>

    <div class="flex flex-1">
      <!-- Sidebar - Using NavigationMenu instead of DashboardSidebarLinks -->
      <aside
        class="w-64 transition-all duration-300 border-r border-neutral-200 dark:border-neutral-800 bg-muted"
        :class="{ '-ml-64': !isSidebarOpen }"
      >
        <div class="p-4">
          <UNavigationMenu orientation="vertical" :items="navigationItems" />
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center">
          <!-- DashboardNavbarToggle is now DashboardSidebarToggle -->
          <UButton
            icon="i-heroicons-bars-3"
            color="neutral"
            variant="ghost"
            @click="isSidebarOpen = !isSidebarOpen"
          />
        </div>

        <div class="p-4 overflow-y-auto flex-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
