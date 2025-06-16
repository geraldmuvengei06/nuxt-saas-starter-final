export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  const config = useRuntimeConfig()

  // In demo mode, allow access to all pages
  const isDemoMode = config.public.supabaseUrl === 'https://placeholder.supabase.co'

  if (isDemoMode) {
    // In demo mode, simulate being logged in for protected pages
    return
  }

  // Check if this is just a locale change (same path, different locale)
  if (from && to.path.replace(/^\/[a-z]{2}/, '') === from.path.replace(/^\/[a-z]{2}/, '')) {
    // This is just a locale change, don't redirect to login
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
