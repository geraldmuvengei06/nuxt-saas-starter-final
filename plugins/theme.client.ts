export default defineNuxtPlugin({
  name: 'theme-initializer',
  enforce: 'default', // Changed from 'pre' to default
  async setup(nuxtApp) {
    // Wait until app is mounted to ensure Pinia is ready
    await nuxtApp.isHydrating

    // Import and use the store inside a function to be called after Pinia is ready
    const initializeTheme = async () => {
      const { $pinia } = useNuxtApp()

      if (!$pinia) {
        console.warn('Pinia not available yet, skipping theme initialization')
        return
      }

      // Use dynamic import instead of require (which is not available in ESM)
      const themeModule = await import('~/store/theme')
      const themeStore = themeModule.useThemeStore($pinia)
      themeStore.initialize()

      // Set app config based on theme store
      const appConfig = useAppConfig()
      appConfig.ui = {
        ...appConfig.ui,
        colors: {
          ...appConfig.ui?.colors,
          primary: themeStore.color,
        },
      }
    }

    // Check if we're on the client-side using import.meta.client
    if (import.meta.client) {
      if (document.readyState === 'complete') {
        initializeTheme()
      } else {
        // Wait for DOM to be ready
        window.addEventListener('load', () => {
          initializeTheme()
        })
      }
    }

    return {}
  },
})
