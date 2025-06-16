import { prisma } from '~/lib/prisma'

export const teamRepository = {
  async create(data: { name: string; description?: string; ownerId: string }) {
    return await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        members: {
          create: {
            profileId: data.ownerId,
            role: 'owner',
          },
        },
      },
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
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    })
  },

  async findById(id: string) {
    return await prisma.team.findUnique({
      where: { id },
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
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    })
  },

  async findByUserId(userId: string) {
    return await prisma.team.findMany({
      where: {
        members: {
          some: {
            profileId: userId,
          },
        },
      },
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
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    })
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return await prisma.team.update({
      where: { id },
      data,
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
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    })
  },

  async delete(id: string) {
    return await prisma.team.delete({
      where: { id },
    })
  },

  async addMember(teamId: string, profileId: string, role: string = 'member') {
    return await prisma.teamMember.create({
      data: {
        teamId,
        profileId,
        role,
      },
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
    })
  },

  async removeMember(teamId: string, profileId: string) {
    return await prisma.teamMember.delete({
      where: {
        teamId_profileId: {
          teamId,
          profileId,
        },
      },
    })
  },

  async updateMemberRole(teamId: string, profileId: string, role: string) {
    return await prisma.teamMember.update({
      where: {
        teamId_profileId: {
          teamId,
          profileId,
        },
      },
      data: { role },
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
    })
  },

  async getMemberRole(teamId: string, profileId: string) {
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_profileId: {
          teamId,
          profileId,
        },
      },
    })
    return member?.role || null
  },

  async isOwner(teamId: string, profileId: string) {
    const role = await this.getMemberRole(teamId, profileId)
    return role === 'owner'
  },

  async isAdminOrOwner(teamId: string, profileId: string) {
    const role = await this.getMemberRole(teamId, profileId)
    return role === 'owner' || role === 'admin'
  },

  async isMember(teamId: string, profileId: string) {
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_profileId: {
          teamId,
          profileId,
        },
      },
    })
    return !!member
  },
}
