import { Router } from 'express';
import * as tipoTareaController from '../controllers/tipoTareaController';

const router = Router();

router.get('/', tipoTareaController.getAll);
router.get('/:id', tipoTareaController.getById);
router.post('/', tipoTareaController.create);
router.put('/:id', tipoTareaController.update);
router.delete('/:id', tipoTareaController.remove);

export default router;
