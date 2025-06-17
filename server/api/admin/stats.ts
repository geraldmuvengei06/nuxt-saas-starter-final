import { adminService } from '~/server/services/adminService'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  try {
    // Use the new role-based authentication
    await requireAdmin(event)

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
