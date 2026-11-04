import { Router } from 'express';
import { MaterialController } from '../controllers/materialController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', MaterialController.listMaterials);
router.get('/:id', MaterialController.getMaterial);

router.use(authenticateJWT);
router.post('/:id/progress', MaterialController.toggleProgress);
router.post('/:id/bookmark', MaterialController.toggleBookmark);

export default router;
