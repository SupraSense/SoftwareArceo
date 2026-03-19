import { Request, Response } from 'express';
import * as pozoService from '../services/pozoService';
import { createPozoSchema } from '../validators/pozoValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const pozos = await pozoService.getAllPozos();
        res.json(pozos);
    } catch (error) {
        console.error('[PozoController] Error al obtener pozos:', error);
        res.status(500).json({ message: 'Error al obtener los pozos' });
    }
};

export const getAvailable = async (_req: Request, res: Response) => {
    try {
        const pozos = await pozoService.getAvailablePozos();
        res.json(pozos);
    } catch (error) {
        console.error('[PozoController] Error al obtener pozos disponibles:', error);
        res.status(500).json({ message: 'Error al obtener los pozos disponibles' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createPozoSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const nuevoPozo = await pozoService.createPozo(parseResult.data);
        return res.status(201).json(nuevoPozo);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[PozoController] Error al crear:', error);
        return res.status(500).json({ message: 'Error al crear el pozo' });
    }
};

export const associate = async (req: Request, res: Response) => {
    const { clienteId } = req.body;
    if (!clienteId) {
        return res.status(400).json({ message: 'El clienteId es obligatorio' });
    }

    try {
        const pozo = await pozoService.associateToClient(req.params.id, clienteId);
        return res.json(pozo);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[PozoController] Error al asociar pozo:', error);
        return res.status(500).json({ message: 'Error al asociar el pozo al cliente' });
    }
};

export const disassociate = async (req: Request, res: Response) => {
    try {
        const pozo = await pozoService.disassociateFromClient(req.params.id);
        return res.json(pozo);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[PozoController] Error al desasociar pozo:', error);
        return res.status(500).json({ message: 'Error al desasociar el pozo' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await pozoService.softDeletePozo(req.params.id);
        return res.json({ message: 'Pozo desactivado correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[PozoController] Error al eliminar:', error);
        return res.status(500).json({ message: 'Error al eliminar el pozo' });
    }
};
