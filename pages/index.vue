<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-emerald-100 via-green-200 to-transparent dark:from-emerald-900 dark:via-green-800 dark:to-transparent"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative z-10 pb-20 pt-14 sm:py-24">
          <div class="mx-auto max-w-4xl text-center">
            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
              {{ $t('home.hero.title') }}
            </h1>
            <p class="mt-6 text-lg leading-8">
              {{ $t('home.hero.subtitle') }}
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <UButton size="lg" @click="$router.push('/register')">
                {{ $t('home.hero.getStarted') }}
              </UButton>
              <UButton
                variant="outline"
                size="lg"
                @click="$router.push('/pricing')"
              >
                {{ $t('home.hero.viewPricing') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50000 py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ $t('home.features.title') }}
          </h2>
          <p class="mt-4 text-lg">
            {{ $t('home.features.subtitle') }}
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.name"
            class="text-center"
          >
            <div
              class="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-md text-white"
            >
              <UIcon :name="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium">
              {{ $t(feature.name) }}
            </h3>
            <p class="mt-2 text-base">
              {{ $t(feature.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary">
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16"
      >
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span class="block">{{ $t('home.cta.title') }}</span>
          <span class="text-primary/20 block">{{
            $t('home.cta.subtitle')
          }}</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <UButton color="white" size="lg" @click="$router.push('/register')">
              {{ $t('home.cta.getStarted') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Section -->
    <section class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Welcome to Nuxt SaaS Starter</h1>
          <p class="mb-6">
            A production-ready starter kit for your next SaaS project.
          </p>
        </div>

        <div class="flex gap-4 justify-center">
          <UButton to="/register" color="primary"> Get Started </UButton>
          <UButton to="/login" color="gray" variant="outline"> Login </UButton>
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
    name: 'home.features.authentication.name',
    description: 'home.features.authentication.description',
    icon: 'i-heroicons-key',
  },
  {
    name: 'home.features.payments.name',
    description: 'home.features.payments.description',
    icon: 'i-heroicons-credit-card',
  },
  {
    name: 'home.features.teams.name',
    description: 'home.features.teams.description',
    icon: 'i-heroicons-users',
  },
  {
    name: 'home.features.database.name',
    description: 'home.features.database.description',
    icon: 'i-heroicons-server',
  },
  {
    name: 'home.features.admin.name',
    description: 'home.features.admin.description',
    icon: 'i-heroicons-chart-bar',
  },
  {
    name: 'home.features.stack.name',
    description: 'home.features.stack.description',
    icon: 'i-heroicons-code-bracket',
  },
]
</script>
