import { adminService } from '~/server/services/adminService'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  // Check if user is authenticated
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  // Check if user is admin (simple email check for demo)
  if (!user.email?.includes('admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin privileges required',
    })
  }

  const teamId = getRouterParam(event, 'id')
  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required',
    })
  }

  const method = getMethod(event)

  try {
    if (method === 'DELETE') {
      await adminService.deleteTeam(teamId)
      return { success: true, message: 'Team deleted successfully' }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process team request',
    })
  }
})
