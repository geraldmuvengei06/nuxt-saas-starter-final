import { isSuperAdmin } from '../utils/auth'

export default defineEventHandler(async event => {
  // Only apply to super admin routes
  if (!event.node.req.url?.startsWith('/api/super-admin')) {
    return
  }

  try {
    const superAdminAccess = await isSuperAdmin(event)
    if (!superAdminAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Super admin access required',
      })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }
})
