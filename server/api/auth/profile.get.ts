import { requireAuth, getUserProfile } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  try {
    await requireAuth(event)

    const profile = await getUserProfile(event)



    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profile not found',
      })
    }

    return profile
  } catch (error: any) {
    console.error('Error fetching user profile:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch profile',
    })
  }
})
