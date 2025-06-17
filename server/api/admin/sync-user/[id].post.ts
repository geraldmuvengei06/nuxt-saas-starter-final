import { userManagementService } from '~/server/services/userManagementService'
import { requireSuperAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
    try {
        await requireSuperAdmin(event)

        const userId = getRouterParam(event, 'id')
        if (!userId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'User ID is required',
            })
        }

        const result = await userManagementService.handleUserRegistration(userId, event)

        if (!result.success) {
            throw createError({
                statusCode: 400,
                statusMessage: result.error || 'User sync failed',
            })
        }

        return {
            success: true,
            user: result.user,
            profile: result.profile,
            action: result.action,
        }
    } catch (error: any) {
        console.error('Error syncing single user:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to sync user',
        })
    }
})
