import { prisma } from '~/lib/prisma'

export const adminRepository = {
  async getAllUsers(limit = 50, offset = 0) {
    return await prisma.profile.findMany({
      take: limit,
      skip: offset,
      include: {
        subscription: true,
        projects: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        teamMembers: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            teamMembers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
  async getUsersCount() {
    return await prisma.profile.count()
  },

  async getTeamsCount() {
    return await prisma.team.count()
  },

  async getProjectsCount() {
    return await prisma.project.count()
  },

  async getSubscriptionsCount() {
    return await prisma.subscription.count()
  },

  async getFeedbackCount() {
    return await prisma.feedback.count()
  },

  async getSystemStats() {
    const [usersCount, teamsCount, projectsCount, subscriptionsCount] = await Promise.all([
      prisma.profile.count(),
      prisma.team.count(),
      prisma.project.count(),
      prisma.subscription.count({
        where: {
          status: 'active',
        },
      }),
    ])

    return {
      usersCount,
      teamsCount,
      projectsCount,
      subscriptionsCount,
    }
  },

  async getAllTeams(limit = 50, offset = 0) {
    return await prisma.team.findMany({
      take: limit,
      skip: offset,
      include: {
        members: {
          include: {
            profile: {
              select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getAllProjects(limit = 50, offset = 0) {
    return await prisma.project.findMany({
      take: limit,
      skip: offset,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getAllSubscriptions(limit = 50, offset = 0) {
    return await prisma.subscription.findMany({
      take: limit,
      skip: offset,
      include: {
        profile: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async deleteUser(userId: string) {
    // First delete all related data due to cascade rules
    await prisma.profile.delete({
      where: { id: userId },
    })
  },

  async deleteTeam(teamId: string) {
    await prisma.team.delete({
      where: { id: teamId },
    })
  },

  async deleteProject(projectId: string) {
    await prisma.project.delete({
      where: { id: projectId },
    })
  },
  async updateUserRole(_userId: string, _role: 'user' | 'admin') {
    // Note: You'll need to add a role field to the Profile model
    // For now, this is a placeholder
    throw new Error('User roles not implemented yet. Add role field to Profile model.')
  },

  async impersonateUser(_adminId: string, _userId: string) {
    // Note: This would require additional implementation for session management
    // For now, this is a placeholder
    throw new Error('User impersonation not implemented yet.')
  },
  async getActivityLogs(limit = 100, offset = 0) {
    try {
      return await prisma.activityLog.findMany({
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (err) {
      // If ActivityLog table doesn't exist yet, return empty array
      console.warn('ActivityLog table not found, returning empty array', err)
      return []
    }
  },

  async createActivityLog(data: {
    userId?: string
    action: string
    entityType?: string
    entityId?: string
    description?: string
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
  }) {
    try {
      return await prisma.activityLog.create({
        data,
      })
    } catch (err) {
      // If ActivityLog table doesn't exist yet, ignore
      console.warn('ActivityLog table not found, skipping log creation', err)
      return null
    }
  },

  async getFeedback(limit = 50, offset = 0) {
    return await prisma.feedback.findMany({
      take: limit,
      skip: offset,
      include: {
        profile: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async updateFeedbackStatus(feedbackId: string, status: 'pending' | 'reviewed' | 'resolved') {
    return await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
    })
  },
}
