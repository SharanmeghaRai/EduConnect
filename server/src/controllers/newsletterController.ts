import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { NewsletterService } from '../services/newsletterService.js';
import { prisma } from '../config/prisma.js';

export class NewsletterController {
  static async listNewsletters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newsletters = await NewsletterService.listNewsletters(true);
      res.status(200).json({
        success: true,
        data: { newsletters },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const newsletter = await NewsletterService.getNewsletter(id);
      res.status(200).json({
        success: true,
        data: { newsletter },
      });
    } catch (err) {
      next(err);
    }
  }

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
        data: { subscription: sub },
      });
    } catch (err) {
      next(err);
    }
  }
}
