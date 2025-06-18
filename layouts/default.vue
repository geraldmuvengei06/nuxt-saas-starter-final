<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b">
      <div class="container mx-auto flex items-center justify-between py-4">
        <NuxtLink to="/" class="font-bold text-xl">Nuxt SaaS Starter</NuxtLink>
        <div class="flex items-center gap-4">
          <ThemeSwitcher />
          <UButton to="/login" color="gray" variant="ghost"> Login </UButton>
          <UButton to="/register" color="primary"> Sign Up </UButton>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto py-8">
      <slot />
    </main>

    <footer class="border-t py-8">
      <div class="container mx-auto">
        <p class="text-center text-gray-500">
          © {{ new Date().getFullYear() }} Nuxt SaaS Starter
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No script setup needed for default layout
</script>

<style scoped>
/* Add any default styles for your layout here */
</style>
