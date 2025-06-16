export const useLanguage = () => {
  const { locale, locales, setLocale } = useI18n()

  const availableLocales = computed(() =>
    locales.value.map((locale: any) => ({
      code: locale.code,
      name: locale.name,
      flag: locale.flag || getCountryFlag(locale.code),
    }))
  )

  const currentLocale = computed(() => availableLocales.value.find(l => l.code === locale.value))

  const switchLanguage = async (newLocale: string) => {
    try {
      await setLocale(newLocale as any)

      // Store preference in localStorage
      if (import.meta.client) {
        localStorage.setItem('preferred-locale', newLocale)
      }
    } catch (error) {
      console.error('Error switching language:', error)
    }
  }

  const getCountryFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
    }
    return flags[code] || '🇺🇸'
  }

  // Initialize preferred locale from localStorage
  // onMounted(() => {
  //     if (import.meta.client) {
  //         const savedLocale = localStorage.getItem('preferred-locale')
  //         if (savedLocale && locales.value.find((l: any) => l.code === savedLocale)) {
  //             console.log("savedLocale", savedLocale);

  //             switchLanguage(savedLocale)
  //         }
  //     }
  // })

  return {
    locale,
    locales,
    availableLocales,
    currentLocale,
    switchLanguage,
    setLocale,
  }
}
