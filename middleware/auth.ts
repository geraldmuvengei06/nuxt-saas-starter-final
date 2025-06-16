export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useSupabaseUser()
  const config = useRuntimeConfig()

  // In demo mode, allow access to all pages
  const isDemoMode = config.public.supabaseUrl === 'https://placeholder.supabase.co'

  if (isDemoMode) {
    // In demo mode, simulate being logged in for protected pages
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
