import { Request, Response } from 'express';
import * as equipoService from '../services/equipoService';
import { createEquipoSchema } from '../validators/equipoValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const equipos = await equipoService.getAllEquipos();
        res.json(equipos);
    } catch (error) {
        console.error('[EquipoController] Error al obtener equipos:', error);
        res.status(500).json({ message: 'Error al obtener los equipos' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createEquipoSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const nuevoEquipo = await equipoService.createEquipo(parseResult.data);
        return res.status(201).json(nuevoEquipo);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[EquipoController] Error al crear:', error);
        return res.status(500).json({ message: 'Error al crear el equipo' });
    }
};

export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        await equipoService.softDeleteEquipo(id);
        return res.json({ message: 'Equipo desactivado correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[EquipoController] Error al eliminar:', error);
        return res.status(500).json({ message: 'Error al eliminar el equipo' });
    }
};
