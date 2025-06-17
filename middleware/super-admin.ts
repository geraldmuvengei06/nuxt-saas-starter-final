export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $fetch } = useNuxtApp()

    try {
        // Check if user has super admin role
        await $fetch('/api/admin/check-super-admin')
    } catch (error: any) {
        if (error.statusCode === 401) {
            return navigateTo('/login')
        } else if (error.statusCode === 403) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Super Admin access required',
            })
        } else {
            throw createError({
                statusCode: 500,
                statusMessage: 'Authentication check failed',
            })
        }
    }
})
