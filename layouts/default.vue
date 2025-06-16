<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900">SaaS Starter</h1>
            </NuxtLink>

            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                to="/pricing"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Pricing
              </NuxtLink>
              <NuxtLink
                to="/features"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Features
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="!user">
              <NuxtLink to="/login">
                <UButton variant="ghost"> Sign in </UButton>
              </NuxtLink>
              <NuxtLink to="/register">
                <UButton> Get started </UButton>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/dashboard">
                <UButton variant="outline"> Dashboard </UButton>
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
    <footer class="bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">
              SaaS Starter
            </h3>
            <p class="mt-4 text-base text-gray-500">
              A complete Nuxt 3 SaaS starter kit with everything you need to launch your business.
            </p>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Product</h3>
            <ul role="list" class="mt-4 space-y-4">
              <li>
                <NuxtLink to="/pricing" class="text-base text-gray-500 hover:text-gray-900">
                  Pricing
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="text-base text-gray-500 hover:text-gray-900">
                  Features
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Company</h3>
            <ul role="list" class="mt-4 space-y-4">
              <li>
                <NuxtLink to="/about" class="text-base text-gray-500 hover:text-gray-900">
                  About
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-200 pt-8">
          <p class="text-center text-base text-gray-400">
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
</script>
