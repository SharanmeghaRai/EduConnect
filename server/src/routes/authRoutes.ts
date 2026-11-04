import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/google', AuthController.googleLogin);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/demo-login', AuthController.demoLogin);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;
