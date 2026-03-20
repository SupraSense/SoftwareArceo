import { Request, Response } from 'express';
import * as service from '../services/planillaMensualService';
import { 
  getPlanillaSchema, 
  updateDiaSchema, 
  registrarPernoctaSchema, 
  registrarConexionSchema, 
  registrarDesconexionSchema 
} from '../validators/planillaValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getPlanilla = async (req: Request, res: Response) => {
  const parseResult = getPlanillaSchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.issues[0]?.message || 'Datos inválidos en query string' });
  }

  try {
    const { choferId, mes, anio } = parseResult.data;
    const planilla = await service.obtenerOCrearPlanilla(choferId, mes, anio);
    return res.status(200).json(planilla);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof ConflictError) {
      return res.status(409).json({ message: error.message });
    }
    console.error('[PlanillaController] Error en getPlanilla:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateDia = async (req: Request, res: Response) => {
  const parseResult = updateDiaSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.issues[0]?.message || 'Payload inválido' });
  }

  try {
    const diaId = req.params.diaId;
    const diaActualizado = await service.actualizarDia(diaId, parseResult.data);
    return res.status(200).json(diaActualizado);
  } catch (error) {
    if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
    console.error('[PlanillaController] Error en updateDia:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addPernocta = async (req: Request, res: Response) => {
  const parseResult = registrarPernoctaSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.issues[0].message });
  }

  try {
    const pernocta = await service.registrarPernocta(req.params.diaId, parseResult.data);
    return res.status(201).json(pernocta);
  } catch (error) {
    if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
    if (error instanceof ConflictError) return res.status(409).json({ message: error.message });
    console.error('[PlanillaController] Error en addPernocta:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addConexion = async (req: Request, res: Response) => {
  const parseResult = registrarConexionSchema.safeParse(req.body);
  if (!parseResult.success) {
     return res.status(400).json({ message: parseResult.error.issues[0].message });
  }

  try {
    const conexion = await service.registrarConexion(req.params.diaId, parseResult.data);
    return res.status(201).json(conexion);
  } catch (error) {
    if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
    console.error('[PlanillaController] Error en addConexion:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addDesconexion = async (req: Request, res: Response) => {
  const parseResult = registrarDesconexionSchema.safeParse(req.body);
  if (!parseResult.success) {
     return res.status(400).json({ message: parseResult.error.issues[0].message });
  }

  try {
    const desconexion = await service.registrarDesconexion(req.params.diaId, parseResult.data);
    return res.status(201).json(desconexion);
  } catch (error) {
    if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
    console.error('[PlanillaController] Error en addDesconexion:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
