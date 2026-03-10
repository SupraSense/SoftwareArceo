import { Router } from 'express';
import * as personalController from '../controllers/personalController';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.post('/', checkJwt, personalController.createPersonal);
router.get('/', checkJwt, personalController.getAllPersonal);
router.get('/:id', checkJwt, personalController.getPersonalById);
router.put('/:id', checkJwt, personalController.updatePersonal);

export default router;
