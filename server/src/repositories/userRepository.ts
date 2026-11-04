import { prisma } from '../config/prisma.js';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        studentProfile: true,
        newsletterSubscriptions: true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
        newsletterSubscriptions: true,
      },
    });
  }

  static async upsertGoogleUser(data: {
    email: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  }) {
    return prisma.user.upsert({
      where: { email: data.email.toLowerCase() },
      update: {
        name: data.name,
        avatarUrl: data.avatarUrl,
      },
      create: {
        email: data.email.toLowerCase(),
        name: data.name,
        avatarUrl: data.avatarUrl,
        role: data.role || 'STUDENT',
        newsletterSubscriptions: {
          create: {
            email: data.email.toLowerCase(),
            isSubscribed: true,
          },
        },
      },
      include: {
        studentProfile: true,
        newsletterSubscriptions: true,
      },
    });
  }

  static async updateProfile(
    userId: string,
    profileData: {
      name?: string;
      avatarUrl?: string;
      rollNumber?: string;
      department?: string;
      graduationYear?: number;
      targetRoles?: string;
      resumeUrl?: string;
      cgpa?: number;
      skills?: string;
      preferredCompanies?: string;
      isLeaderboardOptIn?: boolean;
    }
  ) {
    const { name, avatarUrl, ...profileFields } = profileData;

    if (name || avatarUrl) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(avatarUrl ? { avatarUrl } : {}),
        },
      });
    }

    return prisma.studentProfile.upsert({
      where: { userId },
      update: {
        ...profileFields,
        lastActiveDate: new Date(),
      },
      create: {
        userId,
        ...profileFields,
        prepStreakDays: 1,
        lastActiveDate: new Date(),
      },
    });
  }

  static async listAllStudents(options?: {
    search?: string;
    department?: string;
    skip?: number;
    take?: number;
  }) {
    const { search, department, skip = 0, take = 50 } = options || {};

    const where: any = { role: 'STUDENT' };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { studentProfile: { rollNumber: { contains: search } } },
      ];
    }

    if (department) {
      where.studentProfile = {
        department: { contains: department },
      };
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          studentProfile: true,
          attempts: {
            select: {
              id: true,
              score: true,
              maxScore: true,
              accuracyPercentage: true,
              status: true,
              submittedAt: true,
            },
          },
          materialProgress: {
            where: { isCompleted: true },
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { students, total };
  }

  static async countStudents() {
    return prisma.user.count({ where: { role: 'STUDENT' } });
  }

  static async countActiveStudents() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return prisma.studentProfile.count({
      where: { lastActiveDate: { gte: oneWeekAgo } },
    });
  }
}
