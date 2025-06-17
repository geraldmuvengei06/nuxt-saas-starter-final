import { adminService } from '~/server/services/adminService'
import { requireSuperAdmin, getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  try {
    // Only super admins can change user roles
    await requireSuperAdmin(event)
    const admin = await getCurrentUser(event)

    if (!admin) {
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

    const body = await readBody(event)
    const { role } = body

    if (!role || !['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid role is required (USER, ADMIN, SUPER_ADMIN)',
      })
    }

    const result = await adminService.updateUserRole(userId, role, admin.id)

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('Error updating user role:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update user role',
    })
  }
})
