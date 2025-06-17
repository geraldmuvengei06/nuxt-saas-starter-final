import { profileSyncService } from '~/server/services/profileSyncService'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async event => {
    try {
        await requireAuth(event)

        const result = await profileSyncService.syncCurrentUserProfile(event)

        if (!result.success) {
            throw createError({
                statusCode: 400,
                statusMessage: result.error || 'Profile sync failed',
            })
        }

        return {
            success: true,
            profile: result.profile,
            action: result.action,
        }
    } catch (error: any) {
        console.error('Error syncing profile:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to sync profile',
        })
    }
})
