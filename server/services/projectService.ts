import { ProjectRepository } from '~/server/repositories/projectRepository'

const projectRepository = new ProjectRepository()

export class ProjectService {
  async getUserProjects(userId: string) {
    return await projectRepository.findByUserId(userId)
  }

  async getProject(id: string, userId: string) {
    const project = await projectRepository.findById(id, userId)

    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      })
    }

    return project
  }

  async createProject(data: {
    name: string
    description?: string
    ownerId: string
    teamId?: string
  }) {
    // Validate required fields
    if (!data.name?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project name is required',
      })
    }

    return await projectRepository.create({
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    })
  }

  async updateProject(
    id: string,
    userId: string,
    data: {
      name?: string
      description?: string
    }
  ) {
    // Check if project exists and belongs to user
    await this.getProject(id, userId)

    // Validate data
    if (data.name !== undefined && !data.name.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project name cannot be empty',
      })
    }

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description?.trim() || null

    return await projectRepository.update(id, updateData)
  }

  async deleteProject(id: string, userId: string) {
    // Check if project exists and belongs to user
    await this.getProject(id, userId)

    const result = await projectRepository.delete(id, userId)

    if (result.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      })
    }

    return result
  }

  async getUserProjectsCount(userId: string) {
    return await projectRepository.countByUserId(userId)
  }
}
