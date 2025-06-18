// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: true },

  // Nuxt UI v3 handles CSS automatically
  // No need for css: ['~/assets/css/main.css'] anymore

  // Nuxt UI v3 configuration
  ui: {
    colorMode: {
      preference: 'system'
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,

    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
  compatibilityDate: '2025-05-15',

  typescript: {
    strict: false,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
        flag: '🇺🇸',
      },
      {
        code: 'es',
        language: 'es-ES',
        name: 'Español',
        file: 'es.json',
        flag: '🇪🇸',
      },
      {
        code: 'fr',
        language: 'fr-FR',
        name: 'Français',
        file: 'fr.json',
        flag: '🇫🇷',
      },
      {
        code: 'de',
        language: 'de-DE',
        name: 'Deutsch',
        file: 'de.json',
        flag: '🇩🇪',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/en', '/es', '/de', '/fr', '/register', '/forgot-password', '/reset-password', 'confirm', '/pricing', '/about', '/contact', '/features'], // Exclude marketing/public pages
    },
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css',
  },
})
