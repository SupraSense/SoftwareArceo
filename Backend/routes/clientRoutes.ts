import { Router } from 'express';
import * as clientController from '../controllers/clientController';

const router = Router();

// Routes
router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/', clientController.create);
router.put('/:id', clientController.update);

export default router;
