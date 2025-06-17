import { adminService } from '~/server/services/adminService'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  // Use the new role-based authentication
  await requireAdmin(event)

  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 50

    const result = await adminService.getFeedback(page, limit)
    return result
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch feedback',
    })
  }
})
