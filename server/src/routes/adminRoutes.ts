import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// Protect all admin routes with authentication and RBAC
router.use(authenticateJWT);
router.use(requireAdmin);

// Analytics & Cohort
router.get('/analytics', AdminController.getAnalytics);
router.get('/reports/cohort-export', AdminController.exportCSV);
router.get('/audit-logs', AdminController.getAuditLogs);

// Faculty Marks & Performance Analytics
router.get('/performance', AdminController.getStudentPerformanceOverview);
router.get('/attempts/:attemptId/details', AdminController.getAttemptDetails);
router.get('/reports/marks-export', AdminController.exportMarksCSV);

// Student Management
router.get('/students', AdminController.listStudents);
router.get('/students/:id', AdminController.getStudentDetails);
router.put('/students/:id/status', AdminController.toggleStudentStatus);

// Exam Studio
router.post('/exams', AdminController.createExam);
router.put('/exams/:id', AdminController.updateExam);
router.delete('/exams/:id', AdminController.deleteExam);
router.post('/exams/:id/bulk-csv', AdminController.bulkUploadMCQs);
router.post('/exams/:id/questions', AdminController.addQuestion);
router.put('/questions/:id', AdminController.updateQuestion);
router.delete('/questions/:id', AdminController.deleteQuestion);

// Job Opportunities
router.post('/jobs', AdminController.createJob);
router.put('/jobs/:id', AdminController.updateJob);
router.delete('/jobs/:id', AdminController.deleteJob);

// Study Materials
router.post('/materials', AdminController.createMaterial);
router.put('/materials/:id', AdminController.updateMaterial);
router.delete('/materials/:id', AdminController.deleteMaterial);

// Sessions & Broadcast Updates
router.post('/broadcast-session', AdminController.broadcastSession);

// Newsletter Studio
router.post('/newsletters', AdminController.createNewsletter);
router.post('/newsletters/:id/publish', AdminController.publishNewsletter);

export default router;
