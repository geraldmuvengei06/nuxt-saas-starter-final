import { z } from 'zod'
import { teamService } from '~/server/services/teamService'

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
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

    if (isMethod(event, 'GET')) {
      // Get user's teams
      const teams = await teamService.getUserTeams(user.id)
      return teams
    }

    if (isMethod(event, 'POST')) {
      // Create new team
      const body = await readBody(event)
      const validatedData = createTeamSchema.parse(body)

      const team = await teamService.createTeam({
        ...validatedData,
        ownerId: user.id,
      })

      return team
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
