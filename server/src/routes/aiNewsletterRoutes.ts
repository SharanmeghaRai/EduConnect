import { Router } from 'express';
import { AiNewsletterController } from '../controllers/aiNewsletterController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Public / Authenticated read routes for recent 10 days
router.get('/', AiNewsletterController.getRecentNewsletters);
router.get('/recent', AiNewsletterController.getRecentNewsletters);

// On-demand trigger for testing / admin refresh of the 8:00 AM worker
router.post('/trigger-daily', AiNewsletterController.triggerDailyDispatch);

// Single issue by ID
router.get('/:id', AiNewsletterController.getNewsletterById);

// Subscriptions
router.post('/subscribe', authenticateJWT, AiNewsletterController.toggleSubscription);

export default router;
