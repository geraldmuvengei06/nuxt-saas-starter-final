import { adminService } from '~/server/services/adminService'

export default defineEventHandler(async event => {
  try {
    const user = await getServerSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    // Check if user is admin (for demo purposes, we'll allow all authenticated users)
    // In production, implement proper admin role checking
    const isAdmin = await adminService.isAdmin(user.id)
    if (!isAdmin && !user.email?.includes('admin')) {
      // Simple demo check
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required',
      })
    }

    if (isMethod(event, 'GET')) {
      const stats = await adminService.getSystemStats()
      return stats
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error) {
    if (error instanceof Error && !('statusCode' in error)) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }
    throw error
  }
})
