<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Everything you need to launch
        </h1>
        <p
          class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
        >
          A comprehensive SaaS starter kit with all the features you need to build and scale your
          business.
        </p>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in features" :key="feature.name" class="relative">
          <div class="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg">
            <div>
              <span class="bg-primary-50 text-primary-600 inline-flex rounded-lg p-3">
                <UIcon :name="feature.icon" class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true" />
                {{ feature.name }}
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                {{ feature.description }}
              </p>
            </div>
            <div class="mt-4">
              <div class="flex items-center">
                <UIcon
                  :name="
                    feature.status === 'available'
                      ? 'i-heroicons-check-circle'
                      : 'i-heroicons-clock'
                  "
                  :class="feature.status === 'available' ? 'text-green-500' : 'text-yellow-500'"
                  class="mr-2 h-4 w-4"
                />
                <span
                  :class="feature.status === 'available' ? 'text-green-600' : 'text-yellow-600'"
                  class="text-xs font-medium"
                >
                  {{ feature.status === 'available' ? 'Available' : 'Coming Soon' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary-600">
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16"
      >
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="text-primary-200 block">Launch your SaaS today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <NuxtLink to="/register">
              <UButton color="white" size="lg"> Get started for free </UButton>
            </NuxtLink>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <NuxtLink to="/pricing">
              <UButton variant="outline" color="white" size="lg"> View pricing </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const features = [
  {
    name: 'Authentication System',
    description:
      'Complete authentication with email/password, social logins, magic links, and more.',
    icon: 'i-heroicons-key',
    status: 'available',
  },
  {
    name: 'Payment Processing',
    description: 'Stripe integration with subscriptions, billing portal, and webhook handling.',
    icon: 'i-heroicons-credit-card',
    status: 'available',
  },
  {
    name: 'Database & ORM',
    description: 'Supabase backend with Prisma ORM and Row-Level Security policies.',
    icon: 'i-heroicons-server',
    status: 'available',
  },
  {
    name: 'User Dashboard',
    description: 'Complete user dashboard with project management and account settings.',
    icon: 'i-heroicons-squares-2x2',
    status: 'available',
  },
  {
    name: 'Responsive Design',
    description: 'Beautiful, mobile-first design using Tailwind CSS and Nuxt UI components.',
    icon: 'i-heroicons-device-phone-mobile',
    status: 'available',
  },
  {
    name: 'Type Safety',
    description: 'Full TypeScript support with strict type checking and auto-completion.',
    icon: 'i-heroicons-code-bracket',
    status: 'available',
  },
  {
    name: 'Team Management',
    description: 'Multi-tenant architecture with team invitations and role-based access.',
    icon: 'i-heroicons-users',
    status: 'coming-soon',
  },
  {
    name: 'Admin Dashboard',
    description: 'Super admin panel for user management, analytics, and system monitoring.',
    icon: 'i-heroicons-chart-bar',
    status: 'coming-soon',
  },
  {
    name: 'API Documentation',
    description: 'Auto-generated API documentation with OpenAPI/Swagger integration.',
    icon: 'i-heroicons-document-text',
    status: 'coming-soon',
  },
  {
    name: 'Email Templates',
    description: 'Beautiful email templates for transactional emails and notifications.',
    icon: 'i-heroicons-envelope',
    status: 'coming-soon',
  },
  {
    name: 'Analytics & Metrics',
    description: 'Built-in analytics dashboard with user engagement and business metrics.',
    icon: 'i-heroicons-chart-pie',
    status: 'coming-soon',
  },
  {
    name: 'File Storage',
    description: 'Integrated file upload and storage with Supabase Storage or AWS S3.',
    icon: 'i-heroicons-cloud-arrow-up',
    status: 'coming-soon',
  },
  {
    name: 'Real-time Features',
    description: 'WebSocket support for real-time notifications and live updates.',
    icon: 'i-heroicons-bolt',
    status: 'coming-soon',
  },
  {
    name: 'Testing Suite',
    description: 'Comprehensive testing setup with unit tests, integration tests, and E2E tests.',
    icon: 'i-heroicons-beaker',
    status: 'available',
  },
  {
    name: 'CI/CD Pipeline',
    description: 'GitHub Actions workflow for automated testing, building, and deployment.',
    icon: 'i-heroicons-cog-6-tooth',
    status: 'coming-soon',
  },
  {
    name: 'SEO Optimization',
    description: 'Built-in SEO optimization with meta tags, sitemaps, and structured data.',
    icon: 'i-heroicons-magnifying-glass',
    status: 'available',
  },
]
</script>
