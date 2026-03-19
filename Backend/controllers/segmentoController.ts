import { Request, Response } from 'express';
import * as segmentoService from '../services/segmentoService';
import { createSegmentoSchema } from '../validators/segmentoValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const segmentos = await segmentoService.getAllSegmentos();
        res.json(segmentos);
    } catch (error) {
        console.error('[SegmentoController] Error al obtener segmentos:', error);
        res.status(500).json({ message: 'Error al obtener los segmentos' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createSegmentoSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const nuevoSegmento = await segmentoService.createSegmento(parseResult.data);
        return res.status(201).json(nuevoSegmento);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[SegmentoController] Error al crear:', error);
        return res.status(500).json({ message: 'Error al crear el segmento' });
    }
};

export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        await segmentoService.softDeleteSegmento(id);
        return res.json({ message: 'Segmento desactivado correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[SegmentoController] Error al eliminar:', error);
        return res.status(500).json({ message: 'Error al eliminar el segmento' });
    }
};
