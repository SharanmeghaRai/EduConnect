import { prisma } from '../config/prisma.js';

export class ExamRepository {
  static async findAll(filters?: { category?: string; difficulty?: string; isPublished?: boolean }) {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.difficulty) where.difficulty = filters.difficulty;
    if (filters?.isPublished !== undefined) where.isPublished = filters.isPublished;

    return prisma.exam.findMany({
      where,
      include: {
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string, includeAnswers = false) {
    return prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: {
              select: {
                id: true,
                label: true,
                text: true,
                isCorrect: includeAnswers,
              },
            },
          },
        },
      },
    });
  }

  static async findBySlug(slug: string, includeAnswers = false) {
    return prisma.exam.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: {
              select: {
                id: true,
                label: true,
                text: true,
                isCorrect: includeAnswers,
              },
            },
          },
        },
      },
    });
  }

  static async create(data: {
    title: string;
    slug: string;
    description?: string;
    category: string;
    difficulty: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    negativeMarkingRatio: number;
    maxAttempts?: number;
    isPublished?: boolean;
    shuffleQuestions?: boolean;
  }) {
    return prisma.exam.create({ data });
  }

  static async update(id: string, data: Partial<Parameters<typeof ExamRepository.create>[0]>) {
    return prisma.exam.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.exam.delete({ where: { id } });
  }

  static async countExams() {
    return prisma.exam.count();
  }
}

export class AttemptRepository {
  static async create(data: {
    examId: string;
    userId: string;
    attemptNumber: number;
    maxScore: number;
  }) {
    return prisma.attempt.create({
      data: {
        ...data,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });
  }

  static async findById(id: string) {
    return prisma.attempt.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
              include: { options: true },
            },
          },
        },
        answers: {
          include: {
            selectedOption: true,
            question: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  static async findUserAttempts(userId: string, examId?: string) {
    const where: any = { userId };
    if (examId) where.examId = examId;

    return prisma.attempt.findMany({
      where,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            category: true,
            durationMinutes: true,
            passingMarks: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  static async countUserAttemptsForExam(userId: string, examId: string) {
    return prisma.attempt.count({
      where: { userId, examId },
    });
  }

  static async upsertAnswer(data: {
    attemptId: string;
    questionId: string;
    selectedOptionId?: string | null;
    isMarkedForReview?: boolean;
    timeSpentSeconds?: number;
  }) {
    const existing = await prisma.attemptAnswer.findFirst({
      where: {
        attemptId: data.attemptId,
        questionId: data.questionId,
      },
    });

    if (existing) {
      return prisma.attemptAnswer.update({
        where: { id: existing.id },
        data: {
          selectedOptionId: data.selectedOptionId,
          isMarkedForReview: data.isMarkedForReview ?? existing.isMarkedForReview,
          timeSpentSeconds: data.timeSpentSeconds ?? existing.timeSpentSeconds,
        },
      });
    }

    return prisma.attemptAnswer.create({
      data: {
        attemptId: data.attemptId,
        questionId: data.questionId,
        selectedOptionId: data.selectedOptionId,
        isMarkedForReview: data.isMarkedForReview || false,
        timeSpentSeconds: data.timeSpentSeconds || 0,
      },
    });
  }

  static async completeAttempt(
    id: string,
    data: {
      score: number;
      accuracyPercentage: number;
      timeSpentSeconds: number;
      peerPercentile: number;
      status: string;
    }
  ) {
    return prisma.attempt.update({
      where: { id },
      data: {
        ...data,
        submittedAt: new Date(),
      },
    });
  }

  static async calculatePercentile(examId: string, currentScore: number) {
    const totalCompleted = await prisma.attempt.count({
      where: { examId, status: 'COMPLETED' },
    });

    if (totalCompleted <= 1) return 99.0;

    const lowerScoreCount = await prisma.attempt.count({
      where: { examId, status: 'COMPLETED', score: { lt: currentScore } },
    });

    const percentile = ((lowerScoreCount / totalCompleted) * 100);
    return Math.min(Math.max(parseFloat(percentile.toFixed(1)), 10.0), 99.9);
  }
}
