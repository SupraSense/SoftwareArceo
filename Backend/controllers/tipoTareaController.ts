import { Request, Response } from 'express';
import * as tipoTareaService from '../services/tipoTareaService';
import { createTipoTareaSchema } from '../validators/tipoTareaValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const tipos = await tipoTareaService.getAllTipos();
        res.json(tipos);
    } catch (error) {
        console.error('[TipoTareaController] Error al obtener tipos:', error);
        res.status(500).json({ message: 'Error al obtener los tipos de tarea' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const tipo = await tipoTareaService.getTipoById(id);
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }
        return res.json(tipo);
    } catch (error) {
        console.error('[TipoTareaController] Error al obtener tipo:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de tarea' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createTipoTareaSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const nuevoTipo = await tipoTareaService.createTipo(parseResult.data.nombre);
        return res.status(201).json(nuevoTipo);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[TipoTareaController] Error al crear:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de tarea' });
    }
};

export const update = async (req: Request, res: Response) => {
    const parseResult = createTipoTareaSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const tipoActualizado = await tipoTareaService.updateTipo(Number(req.params.id), parseResult.data.nombre);
        return res.json(tipoActualizado);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[TipoTareaController] Error al actualizar:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de tarea' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await tipoTareaService.deleteTipo(Number(req.params.id));
        return res.json({ message: 'Tipo de tarea eliminado correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[TipoTareaController] Error al eliminar:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de tarea' });
    }
};
