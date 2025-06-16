import { adminService } from '~/server/services/adminService'
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

    // Check if user is admin (for demo purposes, we'll allow all authenticated users)
    const isAdmin = await adminService.isAdmin(user.id)
    if (!isAdmin && !user.email?.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required',
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
