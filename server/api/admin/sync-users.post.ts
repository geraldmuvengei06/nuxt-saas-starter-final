import { userManagementService } from '~/server/services/userManagementService'
import { requireSuperAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
    try {
        await requireSuperAdmin(event)

        const result = await userManagementService.bulkSyncUsers(event)

        return {
            success: result.success,
            results: result.results,
        }
    } catch (error: any) {
        console.error('Error in bulk sync:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to perform bulk sync',
        })
    }
})
