import { useThemeStore } from '~/store/theme'

export function useTheme() {
  // Safe wrapper around the theme store
  let themeStore: ReturnType<typeof useThemeStore> | null = null

  try {
    themeStore = useThemeStore()
  } catch (error) {
    console.warn('Theme store not available yet, returning default values')
  }

  const getThemeColor = () => themeStore?.color || 'green'
  const getThemeRadius = () => themeStore?.radius || 'md'
  const getColorMode = () => themeStore?.colorMode || 'system'

  const setThemeColor = (color: string) => {
    if (themeStore) {
      themeStore.setColor(color as any)
    }
  }

  const setThemeRadius = (radius: string) => {
    if (themeStore) {
      themeStore.setRadius(radius as any)
    }
  }

  const setColorMode = (mode: 'light' | 'dark' | 'system') => {
    if (themeStore) {
      themeStore.setColorMode(mode)
    }
  }

  const initializeTheme = () => {
    if (themeStore) {
      themeStore.initialize()
    }
  }

  return {
    getThemeColor,
    getThemeRadius,
    getColorMode,
    setThemeColor,
    setThemeRadius,
    setColorMode,
    initializeTheme,
    themeStore,
  }
}
