import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { AdminService } from '../services/adminService.js';
import { ExamRepository } from '../repositories/examRepository.js';
import { JobRepository } from '../repositories/jobRepository.js';
import { MaterialRepository } from '../repositories/materialRepository.js';
import { NewsletterRepository } from '../repositories/newsletterRepository.js';
import { NewsletterService } from '../services/newsletterService.js';
import { AuditRepository } from '../repositories/auditRepository.js';

export class AdminController {
  static async getAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AdminService.getCohortAnalytics();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listStudents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, department, skip, take } = req.query;
      const result = await AdminService.listStudents({
        search: search as string,
        department: department as string,
        skip: skip ? parseInt(skip as string, 10) : 0,
        take: take ? parseInt(take as string, 10) : 50,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStudentDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const student = await AdminService.getStudentDetails(id);
      res.status(200).json({
        success: true,
        data: { student },
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleStudentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const actorUserId = req.user!.id;

      const updated = await AdminService.toggleStudentStatus(id, Boolean(isActive), actorUserId);
      res.status(200).json({
        success: true,
        data: { user: updated },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- EXAM MANAGEMENT ---
  static async createExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = req.user!.id;
      const exam = await ExamRepository.create(req.body);

      await AuditRepository.logAction({
        actorUserId,
        action: 'CREATE_EXAM',
        entityType: 'EXAM',
        entityId: exam.id,
      });

      res.status(201).json({
        success: true,
        data: { exam },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorUserId = req.user!.id;
      const exam = await ExamRepository.update(id, req.body);

      await AuditRepository.logAction({
        actorUserId,
        action: 'UPDATE_EXAM',
        entityType: 'EXAM',
        entityId: exam.id,
      });

      res.status(200).json({
        success: true,
        data: { exam },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorUserId = req.user!.id;
      await ExamRepository.delete(id);

      await AuditRepository.logAction({
        actorUserId,
        action: 'DELETE_EXAM',
        entityType: 'EXAM',
        entityId: id,
      });

      res.status(200).json({
        success: true,
        data: { message: 'Exam deleted successfully.' },
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkUploadMCQs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // examId
      const { csvContent } = req.body;
      const actorUserId = req.user!.id;

      if (!csvContent) {
        res.status(400).json({ success: false, error: { message: 'CSV content is required.' } });
        return;
      }

      const result = await AdminService.bulkUploadMCQsFromCSV(id, csvContent, actorUserId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // examId
      const { prompt, explanation, topicTag, marks, options } = req.body;
      const actorUserId = req.user!.id;

      if (!prompt) {
        res.status(400).json({ success: false, error: { message: 'Question prompt is required.' } });
        return;
      }

      // Count existing questions to set orderIndex
      const count = await prisma.question.count({ where: { examId: id } });

      const question = await prisma.question.create({
        data: {
          examId: id,
          prompt,
          explanation: explanation || null,
          topicTag: topicTag || null,
          marks: marks !== undefined ? Number(marks) : 1.0,
          orderIndex: count + 1,
          options: options && Array.isArray(options)
            ? {
                create: options.map((opt: any) => ({
                  label: opt.label,
                  text: opt.text,
                  isCorrect: Boolean(opt.isCorrect),
                })),
              }
            : undefined,
        },
        include: {
          options: true,
        },
      });

      await AuditRepository.logAction({
        actorUserId,
        action: 'ADD_QUESTION',
        entityType: 'QUESTION',
        entityId: question.id,
        metadataJson: JSON.stringify({ examId: id }),
      });

      res.status(201).json({
        success: true,
        data: { question },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // questionId
      const { prompt, explanation, topicTag, marks, options } = req.body;
      const actorUserId = req.user!.id;

      const updateData: any = {};
      if (prompt !== undefined) updateData.prompt = prompt;
      if (explanation !== undefined) updateData.explanation = explanation;
      if (topicTag !== undefined) updateData.topicTag = topicTag;
      if (marks !== undefined) updateData.marks = Number(marks);

      // If options are provided, update them
      if (options && Array.isArray(options)) {
        await prisma.option.deleteMany({ where: { questionId: id } });
        await prisma.option.createMany({
          data: options.map((opt: any) => ({
            questionId: id,
            label: opt.label,
            text: opt.text,
            isCorrect: Boolean(opt.isCorrect),
          })),
        });
      }

      const question = await prisma.question.update({
        where: { id },
        data: updateData,
        include: {
          options: true,
        },
      });

      await AuditRepository.logAction({
        actorUserId,
        action: 'UPDATE_QUESTION',
        entityType: 'QUESTION',
        entityId: id,
      });

      res.status(200).json({
        success: true,
        data: { question },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // questionId
      const actorUserId = req.user!.id;

      await prisma.question.delete({
        where: { id },
      });

      await AuditRepository.logAction({
        actorUserId,
        action: 'DELETE_QUESTION',
        entityType: 'QUESTION',
        entityId: id,
      });

      res.status(200).json({
        success: true,
        data: { message: 'Question deleted successfully.' },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- JOB MANAGEMENT ---
  static async createJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = req.user!.id;
      const job = await JobRepository.create({
        ...req.body,
        verifiedByUserId: actorUserId,
        isVerified: true,
        deadline: new Date(req.body.deadline),
      });

      await AuditRepository.logAction({
        actorUserId,
        action: 'CREATE_JOB',
        entityType: 'JOB',
        entityId: job.id,
      });

      res.status(201).json({
        success: true,
        data: { job },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorUserId = req.user!.id;
      const job = await JobRepository.update(id, req.body);

      await AuditRepository.logAction({
        actorUserId,
        action: 'UPDATE_JOB',
        entityType: 'JOB',
        entityId: job.id,
      });

      res.status(200).json({
        success: true,
        data: { job },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await JobRepository.delete(id);
      res.status(200).json({
        success: true,
        data: { message: 'Job deleted.' },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- MATERIAL MANAGEMENT ---
  static async createMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = req.user!.id;
      const body = req.body || {};

      const rawTags = body.tags;
      const tags = Array.isArray(rawTags)
        ? rawTags.join(', ')
        : typeof rawTags === 'string'
        ? rawTags
        : 'placement prep';

      const mat = await MaterialRepository.create({
        title: body.title || 'Untitled Resource',
        category: body.category || 'APTITUDE',
        subCategory: body.subCategory || 'QUANT',
        contentType: body.contentType || body.resourceType || 'PDF',
        resourceUrl:
          body.resourceUrl ||
          body.externalUrl ||
          '/reference-materials/Aptitude-Formula-Handbook.pdf',
        description: body.description || '',
        tags,
        difficulty: body.difficulty || 'INTERMEDIATE',
        estimatedMinutes: body.estimatedMinutes ? Number(body.estimatedMinutes) : 15,
        orderIndex: body.orderIndex ? Number(body.orderIndex) : 0,
      });

      await AuditRepository.logAction({
        actorUserId,
        action: 'CREATE_MATERIAL',
        entityType: 'MATERIAL',
        entityId: mat.id,
        metadataJson: JSON.stringify({ title: mat.title, contentType: mat.contentType }),
      });

      res.status(201).json({
        success: true,
        data: { material: mat },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const mat = await MaterialRepository.update(id, req.body);
      res.status(200).json({
        success: true,
        data: { material: mat },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await MaterialRepository.delete(id);
      res.status(200).json({
        success: true,
        data: { message: 'Material deleted.' },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- SESSIONS & LIVE BROADCAST UPDATES ---
  static async broadcastSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, message, type = 'SESSION', link = '/calendar', sessionDate, sessionTime, meetingUrl } = req.body;
      const actorUserId = req.user!.id;

      if (!title || !message) {
        res.status(400).json({ success: false, error: { message: 'Title and message are required.' } });
        return;
      }

      const students = await prisma.user.findMany({
        where: { role: 'STUDENT', isActive: true },
        select: { id: true },
      });

      const notificationData = students.map((s) => ({
        userId: s.id,
        title: type === 'SESSION' ? `[Campus Drive Session] ${title}` : `[Placement Update] ${title}`,
        message: sessionDate ? `${message} (Scheduled: ${sessionDate} ${sessionTime || ''})` : message,
        type: 'JOB',
        link: meetingUrl || link || '/calendar',
        isRead: false,
      }));

      if (notificationData.length > 0) {
        await prisma.notification.createMany({
          data: notificationData,
        });
      }

      await AuditRepository.logAction({
        actorUserId,
        action: 'BROADCAST_SESSION',
        entityType: 'NOTIFICATION',
        metadataJson: JSON.stringify({ title, studentCount: students.length, sessionDate }),
      });

      res.status(200).json({
        success: true,
        data: {
          broadcastCount: students.length,
          message: `Update successfully broadcasted to ${students.length} students!`,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- NEWSLETTER STUDIO ---
  static async createNewsletter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const nextEdition = await NewsletterRepository.getNextEditionNumber();
      const nl = await NewsletterRepository.create({
        ...req.body,
        editionNumber: nextEdition,
        status: req.body.status || 'DRAFT',
      });

      res.status(201).json({
        success: true,
        data: { newsletter: nl },
      });
    } catch (err) {
      next(err);
    }
  }

  static async publishNewsletter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorUserId = req.user!.id;

      const published = await NewsletterService.publishAndDispatch(id, actorUserId);
      res.status(200).json({
        success: true,
        data: { newsletter: published },
      });
    } catch (err) {
      next(err);
    }
  }

  // --- AUDIT TRAIL & CSV EXPORT ---
  static async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await AuditRepository.getRecentLogs(100);
      res.status(200).json({
        success: true,
        data: { logs },
      });
    } catch (err) {
      next(err);
    }
  }

  static async exportCSV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const csv = await AdminService.exportCohortCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="EduConnect-Cohort-Performance-${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }

  // --- FACULTY STUDENT MARKS & TEST PERFORMANCE ---
  static async getStudentPerformanceOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, examId, department, status, skip, take } = req.query;
      const data = await AdminService.getStudentPerformanceOverview({
        search: search as string,
        examId: examId as string,
        department: department as string,
        status: status as string,
        skip: skip ? parseInt(skip as string, 10) : 0,
        take: take ? parseInt(take as string, 10) : 50,
      });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAttemptDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { attemptId } = req.params;
      const data = await AdminService.getAttemptDetails(attemptId);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async exportMarksCSV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { examId, department } = req.query;
      const csv = await AdminService.exportDetailedMarksCSV({
        examId: examId as string,
        department: department as string,
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Sahyadri-Student-Exam-Marks-${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }
}
