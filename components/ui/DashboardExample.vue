<script setup lang="ts">
const isSidebarOpen = ref(true)
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
      class="w-64 transition-all duration-300 bg-neutral-100 dark:bg-neutral-800"
      :class="{ '-ml-64': !isSidebarOpen }"
    >
      <div class="p-4">
        <!-- Changed from DashboardSidebarLinks to NavigationMenu -->
        <UNavigationMenu
          orientation="vertical"
          :items="[
            { label: 'Dashboard', to: '/dashboard', icon: 'i-heroicons-home' },
            { label: 'Projects', to: '/projects', icon: 'i-heroicons-folder' },
            { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' },
          ]"
        />
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center">
        <!-- Changed from DashboardNavbarToggle to DashboardSidebarToggle -->
        <UButton
          icon="i-heroicons-bars-3"
          color="neutral"
          variant="ghost"
          @click="isSidebarOpen = !isSidebarOpen"
        />
      </div>

      <div class="p-4 flex-1 overflow-y-auto">
        <!-- Changed from DashboardCard to PageCard -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-medium">Dashboard</h2>
          </template>

          <div>
            <!-- Content here -->
            <p>This is an example of updated dashboard components for Nuxt UI v3.</p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
