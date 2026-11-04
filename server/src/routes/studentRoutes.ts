import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.post('/onboarding', StudentController.submitOnboarding);
router.get('/dashboard', StudentController.getDashboard);
router.put('/profile', StudentController.updateProfile);

// Notifications endpoints
router.get('/notifications', StudentController.getNotifications);
router.put('/notifications/:id/read', StudentController.markNotificationRead);
router.put('/notifications/read-all', StudentController.markAllNotificationsRead);

// Leaderboard endpoint
router.get('/leaderboard', StudentController.getLeaderboard);

export default router;
