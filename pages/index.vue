<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative z-10 pb-20 pt-14 sm:py-24">
          <div class="mx-auto max-w-4xl text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Build your SaaS faster than ever
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              A complete Nuxt 3 SaaS starter kit with authentication, payments, teams, and more.
              Everything you need to launch your SaaS business.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <UButton size="lg" @click="$router.push('/register')"> Get started </UButton>
              <UButton variant="outline" size="lg" @click="$router.push('/pricing')">
                View pricing
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build a SaaS
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Pre-built components and features to accelerate your development
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.name" class="text-center">
            <div
              class="bg-primary-500 mx-auto flex h-12 w-12 items-center justify-center rounded-md text-white"
            >
              <UIcon :name="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">
              {{ feature.name }}
            </h3>
            <p class="mt-2 text-base text-gray-500">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-600">
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16"
      >
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to dive in?</span>
          <span class="text-primary-200 block">Start your free trial today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <UButton color="white" size="lg" @click="$router.push('/register')">
              Get started
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const features = [
  {
    name: 'Authentication',
    description: 'Complete auth system with social logins, magic links, and 2FA support.',
    icon: 'i-heroicons-key',
  },
  {
    name: 'Payments',
    description: 'Stripe integration with subscriptions, billing portal, and webhooks.',
    icon: 'i-heroicons-credit-card',
  },
  {
    name: 'Teams',
    description: 'Multi-tenant architecture with team management and role-based access.',
    icon: 'i-heroicons-users',
  },
  {
    name: 'Database',
    description: 'Supabase backend with Prisma ORM and Row-Level Security.',
    icon: 'i-heroicons-server',
  },
  {
    name: 'Admin Panel',
    description: 'Super admin dashboard for user management and analytics.',
    icon: 'i-heroicons-chart-bar',
  },
  {
    name: 'Modern Stack',
    description: 'Built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS.',
    icon: 'i-heroicons-code-bracket',
  },
]
</script>
