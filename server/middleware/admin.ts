import { isAdmin } from '../utils/auth'

export default defineEventHandler(async event => {
  // Only apply to admin routes
  if (!event.node.req.url?.startsWith('/api/admin')) {
    return
  }

  try {
    const adminAccess = await isAdmin(event)
    if (!adminAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required',
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
