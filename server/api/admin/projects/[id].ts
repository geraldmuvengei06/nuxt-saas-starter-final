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

  const projectId = getRouterParam(event, 'id')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required',
    })
  }

  const method = getMethod(event)

  try {
    if (method === 'DELETE') {
      await adminService.deleteProject(projectId)
      return { success: true, message: 'Project deleted successfully' }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process project request',
    })
  }
})
