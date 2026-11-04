import { Router } from 'express';
import { ChatController } from '../controllers/chatController.js';
import { authenticateOptionalJWT } from '../middleware/auth.js';

const router = Router();

router.use(authenticateOptionalJWT);

router.post('/message', ChatController.streamMessage);
router.get('/sessions', ChatController.listSessions);
router.get('/sessions/:id/messages', ChatController.getSessionMessages);
router.post('/explain-question', ChatController.explainQuestion);
router.post('/feedback', ChatController.submitFeedback);

export default router;
