import { Router } from 'express';
import * as authController from '../controllers/authController';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
// PASO 2: Ruta de refresh — SIN checkJwt porque se invoca cuando el access_token ya expiró.
// La autenticación se delega a Keycloak mediante el refresh_token (cookie HttpOnly).
router.post('/refresh', authController.refreshToken);
router.get('/me', checkJwt, authController.me);
router.put('/me', checkJwt, authController.updateProfile);

export default router;
