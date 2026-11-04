import { Router } from 'express';
import { ExamController } from '../controllers/examController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', ExamController.listExams);
router.get('/:id', ExamController.getExam);

// Authenticated exam engine endpoints
router.use(authenticateJWT);
router.post('/:id/start', ExamController.startExam);
router.put('/attempts/:id/sync', ExamController.syncAnswer);
router.post('/attempts/:id/submit', ExamController.submitExam);
router.get('/attempts/:id/review', ExamController.getReview);
router.get('/user/my-attempts', ExamController.getMyAttempts);

export default router;
