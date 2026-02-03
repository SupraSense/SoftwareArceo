import { Router } from 'express';
import * as tipoTareaController from '../controllers/tipoTareaController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Retrieve all - Authenticated only
router.get('/', checkJwt, tipoTareaController.getAll);

// Read one - Authenticated only
router.get('/:id', checkJwt, tipoTareaController.getById);

// Create - Admin only
router.post('/', checkJwt, requireRole('admin'), tipoTareaController.create);

// Update - Admin only
router.put('/:id', checkJwt, requireRole('admin'), tipoTareaController.update);

// Delete - Admin only
router.delete('/:id', checkJwt, requireRole('admin'), tipoTareaController.remove);

export default router;
