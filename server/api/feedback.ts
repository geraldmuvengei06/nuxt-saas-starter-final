import { prisma } from '~/lib/prisma'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  const method = getMethod(event)

  if (method === 'GET') {
    // Get all feedback (public endpoint for testing)
    try {
      const feedback = await prisma.feedback.findMany({
        include: {
          profile: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      })

      return { feedback }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Failed to fetch feedback',
      })
    }
  }

  if (method === 'POST') {
    // Create new feedback
    try {
      const body = await readBody(event)
      const { name, email, message } = body

      if (!message) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Message is required',
        })
      }

      // Get user if authenticated
      const user = await serverSupabaseUser(event)
      const profileId = user?.id || null

      const feedback = await prisma.feedback.create({
        data: {
          profileId,
          name: profileId ? undefined : name,
          email: profileId ? undefined : email,
          message,
          status: 'pending',
        },
        include: {
          profile: profileId
            ? {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  avatarUrl: true,
                },
              }
            : false,
        },
      })

      return { success: true, feedback }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Failed to create feedback',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
