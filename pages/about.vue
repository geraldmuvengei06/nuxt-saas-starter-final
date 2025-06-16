<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          About SaaS Starter
        </h1>
        <p
          class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
        >
          Building the future of SaaS development with modern tools and best practices.
        </p>
      </div>
    </div>

    <!-- Mission Section -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div class="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Mission</h2>
          <p class="mt-3 max-w-3xl text-lg text-gray-500">
            We believe that building a SaaS application shouldn't require months of setup and
            configuration. Our starter kit provides everything you need to launch your SaaS business
            quickly and efficiently.
          </p>
          <div class="mt-8 sm:flex">
            <div class="rounded-md shadow">
              <NuxtLink to="/register">
                <UButton size="lg"> Get Started </UButton>
              </NuxtLink>
            </div>
            <div class="mt-3 sm:ml-3 sm:mt-0">
              <NuxtLink to="/pricing">
                <UButton variant="outline" size="lg"> View Pricing </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="mt-8 lg:mt-0">
          <div class="rounded-lg bg-gray-100 p-8">
            <div class="text-center">
              <h3 class="mb-4 text-2xl font-bold text-gray-900">Built With Modern Tech</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <UIcon
                    name="i-simple-icons-nuxtdotjs"
                    class="mx-auto mb-2 h-8 w-8 text-green-500"
                  />
                  <p class="text-sm font-medium">Nuxt 3</p>
                </div>
                <div class="text-center">
                  <UIcon
                    name="i-simple-icons-typescript"
                    class="mx-auto mb-2 h-8 w-8 text-blue-500"
                  />
                  <p class="text-sm font-medium">TypeScript</p>
                </div>
                <div class="text-center">
                  <UIcon
                    name="i-simple-icons-supabase"
                    class="mx-auto mb-2 h-8 w-8 text-green-600"
                  />
                  <p class="text-sm font-medium">Supabase</p>
                </div>
                <div class="text-center">
                  <UIcon
                    name="i-simple-icons-stripe"
                    class="mx-auto mb-2 h-8 w-8 text-indigo-500"
                  />
                  <p class="text-sm font-medium">Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="text-center">
            <div
              class="bg-primary-500 mx-auto flex h-12 w-12 items-center justify-center rounded-md text-white"
            >
              <UIcon name="i-heroicons-rocket-launch" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Fast Setup</h3>
            <p class="mt-2 text-base text-gray-500">
              Get your SaaS up and running in minutes, not months. Pre-configured with all essential
              features.
            </p>
          </div>

          <div class="mt-10 text-center lg:mt-0">
            <div
              class="bg-primary-500 mx-auto flex h-12 w-12 items-center justify-center rounded-md text-white"
            >
              <UIcon name="i-heroicons-shield-check" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Security First</h3>
            <p class="mt-2 text-base text-gray-500">
              Built with security best practices including Row-Level Security and proper
              authentication flows.
            </p>
          </div>

          <div class="mt-10 text-center lg:mt-0">
            <div
              class="bg-primary-500 mx-auto flex h-12 w-12 items-center justify-center rounded-md text-white"
            >
              <UIcon name="i-heroicons-code-bracket" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Developer Experience</h3>
            <p class="mt-2 text-base text-gray-500">
              Modern development tools and practices with TypeScript, ESLint, and automated testing.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Built by developers, for developers
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            We understand the challenges of building SaaS applications because we've been there.
            That's why we created this comprehensive starter kit.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
