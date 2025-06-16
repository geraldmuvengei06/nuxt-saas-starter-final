export const useTheme = () => {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const isLight = computed(() => colorMode.value === 'light')
  const isSystem = computed(() => colorMode.preference === 'system')

  const themeOptions = [
    {
      key: 'light',
      label: 'Light',
      icon: 'i-heroicons-sun',
    },
    {
      key: 'dark',
      label: 'Dark',
      icon: 'i-heroicons-moon',
    },
    {
      key: 'system',
      label: 'System',
      icon: 'i-heroicons-computer-desktop',
    },
  ]

  const currentTheme = computed(
    () => themeOptions.find(theme => theme.key === colorMode.preference) || themeOptions[0]
  )

  const setTheme = (theme: string) => {
    colorMode.preference = theme
  }

  const toggleTheme = () => {
    if (colorMode.preference === 'light') {
      setTheme('dark')
    } else if (colorMode.preference === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return {
    colorMode,
    isDark,
    isLight,
    isSystem,
    themeOptions,
    currentTheme,
    setTheme,
    toggleTheme,
  }
}
