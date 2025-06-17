import type { H3Event } from 'h3'
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { profileSyncService, type ProfileSyncResult } from './profileSyncService'
import { getClientIP, getHeader } from '~/server/utils/request'

export interface UserLifecycleResult {
    success: boolean
    user?: any
    profile?: any
    error?: string
    action: 'created' | 'updated' | 'deleted' | 'restored' | 'failed'
}

/**
 * Service for coordinating user lifecycle events
 */
export class UserManagementService {
    /**
     * Handle user registration completion
     */
    async handleUserRegistration(userId: string, event?: H3Event): Promise<UserLifecycleResult> {
        try {
            const supabase = event
                ? await serverSupabaseServiceRole(event)
                : await serverSupabaseServiceRole()

            // Get the user from auth
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)

            if (userError || !user) {
                return {
                    success: false,
                    error: `User not found: ${userError?.message}`,
                    action: 'failed',
                }
            }

            // Sync the profile
            const syncResult = await profileSyncService.syncProfile(user, event)

            if (!syncResult.success) {
                return {
                    success: false,
                    error: `Profile sync failed: ${syncResult.error}`,
                    action: 'failed',
                }
            }

            // Log successful registration
            await this.logUserActivity(
                userId,
                'user_registration_completed',
                'user',
                userId,
                'User registration and profile creation completed',
                event,
            )

            return {
                success: true,
                user,
                profile: syncResult.profile,
                action: 'created',
            }
        }
        catch (error: any) {
            console.error('Error in handleUserRegistration:', error)
            return {
                success: false,
                error: error.message,
                action: 'failed',
            }
        }
    }

    /**
     * Handle user metadata updates
     */
    async handleUserUpdate(userId: string, updates: Record<string, any>, event?: H3Event): Promise<UserLifecycleResult> {
        try {
            const supabase = event
                ? await serverSupabaseServiceRole(event)
                : await serverSupabaseServiceRole()

            // Update user metadata in auth
            const { data: { user }, error: updateError } = await supabase.auth.admin.updateUserById(
                userId,
                { user_metadata: updates },
            )

            if (updateError || !user) {
                return {
                    success: false,
                    error: `User update failed: ${updateError?.message}`,
                    action: 'failed',
                }
            }

            // Sync the updated profile
            const syncResult = await profileSyncService.syncProfile(user, event)

            if (!syncResult.success) {
                return {
                    success: false,
                    error: `Profile sync failed: ${syncResult.error}`,
                    action: 'failed',
                }
            }

            // Log the update
            await this.logUserActivity(
                userId,
                'user_profile_updated',
                'user',
                userId,
                'User profile updated and synchronized',
                event,
            )

            return {
                success: true,
                user,
                profile: syncResult.profile,
                action: 'updated',
            }
        }
        catch (error: any) {
            console.error('Error in handleUserUpdate:', error)
            return {
                success: false,
                error: error.message,
                action: 'failed',
            }
        }
    }

    /**
     * Handle user deletion with proper cleanup
     */
    async handleUserDeletion(userId: string, event?: H3Event): Promise<UserLifecycleResult> {
        try {
            const supabase = event
                ? await serverSupabaseServiceRole(event)
                : await serverSupabaseServiceRole()

            // First, get user data for logging
            const { data: { user } } = await supabase.auth.admin.getUserById(userId)

            // Log the deletion before it happens
            await this.logUserActivity(
                userId,
                'user_deletion_initiated',
                'user',
                userId,
                'User deletion process initiated',
                event,
            )

            // Handle profile cleanup (this will trigger the database cascade)
            await profileSyncService.handleUserDeletion(userId, event)

            // Delete user from auth (this will trigger our database triggers)
            const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

            if (deleteError) {
                return {
                    success: false,
                    error: `User deletion failed: ${deleteError.message}`,
                    action: 'failed',
                }
            }

            return {
                success: true,
                user,
                action: 'deleted',
            }
        }
        catch (error: any) {
            console.error('Error in handleUserDeletion:', error)
            return {
                success: false,
                error: error.message,
                action: 'failed',
            }
        }
    }

    /**
     * Handle user restoration (if user was soft-deleted)
     */
    async handleUserRestoration(userId: string, event?: H3Event): Promise<UserLifecycleResult> {
        try {
            const supabase = event
                ? await serverSupabaseServiceRole(event)
                : await serverSupabaseServiceRole()

            // Get the user
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)

            if (userError || !user) {
                return {
                    success: false,
                    error: `User not found: ${userError?.message}`,
                    action: 'failed',
                }
            }

            // Ensure profile exists and is synced
            const syncResult = await profileSyncService.syncProfile(user, event)

            if (!syncResult.success) {
                return {
                    success: false,
                    error: `Profile restoration failed: ${syncResult.error}`,
                    action: 'failed',
                }
            }

            // Log the restoration
            await this.logUserActivity(
                userId,
                'user_restored',
                'user',
                userId,
                'User account restored and profile synchronized',
                event,
            )

            return {
                success: true,
                user,
                profile: syncResult.profile,
                action: 'restored',
            }
        }
        catch (error: any) {
            console.error('Error in handleUserRestoration:', error)
            return {
                success: false,
                error: error.message,
                action: 'failed',
            }
        }
    }

    /**
     * Bulk synchronization of existing users
     */
    async bulkSyncUsers(event?: H3Event): Promise<{ success: boolean, results: { synced: number, errors: number, details: string[] } }> {
        try {
            const details: string[] = []

            // Sync all users
            const syncResult = await profileSyncService.syncAllUsers(event)

            details.push(`Synced ${syncResult.synced} users successfully`)
            if (syncResult.errors > 0) {
                details.push(`Failed to sync ${syncResult.errors} users`)
            }

            // Retry failed syncs
            const retryResult = await profileSyncService.retryFailedSyncs(event)
            if (retryResult.retried > 0) {
                details.push(`Retried and synced ${retryResult.retried} previously failed users`)
            }

            // Log the bulk sync operation
            await this.logUserActivity(
                'system',
                'bulk_user_sync',
                'system',
                'bulk_sync',
                `Bulk sync completed: ${syncResult.synced} synced, ${syncResult.errors} errors, ${retryResult.retried} retried`,
                event,
            )

            return {
                success: true,
                results: {
                    synced: syncResult.synced + retryResult.retried,
                    errors: syncResult.errors,
                    details,
                },
            }
        }
        catch (error: any) {
            console.error('Error in bulkSyncUsers:', error)
            return {
                success: false,
                results: {
                    synced: 0,
                    errors: 1,
                    details: [`Bulk sync failed: ${error.message}`],
                },
            }
        }
    }

    /**
     * Validate user-profile integrity
     */
    async validateUserProfileIntegrity(event?: H3Event): Promise<{
        success: boolean
        issues: {
            usersWithoutProfiles: string[]
            profilesWithoutUsers: string[]
            syncIssues: string[]
        }
    }> {
        try {
            const supabase = event
                ? await serverSupabaseServiceRole(event)
                : await serverSupabaseServiceRole()

            const issues = {
                usersWithoutProfiles: [] as string[],
                profilesWithoutUsers: [] as string[],
                syncIssues: [] as string[],
            }

            // Get all auth users
            const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
            if (usersError) {
                throw new Error(`Failed to fetch users: ${usersError.message}`)
            }

            // Get all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, email')

            if (profilesError) {
                throw new Error(`Failed to fetch profiles: ${profilesError.message}`)
            }

            const userIds = new Set(users.users.map(u => u.id))
            const profileIds = new Set((profiles || []).map(p => p.id))

            // Find users without profiles
            for (const user of users.users) {
                if (!profileIds.has(user.id)) {
                    issues.usersWithoutProfiles.push(user.id)
                }
            }

            // Find profiles without users
            for (const profile of profiles || []) {
                if (!userIds.has(profile.id)) {
                    issues.profilesWithoutUsers.push(profile.id)
                }
            }

            // Check for email mismatches
            for (const user of users.users) {
                const profile = (profiles || []).find(p => p.id === user.id)
                if (profile && profile.email !== user.email) {
                    issues.syncIssues.push(`User ${user.id}: email mismatch (auth: ${user.email}, profile: ${profile.email})`)
                }
            }

            return {
                success: true,
                issues,
            }
        }
        catch (error: any) {
            console.error('Error in validateUserProfileIntegrity:', error)
            return {
                success: false,
                issues: {
                    usersWithoutProfiles: [],
                    profilesWithoutUsers: [],
                    syncIssues: [`Validation failed: ${error.message}`],
                },
            }
        }
    }

    /**
     * Log user activity for audit trail
     */
    private async logUserActivity(
        userId: string,
        action: string,
        entityType: string,
        entityId: string,
        description: string,
        event?: H3Event,
    ): Promise<void> {
        try {
            const supabase = event
                ? await serverSupabaseClient(event)
                : await serverSupabaseServiceRole()

            await supabase
                .from('activity_logs')
                .insert({
                    user_id: userId === 'system' ? null : userId,
                    action,
                    entity_type: entityType,
                    entity_id: entityId,
                    description,
                    ip_address: event ? getClientIP(event) : null,
                    user_agent: event ? getHeader(event, 'user-agent') : null,
                })
        }
        catch (error) {
            // Don't throw here as logging shouldn't break the main operation
            console.error('Error logging user activity:', error)
        }
    }
}

// Export singleton instance
export const userManagementService = new UserManagementService()
