import { Router } from 'express';
import * as personalController from '../controllers/personalController';

const router = Router();

router.post('/', personalController.createPersonal);
router.get('/', personalController.getAllPersonal);
router.get('/:id', personalController.getPersonalById);
router.put('/:id', personalController.updatePersonal);

export default router;
