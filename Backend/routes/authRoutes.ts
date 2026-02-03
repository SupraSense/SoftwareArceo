import { Router } from 'express';
import * as authController from '../controllers/authController';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', checkJwt, authController.me);

export default router;
