<script setup lang="ts">
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()

// Define navigation items - renamed from links to items for NavigationMenu
const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
]
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-heroicons-cube" class="text-primary-500 size-8" />
        <span class="font-semibold text-lg">SaaS Starter</span>
      </NuxtLink>
    </template>

    <template #center>
      <!-- Replaced HorizontalNavigation with NavigationMenu -->
      <UNavigationMenu :items="navigationItems" orientation="horizontal" />
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <!-- Theme Switcher -->
        <ThemeSwitcher />

        <!-- Auth buttons -->
        <template v-if="!user">
          <UButton to="/login" variant="ghost"> Log in </UButton>
          <UButton to="/register"> Sign up </UButton>
        </template>
        <template v-else>
          <!-- Changed from Dropdown to DropdownMenu -->
          <UDropdownMenu
            :items="[
              { label: 'Dashboard', to: '/dashboard', icon: 'i-heroicons-home' },
              { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' },
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
        </template>
      </div>
    </template>
  </UHeader>
</template>
