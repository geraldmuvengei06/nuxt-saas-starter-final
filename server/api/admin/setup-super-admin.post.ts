import { adminRepository } from '~/server/repositories/adminRepository'
import { requireAuth, getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  try {
    // Require authentication
    await requireAuth(event)
    const user = await getCurrentUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    // Check if any super admin already exists
    const existingSuperAdmins = await adminRepository.getAllUsers(1, 0)
    const hasSuperAdmin = existingSuperAdmins.some((profile: any) => profile.role === 'SUPER_ADMIN')

    if (hasSuperAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Super admin already exists',
      })
    }

    // Make the current user a super admin
    const result = await adminRepository.updateUserRole(user.id, 'SUPER_ADMIN')

    // Log the activity
    await adminRepository.createActivityLog({
      userId: user.id,
      action: 'super_admin_setup',
      entityType: 'user',
      entityId: user.id,
      description: 'Initial super admin setup completed',
    })

    return {
      success: true,
      message: 'Super admin setup completed successfully',
      data: result,
    }
  } catch (error: any) {
    console.error('Error setting up super admin:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to setup super admin',
    })
  }
})
