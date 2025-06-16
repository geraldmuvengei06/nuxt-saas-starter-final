import { z } from 'zod'
import { teamService } from '~/server/services/teamService'

const updateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100, 'Team name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
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

    if (isMethod(event, 'GET')) {
      // Get specific team
      const team = await teamService.getTeam(teamId, user.id)
      return team
    }

    if (isMethod(event, 'PUT')) {
      // Update team
      const body = await readBody(event)
      const validatedData = updateTeamSchema.parse(body)

      const team = await teamService.updateTeam(teamId, validatedData, user.id)
      return team
    }

    if (isMethod(event, 'DELETE')) {
      // Delete team
      await teamService.deleteTeam(teamId, user.id)
      return { message: 'Team deleted successfully' }
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
      const statusCode = error.message.includes('Access denied')
        ? 403
        : error.message.includes('not found')
          ? 404
          : error.message.includes('Only team owners')
            ? 403
            : error.message.includes('required')
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
