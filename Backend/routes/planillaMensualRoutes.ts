import { Router } from 'express';
import * as controller from '../controllers/planillaMensualController';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

// Rutas protegidas para la gestión de planillas mensuales
router.get('/', checkJwt, controller.getPlanilla);
router.patch('/dias/:diaId', checkJwt, controller.updateDia);
router.post('/dias/:diaId/pernocta', checkJwt, controller.addPernocta);
router.post('/dias/:diaId/conexion', checkJwt, controller.addConexion);
router.post('/dias/:diaId/desconexion', checkJwt, controller.addDesconexion);

export default router;
