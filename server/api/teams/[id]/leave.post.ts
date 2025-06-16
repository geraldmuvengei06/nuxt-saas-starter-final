import { teamService } from '~/server/services/teamService'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  try {
    const user = await serverSupabaseUser(event)

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
      // Leave team
      await teamService.leaveTeam(teamId, user.id)
      return { message: 'Left team successfully' }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error) {
    if (error instanceof Error && !('statusCode' in error)) {
      // Convert regular Error to createError
      const statusCode =
        error.message.includes('Cannot remove') || error.message.includes('last owner') ? 400 : 500
      throw createError({
        statusCode,
        statusMessage: error.message,
      })
    }

    throw error
  }
})
