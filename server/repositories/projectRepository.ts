import { prisma } from '~/lib/prisma'

export class ProjectRepository {
  async findByUserId(userId: string) {
    return await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string, userId: string) {
    return await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    })
  }

  async create(data: { name: string; description?: string; ownerId: string; teamId?: string }) {
    return await prisma.project.create({
      data,
    })
  }

  async update(
    id: string,
    data: {
      name?: string
      description?: string
    }
  ) {
    return await prisma.project.update({
      where: { id },
      data,
    })
  }

  async delete(id: string, userId: string) {
    return await prisma.project.deleteMany({
      where: {
        id,
        ownerId: userId,
      },
    })
  }

  async countByUserId(userId: string) {
    return await prisma.project.count({
      where: {
        ownerId: userId,
      },
    })
  }
}
