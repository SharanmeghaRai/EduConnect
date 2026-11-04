import { JobRepository } from '../repositories/jobRepository.js';
import { AuditRepository } from '../repositories/auditRepository.js';

export class JobService {
  static async listJobs(filters?: { jobType?: string; search?: string }, userId?: string) {
    return JobRepository.findAll({
      ...filters,
      isVerified: true,
      userId,
    });
  }

  static async getJob(id: string) {
    const job = await JobRepository.findById(id);
    if (!job) throw new Error('Job listing not found.');
    return job;
  }

  static async toggleBookmark(userId: string, jobId: string) {
    return JobRepository.toggleBookmark(userId, jobId);
  }

  static async trackClick(jobId: string) {
    return JobRepository.incrementApplyClick(jobId);
  }

  static async reportBrokenLink(userId: string, jobId: string, reason: string) {
    const report = await JobRepository.createReport(userId, jobId, reason);
    await AuditRepository.logAction({
      actorUserId: userId,
      action: 'REPORT_JOB_LINK',
      entityType: 'JOB',
      entityId: jobId,
      metadataJson: JSON.stringify({ reason }),
    });
    return report;
  }
}
