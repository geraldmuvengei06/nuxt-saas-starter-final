import { z } from 'zod'
import { ProjectService } from '~/server/services/projectService'
import { serverSupabaseUser } from '#supabase/server'

const projectService = new ProjectService()

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  teamId: z.string().optional(),
})

export default defineEventHandler(async event => {
  try {
    // Check authentication
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (event.node.req.method === 'GET') {
      // Get user's projects
      const projects = await projectService.getUserProjects(user.id)
      return { projects }
    }

    if (event.node.req.method === 'POST') {
      // Create new project
      const body = await readBody(event)
      const validatedData = createProjectSchema.parse(body)

      const project = await projectService.createProject({
        ...validatedData,
        ownerId: user.id,
      })

      return { project }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error: any) {
    console.error('Projects API error:', error)

    if (error.data?.issues) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request data',
        data: error.data.issues,
      })
    }

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
})
