import { Router } from 'express';
import * as pozoController from '../controllers/pozoController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Retrieve all active pozos - Authenticated only
router.get('/', checkJwt, pozoController.getAll);

// Create - Admin only
router.post('/', checkJwt, requireRole('admin'), pozoController.create);

// Soft delete - Admin only
router.delete('/:id', checkJwt, requireRole('admin'), pozoController.remove);

export default router;
