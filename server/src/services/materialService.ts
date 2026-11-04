import { MaterialRepository } from '../repositories/materialRepository.js';

export class MaterialService {
  static async listMaterials(
    filters?: { category?: string; subCategory?: string; search?: string },
    userId?: string
  ) {
    return MaterialRepository.findAll({ ...filters, userId });
  }

  static async getMaterial(id: string) {
    const mat = await MaterialRepository.findById(id);
    if (!mat) throw new Error('Study material not found.');
    return mat;
  }

  static async setProgress(userId: string, materialId: string, isCompleted: boolean) {
    return MaterialRepository.toggleProgress(userId, materialId, isCompleted);
  }

  static async toggleBookmark(userId: string, materialId: string) {
    return MaterialRepository.toggleBookmark(userId, materialId);
  }

  static async getProgressSummary(userId: string) {
    return MaterialRepository.getStudentProgressStats(userId);
  }
}
