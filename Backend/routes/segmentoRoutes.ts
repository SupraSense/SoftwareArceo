import { Router } from 'express';
import * as segmentoController from '../controllers/segmentoController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Retrieve all active segmentos - Authenticated only
router.get('/', checkJwt, segmentoController.getAll);

// Create - Admin only
router.post('/', checkJwt, requireRole('admin'), segmentoController.create);

// Soft delete - Admin only
router.delete('/:id', checkJwt, requireRole('admin'), segmentoController.remove);

export default router;
