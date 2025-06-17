import { requireSuperAdmin } from '~/server/utils/auth'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async event => {
    try {
        await requireSuperAdmin(event)

        const profileId = getRouterParam(event, 'id')
        if (!profileId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Profile ID is required',
            })
        }

        const supabase = await serverSupabaseServiceRole()

        // First verify this is actually an orphaned profile
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profileId)

        if (user) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Profile is not orphaned - corresponding auth user exists',
            })
        }

        // Delete the orphaned profile
        const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', profileId)

        if (deleteError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Failed to delete profile: ${deleteError.message}`,
            })
        }

        // Log the deletion
        await supabase
            .from('activity_logs')
            .insert({
                user_id: null,
                action: 'orphaned_profile_deleted',
                entity_type: 'profile',
                entity_id: profileId,
                description: `Orphaned profile ${profileId} deleted by admin`,
            })

        return {
            success: true,
            message: `Orphaned profile ${profileId} has been deleted`,
        }
    } catch (error: any) {
        console.error('Error deleting orphaned profile:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete orphaned profile',
        })
    }
})
