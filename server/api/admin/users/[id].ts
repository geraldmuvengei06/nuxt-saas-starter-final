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

    const userId = getRouterParam(event, 'id')
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      })
    }

    // Check if user is admin
    const isAdmin = await adminService.isAdmin(user.id)
    if (!isAdmin && !user.email?.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required',
      })
    }

    if (isMethod(event, 'DELETE')) {
      await adminService.deleteUser(userId, user.id)
      return { message: 'User deleted successfully' }
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
