import { adminRepository } from '~/server/repositories/adminRepository'

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
  async getAllProjects(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit
    const [projects, totalCount] = await Promise.all([
      adminRepository.getAllProjects(limit, offset),
      adminRepository.getProjectsCount(),
    ])

    return {
      projects,
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

  async deleteProject(projectId: string) {
    // Log the activity
    await adminRepository.createActivityLog({
      action: 'project_deleted',
      entityType: 'project',
      entityId: projectId,
      description: `Project ${projectId} was deleted`,
    })

    return await adminRepository.deleteProject(projectId)
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

  async isAdmin(_userId: string): Promise<boolean> {
    // For now, we'll use a simple email-based check
    // In production, you should add a role field to the Profile model

    // You can implement admin checking logic here
    // For demo purposes, we'll assume certain email domains or hardcoded emails are admins

    // Example: Check if user email ends with your company domain
    // const profile = await prisma.profile.findUnique({ where: { id: userId } })
    // return profile?.email?.endsWith('@yourcompany.com') || false

    return false // For now, return false until proper role system is implemented
  },
}
