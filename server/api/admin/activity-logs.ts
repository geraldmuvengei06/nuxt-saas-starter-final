import { adminService } from '~/server/services/adminService'

export default defineEventHandler(async event => {
  // Check if user is authenticated
  const user = await getServerSupabaseUser(event)
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

  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 50

    const result = await adminService.getActivityLogs(page, limit)
    return result
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch activity logs',
    })
  }
})
