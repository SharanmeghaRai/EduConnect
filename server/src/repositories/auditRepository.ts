import { prisma } from '../config/prisma.js';

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
