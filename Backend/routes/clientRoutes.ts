import { Router } from 'express';
import * as clientController from '../controllers/clientController';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.get('/', checkJwt, clientController.getAll);
router.get('/:id', checkJwt, clientController.getById);
router.post('/', checkJwt, clientController.create);
router.put('/:id', checkJwt, clientController.update);
router.delete('/:id', checkJwt, clientController.deleteClient);

export default router;
