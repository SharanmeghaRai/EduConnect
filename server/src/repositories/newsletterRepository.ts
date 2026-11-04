import { prisma } from '../config/prisma.js';

export class NewsletterRepository {
  static async findAll(onlyPublished = true) {
    const where: any = {};
    if (onlyPublished) {
      where.status = 'PUBLISHED';
      where.NOT = { targetAudience: { startsWith: 'AI_DAILY' } };
    }

    return prisma.newsletter.findMany({
      where,
      orderBy: { editionNumber: 'desc' },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.newsletter.findUnique({
      where: { id },
      include: {
        deliveries: {
          take: 20,
          orderBy: { sentAt: 'desc' },
        },
      },
    });
  }

  static async create(data: {
    title: string;
    editionNumber: number;
    contentHtml: string;
    summary?: string;
    targetAudience?: string;
    scheduledAt?: Date | null;
    status: string;
  }) {
    return prisma.newsletter.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.newsletter.update({
      where: { id },
      data,
    });
  }

  static async getNextEditionNumber() {
    const latest = await prisma.newsletter.findFirst({
      orderBy: { editionNumber: 'desc' },
      select: { editionNumber: true },
    });
    return (latest?.editionNumber || 0) + 1;
  }

  static async getSubscribedEmails() {
    const subs = await prisma.newsletterSubscription.findMany({
      where: { isSubscribed: true },
      select: { email: true },
    });
    return subs.map((s) => s.email);
  }

  static async logDelivery(newsletterId: string, email: string, status: string, error?: string) {
    return prisma.newsletterDelivery.create({
      data: {
        newsletterId,
        recipientEmail: email,
        status,
        error,
      },
    });
  }
}

export class ChatRepository {
  static async getOrCreateSession(userId: string, sessionId?: string) {
    if (sessionId) {
      const existing = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (existing) return existing;
    }

    return prisma.chatSession.create({
      data: {
        userId,
        title: 'Placement Guidance Session',
      },
    });
  }

  static async getUserSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async getSessionMessages(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async saveMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    citationsJson?: string;
  }) {
    return prisma.chatMessage.create({
      data,
    });
  }

  static async setFeedback(messageId: string, rating: number) {
    return prisma.chatMessage.update({
      where: { id: messageId },
      data: { feedbackRating: rating },
    });
  }
}

export class AuditRepository {
  static async logAction(data: {
    actorUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadataJson?: string;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({ data });
  }

  static async getRecentLogs(take = 50) {
    return prisma.auditLog.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        actorUser: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
