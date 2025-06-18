import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-console': 'off',

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',

      // General rules
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-unused-vars': 'off', // Handled by TypeScript
    },
  },

  // TypeScript specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },

  // Nuxt 3 specific rules
  {
    files: ['pages/**/*.vue', 'layouts/**/*.vue', 'app.vue', 'error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off', // Nuxt pages can be single word
    },
  },

  // Server-side files
  {
    files: ['server/**/*.ts'],
    rules: {
      'no-console': 'off', // Allow console in server files
    },
  },

  // Tailwind CSS rules
  {
    files: ['**/*.vue', '**/*.html'],
    rules: {
      // Tailwind specific rules would go here if using eslint-plugin-tailwindcss
      // For now, we'll rely on Prettier + Tailwind prettier plugin for formatting
    },
  },
).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
