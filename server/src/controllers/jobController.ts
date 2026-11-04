import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { JobService } from '../services/jobService.js';

export class JobController {
  static async listJobs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobType, search } = req.query;
      const userId = req.user?.id;

      const jobs = await JobService.listJobs(
        {
          jobType: jobType as string,
          search: search as string,
        },
        userId
      );

      const formatted = jobs.map((j) => ({
        ...j,
        isBookmarked: j.bookmarks && j.bookmarks.length > 0,
      }));

      res.status(200).json({
        success: true,
        data: { jobs: formatted },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const job = await JobService.getJob(id);
      res.status(200).json({
        success: true,
        data: { job },
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await JobService.toggleBookmark(userId, id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async trackClick(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await JobService.trackClick(id);
      res.status(200).json({
        success: true,
        data: { message: 'Click tracked' },
      });
    } catch (err) {
      next(err);
    }
  }

  static async reportLink(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { reason } = req.body;

      if (!reason) {
        res.status(400).json({ success: false, error: { message: 'Reason is required' } });
        return;
      }

      const report = await JobService.reportBrokenLink(userId, id, reason);
      res.status(201).json({
        success: true,
        data: { report },
      });
    } catch (err) {
      next(err);
    }
  }
}
