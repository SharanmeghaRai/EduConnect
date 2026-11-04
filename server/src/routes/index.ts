import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateJWT } from '../middleware/auth.js';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import examRoutes from './examRoutes.js';
import jobRoutes from './jobRoutes.js';
import materialRoutes from './materialRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import aiNewsletterRoutes from './aiNewsletterRoutes.js';
import chatRoutes from './chatRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'EduConnect Core API (Tier 2)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Global cross-portal search endpoint
router.get('/search', authenticateJWT, async (req, res, next) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: { exams: [], jobs: [], materials: [] },
      });
    }

    const [exams, jobs, materials] = await Promise.all([
      prisma.exam.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
          ],
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          category: true,
          difficulty: true,
          durationMinutes: true,
          totalMarks: true,
        },
        take: 6,
      }),
      prisma.jobListing.findMany({
        where: {
          OR: [
            { companyName: { contains: q } },
            { roleTitle: { contains: q } },
            { requiredSkills: { contains: q } },
            { location: { contains: q } },
          ],
          linkStatus: 'ACTIVE',
        },
        select: {
          id: true,
          companyName: true,
          roleTitle: true,
          jobType: true,
          salaryRange: true,
          deadline: true,
          isVerified: true,
        },
        take: 6,
      }),
      prisma.studyMaterial.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q } },
            { category: { contains: q } },
          ],
        },
        select: {
          id: true,
          title: true,
          category: true,
          contentType: true,
          estimatedMinutes: true,
          resourceUrl: true,
        },
        take: 6,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { exams, jobs, materials },
    });
  } catch (err) {
    next(err);
  }
});

// Mount Resource Routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/exams', examRoutes);
router.use('/jobs', jobRoutes);
router.use('/materials', materialRoutes);
router.use('/newsletters', newsletterRoutes);
router.use('/ai-newsletters', aiNewsletterRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);

export default router;
