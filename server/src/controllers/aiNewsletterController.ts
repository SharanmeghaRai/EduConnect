import { Request, Response, NextFunction } from 'express';
import { AiNewsletterService } from '../services/aiNewsletterService.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

export class AiNewsletterController {
  /**
   * GET /api/v1/ai-newsletters
   * Returns recent 10 days of AI newsletters + dispatch stats
   */
  static async getRecentNewsletters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AiNewsletterService.getRecentTenDaysNewsletters();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/ai-newsletters/:id
   * Returns a specific newsletter edition with previous/next timeline navigation
   */
  static async getNewsletterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await AiNewsletterService.getNewsletterById(id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/ai-newsletters/trigger-daily
   * Manually trigger the 8:00 AM AI Newsletter generation worker
   */
  static async triggerDailyDispatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('⚡ [API] Manual trigger of daily 8:00 AM AI Newsletter requested...');
      const newsletter = await AiNewsletterService.generateDailyAiNewsletter();
      res.status(200).json({
        success: true,
        message: 'Daily 8:00 AM AI Newsletter worker executed successfully.',
        data: { newsletter },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/ai-newsletters/subscribe
   * Student toggle for 8:00 AM daily newsletter notifications
   */
  static async toggleSubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { isSubscribed } = req.body;

      const sub = await prisma.newsletterSubscription.upsert({
        where: { userId },
        update: { isSubscribed: Boolean(isSubscribed) },
        create: {
          userId,
          email: req.user!.email,
          isSubscribed: Boolean(isSubscribed),
        },
      });

      res.status(200).json({
        success: true,
        message: isSubscribed
          ? 'Subscribed to 8:00 AM Daily AI Newsletter dispatch!'
          : 'Unsubscribed from 8:00 AM Daily AI Newsletter.',
        data: { subscription: sub },
      });
    } catch (err) {
      next(err);
    }
  }
}
