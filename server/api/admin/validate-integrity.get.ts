import { userManagementService } from '~/server/services/userManagementService'
import { requireSuperAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
    try {
        await requireSuperAdmin(event)

        const result = await userManagementService.validateUserProfileIntegrity(event)

        return {
            success: result.success,
            issues: result.issues,
            summary: {
                usersWithoutProfiles: result.issues.usersWithoutProfiles.length,
                profilesWithoutUsers: result.issues.profilesWithoutUsers.length,
                syncIssues: result.issues.syncIssues.length,
            },
        }
    } catch (error: any) {
        console.error('Error validating integrity:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to validate user-profile integrity',
        })
    }
})
