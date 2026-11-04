import { Router } from 'express';
import { JobController } from '../controllers/jobController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', JobController.listJobs);
router.get('/:id', JobController.getJob);

router.use(authenticateJWT);
router.post('/:id/bookmark', JobController.toggleBookmark);
router.post('/:id/track-click', JobController.trackClick);
router.post('/:id/report', JobController.reportLink);

export default router;
