<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'
import { useColorMode } from '#imports'

const { getThemeColor, getThemeRadius, setThemeColor, setThemeRadius, initializeTheme } = useTheme()
const colorMode = useColorMode()

// Initialize theme when component is mounted
onMounted(() => {
  nextTick(() => {
    initializeTheme()
  })
})

const colors = [
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Yellow', value: 'yellow' },
]

const radii = [
  { name: 'None', value: 'none' },
  { name: 'Small', value: 'sm' },
  { name: 'Medium', value: 'md' },
  { name: 'Large', value: 'lg' },
  { name: 'Extra large', value: 'xl' },
]

const changePrimaryColor = (color: string) => {
  setThemeColor(color)
}

const changeRadius = (radius: string) => {
  setThemeRadius(radius)
}

const toggleColorMode = () => {
  const newMode = colorMode.preference === 'light' ? 'dark' : 'light'
  colorMode.preference = newMode
}
</script>

<template>
  <div>
    <!-- Replace UDropdown with UDropdownMenu -->
    <UDropdownMenu :items="[]" :content="{ align: 'end' }">
      <UButton color="neutral" variant="ghost" icon="i-heroicons-paint-brush"> Customize </UButton>

      <template #custom>
        <div class="p-4 min-w-[240px] divide-y divide-neutral-200 dark:divide-neutral-800">
          <!-- Color Selector -->
          <div class="pb-4">
            <h3 class="font-medium text-sm mb-2">Primary Color</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in colors"
                :key="color.value"
                type="button"
                class="w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center"
                :class="`bg-${color.value}-500 hover:ring-2 hover:ring-${color.value}-500/50 hover:ring-offset-1`"
                :title="color.name"
                @click="changePrimaryColor(color.value)"
              >
                <UIcon
                  v-if="getThemeColor() === color.value"
                  name="i-heroicons-check"
                  class="text-white w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Radius Selector -->
          <div class="py-4">
            <h3 class="font-medium text-sm mb-2">Corner Radius</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="r in radii"
                :key="r.value"
                type="button"
                class="px-2.5 py-1.5 text-xs border rounded-md"
                :class="
                  getThemeRadius() === r.value
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                "
                @click="changeRadius(r.value)"
              >
                {{ r.name }}
              </button>
            </div>
          </div>

          <!-- Color Mode Toggle -->
          <div class="pt-4">
            <h3 class="font-medium text-sm mb-2">Color Mode</h3>
            <UColorModeSwitch class="w-full" />
          </div>
        </div>
      </template>
    </UDropdownMenu>
  </div>
</template>
