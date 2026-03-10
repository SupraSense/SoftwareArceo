import { Router } from 'express';
import * as controller from '../controllers/userManagementController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// ─── Validation endpoints (before /:id to avoid param conflicts) ───
router.get('/validate/email', checkJwt, controller.checkEmail);
router.get('/validate/dni', checkJwt, controller.checkDni);

// ─── Public queries (authenticated) ───
router.get('/', checkJwt, controller.getAll);
router.get('/:id', checkJwt, controller.getById);

// ─── Admin-only mutations ───
router.post('/', checkJwt, requireRole('admin'), controller.create);
router.put('/:id', checkJwt, requireRole('admin'), controller.update);
router.patch('/:id/deactivate', checkJwt, requireRole('admin'), controller.deactivate);
router.patch('/:id/activate', checkJwt, requireRole('admin'), controller.activate);
router.post('/:id/resend-invitation', checkJwt, requireRole('admin'), controller.resendInvitation);

export default router;
