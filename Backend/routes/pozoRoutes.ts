import { Router } from 'express';
import * as pozoController from '../controllers/pozoController';
import { checkJwt, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Retrieve all active pozos - Authenticated only
router.get('/', checkJwt, pozoController.getAll);

// Retrieve available pozos (not assigned to any client) - Authenticated only
router.get('/available', checkJwt, pozoController.getAvailable);

// Create - Admin only
router.post('/', checkJwt, requireRole('admin'), pozoController.create);

// Associate pozo to a client - Authenticated
router.patch('/:id/associate', checkJwt, pozoController.associate);

// Disassociate pozo from client - Authenticated
router.patch('/:id/disassociate', checkJwt, pozoController.disassociate);

// Soft delete - Admin only
router.delete('/:id', checkJwt, requireRole('admin'), pozoController.remove);

export default router;
