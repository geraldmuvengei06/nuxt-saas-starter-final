import { defineStore } from 'pinia'

interface Profile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

interface Subscription {
  id: string
  status: string
  stripePriceId?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<Profile | null>(null)
  const subscription = ref<Subscription | null>(null)
  const loading = ref(false)

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const fetchProfile = async () => {
    if (!user.value) return

    try {
      loading.value = true

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) throw error
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchSubscription = async () => {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('profile_id', user.value.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      subscription.value = data
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user.value) return

    try {
      loading.value = true

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error
      profile.value = data
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const hasActiveSubscription = computed(() => {
    return subscription.value?.status === 'active'
  })

  const isSubscriptionCanceled = computed(() => {
    return subscription.value?.status === 'canceled'
  })

  const subscriptionEndDate = computed(() => {
    if (!subscription.value?.currentPeriodEnd) return null
    return new Date(subscription.value.currentPeriodEnd)
  })

  // Watch for user changes
  watch(
    user,
    async newUser => {
      if (newUser) {
        await Promise.all([fetchProfile(), fetchSubscription()])
      } else {
        profile.value = null
        subscription.value = null
      }
    },
    { immediate: true }
  )

  return {
    profile: readonly(profile),
    subscription: readonly(subscription),
    loading: readonly(loading),
    fetchProfile,
    fetchSubscription,
    updateProfile,
    hasActiveSubscription,
    isSubscriptionCanceled,
    subscriptionEndDate,
  }
})
