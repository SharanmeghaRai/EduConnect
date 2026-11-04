import { prisma } from '../config/prisma.js';

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
