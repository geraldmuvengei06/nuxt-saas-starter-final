import { adminRepository } from '~/server/repositories/adminRepository'
// import { serverSupabaseClient } from '#supabase/server'

export const adminService = {
  async getSystemStats() {
    return await adminRepository.getSystemStats()
  },

  async getAllUsers(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const [users, totalCount] = await Promise.all([
      adminRepository.getAllUsers(limit, offset),
      adminRepository.getUsersCount(),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  },
  async getAllTeams(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const [teams, totalCount] = await Promise.all([
      adminRepository.getAllTeams(limit, offset),
      adminRepository.getTeamsCount(),
    ])

    return {
      teams,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  },
  async getAllSubscriptions(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const [subscriptions, totalCount] = await Promise.all([
      adminRepository.getAllSubscriptions(limit, offset),
      adminRepository.getSubscriptionsCount(),
    ])

    return {
      subscriptions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  },
  async deleteUser(userId: string, adminId: string) {
    // Prevent admin from deleting themselves
    if (userId === adminId) {
      throw new Error('Cannot delete your own account')
    }

    // Log the activity
    await adminRepository.createActivityLog({
      userId: adminId,
      action: 'user_deleted',
      entityType: 'user',
      entityId: userId,
      description: `Admin deleted user ${userId}`,
    })

    return await adminRepository.deleteUser(userId)
  },

  async deleteTeam(teamId: string) {
    // Log the activity
    await adminRepository.createActivityLog({
      action: 'team_deleted',
      entityType: 'team',
      entityId: teamId,
      description: `Team ${teamId} was deleted`,
    })

    return await adminRepository.deleteTeam(teamId)
  },

  async getFeedback(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const [feedback, totalCount] = await Promise.all([
      adminRepository.getFeedback(limit, offset),
      adminRepository.getFeedbackCount(),
    ])

    return {
      feedback,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  },
  async updateFeedbackStatus(feedbackId: string, status: 'pending' | 'reviewed' | 'resolved') {
    // Log the activity
    await adminRepository.createActivityLog({
      action: 'feedback_status_updated',
      entityType: 'feedback',
      entityId: feedbackId,
      description: `Feedback ${feedbackId} status updated to ${status}`,
      metadata: { newStatus: status },
    })

    return await adminRepository.updateFeedbackStatus(feedbackId, status)
  },

  async getActivityLogs(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const logs = await adminRepository.getActivityLogs(limit, offset)

    return {
      logs,
      pagination: {
        page,
        limit,
        totalCount: logs.length, // Note: This should be actual total count in production
        totalPages: Math.ceil(logs.length / limit),
      },
    }
  }, // Helper method to check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await adminRepository.getUserProfile(userId)
      return profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  },

  // Helper method to check if user is super admin
  async isSuperAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await adminRepository.getUserProfile(userId)
      return profile?.role === 'SUPER_ADMIN'
    } catch (error) {
      console.error('Error checking super admin status:', error)
      return false
    }
  },

  // Update user role (only super admins can do this)
  async updateUserRole(userId: string, newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN', adminId: string) {
    // Prevent admin from changing their own role
    if (userId === adminId) {
      throw new Error('Cannot change your own role')
    }

    // Log the activity
    await adminRepository.createActivityLog({
      userId: adminId,
      action: 'user_role_updated',
      entityType: 'user',
      entityId: userId,
      description: `User role updated to ${newRole}`,
      metadata: { newRole },
    })

    return await adminRepository.updateUserRole(userId, newRole)
  },
}
