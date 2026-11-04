import { prisma } from '../config/prisma.js';

export class MaterialRepository {
  static async findAll(filters?: {
    category?: string;
    subCategory?: string;
    search?: string;
    userId?: string;
  }) {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.subCategory) where.subCategory = filters.subCategory;

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { tags: { contains: filters.search } },
      ];
    }

    return prisma.studyMaterial.findMany({
      where,
      include: {
        progressRecords: filters?.userId
          ? {
              where: { userId: filters.userId },
              select: { isCompleted: true, isBookmarked: true },
            }
          : false,
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  static async findById(id: string) {
    return prisma.studyMaterial.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    title: string;
    category: string;
    subCategory?: string;
    contentType: string;
    resourceUrl: string;
    description?: string;
    tags?: string;
    difficulty?: string;
    estimatedMinutes?: number;
    orderIndex?: number;
  }) {
    return prisma.studyMaterial.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.studyMaterial.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.studyMaterial.delete({ where: { id } });
  }

  static async toggleProgress(userId: string, materialId: string, isCompleted: boolean) {
    return prisma.materialProgress.upsert({
      where: {
        userId_materialId: { userId, materialId },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId,
        materialId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  static async toggleBookmark(userId: string, materialId: string) {
    const existing = await prisma.materialProgress.findUnique({
      where: {
        userId_materialId: { userId, materialId },
      },
    });

    const isBookmarked = existing ? !existing.isBookmarked : true;

    return prisma.materialProgress.upsert({
      where: {
        userId_materialId: { userId, materialId },
      },
      update: { isBookmarked },
      create: {
        userId,
        materialId,
        isBookmarked,
      },
    });
  }

  static async getStudentProgressStats(userId: string) {
    const [totalMaterials, completedRecords] = await Promise.all([
      prisma.studyMaterial.count(),
      prisma.materialProgress.count({
        where: { userId, isCompleted: true },
      }),
    ]);

    const percentage =
      totalMaterials > 0 ? (completedRecords / totalMaterials) * 100 : 0;

    return {
      totalMaterials,
      completedCount: completedRecords,
      progressPercentage: Math.round(percentage),
    };
  }
}
