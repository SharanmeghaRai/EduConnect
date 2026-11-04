import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { MaterialService } from '../services/materialService.js';

export class MaterialController {
  static async listMaterials(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, subCategory, search } = req.query;
      const userId = req.user?.id;

      const materials = await MaterialService.listMaterials(
        {
          category: category as string,
          subCategory: subCategory as string,
          search: search as string,
        },
        userId
      );

      const formatted = materials.map((m) => {
        const record = m.progressRecords?.[0];
        return {
          ...m,
          isCompleted: record?.isCompleted || false,
          isBookmarked: record?.isBookmarked || false,
        };
      });

      res.status(200).json({
        success: true,
        data: { materials: formatted },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const material = await MaterialService.getMaterial(id);
      res.status(200).json({
        success: true,
        data: { material },
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { isCompleted } = req.body;

      const progress = await MaterialService.setProgress(userId, id, Boolean(isCompleted));
      const summary = await MaterialService.getProgressSummary(userId);

      res.status(200).json({
        success: true,
        data: { progress, summary },
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const record = await MaterialService.toggleBookmark(userId, id);
      res.status(200).json({
        success: true,
        data: { record },
      });
    } catch (err) {
      next(err);
    }
  }
}
