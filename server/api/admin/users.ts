import { adminService } from '~/server/services/adminService'
import { requireAdmin, getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  try {
    // Use the new role-based authentication
    await requireAdmin(event)
    const user = await getCurrentUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    if (isMethod(event, 'GET')) {
      const query = getQuery(event)
      const page = Number(query.page) || 1
      const limit = Number(query.limit) || 50

      const result = await adminService.getAllUsers(page, limit)
      return result
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
