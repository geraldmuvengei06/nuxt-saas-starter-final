import { z } from 'zod'
import { teamService } from '~/server/services/teamService'

const addMemberSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  role: z.enum(['member', 'admin']).default('member'),
})

const updateMemberSchema = z.object({
  role: z.enum(['member', 'admin', 'owner']),
})

export default defineEventHandler(async event => {
  try {
    const user = await getServerSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    const teamId = getRouterParam(event, 'id')
    if (!teamId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Team ID is required',
      })
    }

    if (isMethod(event, 'POST')) {
      // Add member to team
      const body = await readBody(event)
      const validatedData = addMemberSchema.parse(body)

      const member = await teamService.addMember(
        teamId,
        validatedData.profileId,
        validatedData.role,
        user.id
      )
      return member
    }

    if (isMethod(event, 'DELETE')) {
      // Remove member from team
      const query = getQuery(event)
      const profileId = query.profileId as string

      if (!profileId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Profile ID is required',
        })
      }

      await teamService.removeMember(teamId, profileId, user.id)
      return { message: 'Member removed successfully' }
    }

    if (isMethod(event, 'PUT')) {
      // Update member role
      const query = getQuery(event)
      const profileId = query.profileId as string

      if (!profileId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Profile ID is required',
        })
      }

      const body = await readBody(event)
      const validatedData = updateMemberSchema.parse(body)

      const member = await teamService.updateMemberRole(
        teamId,
        profileId,
        validatedData.role,
        user.id
      )
      return member
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Validation error',
      })
    }

    if (error instanceof Error && !('statusCode' in error)) {
      // Convert regular Error to createError
      const statusCode =
        error.message.includes('Access denied') || error.message.includes('Only team')
          ? 403
          : error.message.includes('already a member') || error.message.includes('Invalid role')
            ? 400
            : error.message.includes('Cannot remove') || error.message.includes('Cannot change')
              ? 400
              : 500
      throw createError({
        statusCode,
        statusMessage: error.message,
      })
    }

    throw error
  }
})
