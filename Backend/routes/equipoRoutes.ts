import { Router } from 'express';
import * as equipoController from '../controllers/equipoController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Retrieve all active equipos - Authenticated only
router.get('/', checkJwt, equipoController.getAll);

// Create - Admin only
router.post('/', checkJwt, requireRole('admin'), equipoController.create);

// Soft delete - Admin only
router.delete('/:id', checkJwt, requireRole('admin'), equipoController.remove);

export default router;
