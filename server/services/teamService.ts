import { teamRepository } from '~/server/repositories/teamRepository'

export const teamService = {
  async createTeam(data: { name: string; description?: string; ownerId: string }) {
    if (!data.name?.trim()) {
      throw new Error('Team name is required')
    }

    return await teamRepository.create(data)
  },

  async getTeam(id: string, userId: string) {
    const team = await teamRepository.findById(id)

    if (!team) {
      throw new Error('Team not found')
    }

    // Check if user is a member of the team
    const isMember = await teamRepository.isMember(id, userId)
    if (!isMember) {
      throw new Error('Access denied')
    }

    return team
  },

  async getUserTeams(userId: string) {
    return await teamRepository.findByUserId(userId)
  },

  async updateTeam(id: string, data: { name?: string; description?: string }, userId: string) {
    // Check if user is admin or owner
    const isAdminOrOwner = await teamRepository.isAdminOrOwner(id, userId)
    if (!isAdminOrOwner) {
      throw new Error('Only team admins and owners can update team details')
    }

    if (data.name && !data.name.trim()) {
      throw new Error('Team name cannot be empty')
    }

    return await teamRepository.update(id, data)
  },

  async deleteTeam(id: string, userId: string) {
    // Check if user is owner
    const isOwner = await teamRepository.isOwner(id, userId)
    if (!isOwner) {
      throw new Error('Only team owners can delete teams')
    }

    return await teamRepository.delete(id)
  },

  async inviteMember(teamId: string, email: string, role: string = 'member', inviterId: string) {
    // Check if inviter is admin or owner
    const isAdminOrOwner = await teamRepository.isAdminOrOwner(teamId, inviterId)
    if (!isAdminOrOwner) {
      throw new Error('Only team admins and owners can invite members')
    }

    // Validate role
    if (!['member', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be member or admin')
    }

    // TODO: Find user by email and add to team
    // For now, we'll throw an error since we need the profile ID
    throw new Error('Member invitation system not yet implemented. Please use profile ID directly.')
  },

  async addMember(teamId: string, profileId: string, role: string = 'member', adderId: string) {
    // Check if adder is admin or owner
    const isAdminOrOwner = await teamRepository.isAdminOrOwner(teamId, adderId)
    if (!isAdminOrOwner) {
      throw new Error('Only team admins and owners can add members')
    }

    // Validate role
    if (!['member', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be member or admin')
    }

    // Check if user is already a member
    const isMember = await teamRepository.isMember(teamId, profileId)
    if (isMember) {
      throw new Error('User is already a member of this team')
    }

    return await teamRepository.addMember(teamId, profileId, role)
  },

  async removeMember(teamId: string, profileId: string, removerId: string) {
    // Check if remover is admin or owner
    const isAdminOrOwner = await teamRepository.isAdminOrOwner(teamId, removerId)
    if (!isAdminOrOwner && removerId !== profileId) {
      throw new Error('Only team admins, owners, or the member themselves can remove members')
    }

    // Prevent removing the last owner
    const memberRole = await teamRepository.getMemberRole(teamId, profileId)
    if (memberRole === 'owner') {
      const team = await teamRepository.findById(teamId)
      const ownerCount = team?.members.filter((m: any) => m.role === 'owner').length || 0

      if (ownerCount <= 1) {
        throw new Error(
          'Cannot remove the last owner. Transfer ownership first or delete the team.'
        )
      }
    }

    return await teamRepository.removeMember(teamId, profileId)
  },

  async updateMemberRole(teamId: string, profileId: string, role: string, updaterId: string) {
    // Check if updater is owner
    const isOwner = await teamRepository.isOwner(teamId, updaterId)
    if (!isOwner) {
      throw new Error('Only team owners can change member roles')
    }

    // Validate role
    if (!['member', 'admin', 'owner'].includes(role)) {
      throw new Error('Invalid role. Must be member, admin, or owner')
    }

    // Prevent changing own role if last owner
    if (updaterId === profileId && role !== 'owner') {
      const team = await teamRepository.findById(teamId)
      const ownerCount = team?.members.filter((m: any) => m.role === 'owner').length || 0

      if (ownerCount <= 1) {
        throw new Error('Cannot change role of the last owner. Add another owner first.')
      }
    }

    return await teamRepository.updateMemberRole(teamId, profileId, role)
  },

  async leaveTeam(teamId: string, userId: string) {
    return await this.removeMember(teamId, userId, userId)
  },
}
