import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ExamService } from '../services/examService.js';
import { AttemptRepository } from '../repositories/examRepository.js';

export class ExamController {
  static async listExams(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, difficulty } = req.query;
      const exams = await ExamService.listExams({
        category: category as string,
        difficulty: difficulty as string,
      });

      // Attach user attempt history
      let userAttempts: any[] = [];
      if (req.user) {
        userAttempts = await AttemptRepository.findUserAttempts(req.user.id);
      }

      const examsWithAttempts = exams.map((ex) => {
        const attempts = userAttempts.filter((a) => a.examId === ex.id);
        const bestAttempt = attempts.reduce(
          (max, a) => (a.score > max ? a.score : max),
          0
        );
        return {
          ...ex,
          userAttemptsCount: attempts.length,
          bestScore: attempts.length > 0 ? bestAttempt : null,
          hasPassed: attempts.some((a) => a.score >= ex.passingMarks),
        };
      });

      res.status(200).json({
        success: true,
        data: { exams: examsWithAttempts },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const exam = await ExamService.getExamDetails(id);
      res.status(200).json({
        success: true,
        data: { exam },
      });
    } catch (err) {
      next(err);
    }
  }

  static async startExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await ExamService.startExam(id, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async syncAnswer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // attemptId
      const userId = req.user!.id;
      const { questionId, selectedOptionId, isMarkedForReview, timeSpentSeconds } = req.body;

      const updated = await ExamService.syncAnswer(id, userId, {
        questionId,
        selectedOptionId,
        isMarkedForReview,
        timeSpentSeconds,
      });

      res.status(200).json({
        success: true,
        data: { answer: updated },
      });
    } catch (err) {
      next(err);
    }
  }

  static async submitExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // attemptId
      const userId = req.user!.id;

      const result = await ExamService.submitExam(id, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // attemptId
      const userId = req.user!.id;

      const review = await ExamService.getAttemptReview(id, userId);
      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMyAttempts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { examId } = req.query;

      const attempts = await AttemptRepository.findUserAttempts(userId, examId as string);
      res.status(200).json({
        success: true,
        data: { attempts },
      });
    } catch (err) {
      next(err);
    }
  }
}
