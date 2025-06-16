<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900">SaaS Starter</h1>
            </NuxtLink>

            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                to="/dashboard"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/projects"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Projects
              </NuxtLink>
              <NuxtLink
                to="/teams"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Teams
              </NuxtLink>
              <NuxtLink
                v-if="user?.email?.includes('admin')"
                to="/admin"
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Admin
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
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

const userMenuItems = [
  [
    {
      label: user.value?.email || 'User',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      click: () => router.push('/settings'),
    },
    {
      label: 'Billing',
      icon: 'i-heroicons-credit-card',
      click: () => router.push('/billing'),
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: async () => {
        await supabase.auth.signOut()
        toast.add({
          title: 'Signed out',
          description: 'You have been signed out successfully.',
          color: 'green',
        })
        await router.push('/')
      },
    },
  ],
]
</script>
