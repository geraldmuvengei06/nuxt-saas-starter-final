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

  const feedbackId = getRouterParam(event, 'id')
  if (!feedbackId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Feedback ID is required',
    })
  }

  const method = getMethod(event)

  try {
    if (method === 'PATCH') {
      const body = await readBody(event)
      const { status } = body

      if (!status || !['pending', 'reviewed', 'resolved'].includes(status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Valid status is required (pending, reviewed, resolved)',
        })
      }

      const updatedFeedback = await adminService.updateFeedbackStatus(feedbackId, status)
      return { success: true, feedback: updatedFeedback }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process feedback request',
    })
  }
})
