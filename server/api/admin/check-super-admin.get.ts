import { adminRepository } from '~/server/repositories/adminRepository'

export default defineEventHandler(async event => {
  try {
    console.log('event', event)
    // Check if any super admin exists
    const users = await adminRepository.getAllUsers(100, 0) // Get first 100 users
    const hasSuperAdmin = users.some((user: any) => user.role === 'SUPER_ADMIN')

    return {
      exists: hasSuperAdmin,
    }
  } catch (error: any) {
    console.error('Error checking super admin status:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check super admin status',
    })
  }
})
