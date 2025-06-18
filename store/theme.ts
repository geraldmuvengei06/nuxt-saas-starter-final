import { defineStore } from 'pinia'

type ColorTheme = 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'
type RadiusTheme = 'none' | 'sm' | 'md' | 'lg' | 'xl'

interface ThemeState {
  color: ColorTheme
  radius: RadiusTheme
  colorMode: 'light' | 'dark' | 'system'
  initialized: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    color: 'green',
    radius: 'md',
    colorMode: 'system',
    initialized: false,
  }),

  actions: {
    setColor(color: ColorTheme) {
      this.color = color
      if (import.meta.client) {
        localStorage.setItem('ui-color', color)

        // Update app config dynamically
        const appConfig = useAppConfig()
        if (appConfig.ui) {
          appConfig.ui.colors = {
            ...appConfig.ui.colors,
            primary: color,
          }
        }
      }
    },
    setRadius(radius: RadiusTheme) {
      this.radius = radius
      if (import.meta.client) {
        localStorage.setItem('ui-radius', radius)

        // Apply radius changes with CSS variables
        if (radius === 'none') {
          document.documentElement.style.setProperty('--ui-radius', '0rem')
        } else if (radius === 'sm') {
          document.documentElement.style.setProperty('--ui-radius', '0.25rem')
        } else if (radius === 'md') {
          document.documentElement.style.setProperty('--ui-radius', '0.375rem')
        } else if (radius === 'lg') {
          document.documentElement.style.setProperty('--ui-radius', '0.5rem')
        } else if (radius === 'xl') {
          document.documentElement.style.setProperty('--ui-radius', '0.75rem')
        }
      }
    },
    setColorMode(mode: 'light' | 'dark' | 'system') {
      this.colorMode = mode
      if (import.meta.client) {
        localStorage.setItem('color-mode', mode)
      }
    },
    initialize() {
      // Only run on client and avoid duplicate initialization
      if (import.meta.client && !this.initialized) {
        try {
          const savedColor = localStorage.getItem('ui-color') as ColorTheme
          const savedRadius = localStorage.getItem('ui-radius') as RadiusTheme
          const savedColorMode = localStorage.getItem('color-mode') as 'light' | 'dark' | 'system'

          if (savedColor) this.color = savedColor
          if (savedRadius) this.setRadius(savedRadius)
          if (savedColorMode) this.colorMode = savedColorMode

          this.initialized = true
        } catch (error) {
          console.error('Error initializing theme store:', error)
        }
      }
    },
  },
})
