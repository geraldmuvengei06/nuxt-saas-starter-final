<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-cube" class="text-primary-500 size-6" />
            <span class="font-semibold">SaaS Starter</span>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            A professional starter kit for building SaaS applications with Nuxt 3 and Supabase.
          </p>
        </div>

        <!-- Changed from FooterLinks to NavigationMenu -->
        <div>
          <h3 class="font-medium mb-4">Resources</h3>
          <UNavigationMenu
            orientation="vertical"
            :items="[
              { label: 'Documentation', to: '/docs' },
              { label: 'Blog', to: '/blog' },
              { label: 'Support', to: '/support' },
            ]"
          />
        </div>

        <div>
          <h3 class="font-medium mb-4">Legal</h3>
          <UNavigationMenu
            orientation="vertical"
            :items="[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Cookie Policy', to: '/cookies' },
            ]"
          />
        </div>
      </div>

      <div
        class="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-400"
      >
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div>© {{ new Date().getFullYear() }} SaaS Starter. All rights reserved.</div>
          <div class="flex gap-4 mt-4 sm:mt-0">
            <a href="#" class="hover:text-primary-500">
              <UIcon name="i-simple-icons-x" class="size-5" />
            </a>
            <a href="#" class="hover:text-primary-500">
              <UIcon name="i-simple-icons-github" class="size-5" />
            </a>
            <a href="#" class="hover:text-primary-500">
              <UIcon name="i-simple-icons-linkedin" class="size-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
