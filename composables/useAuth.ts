export const useAuth = () => {
  const user = useSupabaseUser()

  const userProfile = ref(null)
  const isLoading = ref(false)

  const fetchUserProfile = async () => {
    if (!user.value) return null

    try {
      isLoading.value = true
      const data = await $fetch('/api/auth/profile')
      userProfile.value = data
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const hasRole = (role: string) => {
    return userProfile.value?.role === role
  }

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(userProfile.value?.role)
  }

  const isAdmin = computed(() => {
    return hasAnyRole(['ADMIN', 'SUPER_ADMIN'])
  })

  const isSuperAdmin = computed(() => {
    return hasRole('SUPER_ADMIN')
  })

  // Auto-fetch profile when user changes
  watch(
    user,
    async newUser => {
      if (newUser) {
        await fetchUserProfile()
      } else {
        userProfile.value = null
      }
    },
    { immediate: true }
  )

  return {
    user,
    userProfile: readonly(userProfile),
    isLoading: readonly(isLoading),
    fetchUserProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
  }
}
