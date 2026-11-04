import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletterController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', NewsletterController.listNewsletters);
router.get('/:id', NewsletterController.getNewsletter);

router.use(authenticateJWT);
router.post('/subscribe', NewsletterController.toggleSubscription);

export default router;
