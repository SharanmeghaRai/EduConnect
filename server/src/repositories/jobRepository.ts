import { prisma } from '../config/prisma.js';

export class JobRepository {
  static async findAll(filters?: {
    jobType?: string;
    search?: string;
    isVerified?: boolean;
    userId?: string;
  }) {
    const where: any = {
      linkStatus: { not: 'EXPIRED' },
    };

    if (filters?.jobType) where.jobType = filters.jobType;
    if (filters?.isVerified !== undefined) where.isVerified = filters.isVerified;

    if (filters?.search) {
      where.OR = [
        { companyName: { contains: filters.search } },
        { roleTitle: { contains: filters.search } },
        { requiredSkills: { contains: filters.search } },
        { location: { contains: filters.search } },
      ];
    }

    return prisma.jobListing.findMany({
      where,
      include: {
        bookmarks: filters?.userId
          ? {
              where: { userId: filters.userId },
              select: { id: true },
            }
          : false,
        _count: {
          select: { bookmarks: true, reports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string) {
    return prisma.jobListing.findUnique({
      where: { id },
      include: {
        reports: true,
        _count: {
          select: { bookmarks: true },
        },
      },
    });
  }

  static async create(data: {
    companyName: string;
    companyLogo?: string;
    roleTitle: string;
    jobType: string;
    location: string;
    salaryRange: string;
    eligibilityCriteria: string;
    requiredSkills: string;
    applyUrl: string;
    isVerified?: boolean;
    verifiedByUserId?: string;
    verificationSource?: string;
    deadline: Date;
  }) {
    return prisma.jobListing.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.jobListing.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.jobListing.delete({ where: { id } });
  }

  static async toggleBookmark(userId: string, jobListingId: string) {
    const existing = await prisma.jobBookmark.findUnique({
      where: {
        userId_jobListingId: { userId, jobListingId },
      },
    });

    if (existing) {
      await prisma.jobBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }

    await prisma.jobBookmark.create({
      data: { userId, jobListingId },
    });
    return { bookmarked: true };
  }

  static async incrementApplyClick(id: string) {
    return prisma.jobListing.update({
      where: { id },
      data: { applyClickCount: { increment: 1 } },
    });
  }

  static async createReport(userId: string, jobListingId: string, reason: string) {
    return prisma.jobReport.create({
      data: { userId, jobListingId, reason },
    });
  }

  static async countJobs() {
    return prisma.jobListing.count();
  }

  static async totalClicks() {
    const aggregations = await prisma.jobListing.aggregate({
      _sum: { applyClickCount: true },
    });
    return aggregations._sum.applyClickCount || 0;
  }
}
