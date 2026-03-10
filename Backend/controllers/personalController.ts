import { Request, Response } from 'express';
import * as personalService from '../services/personalService';
import { createPersonalSchema, updatePersonalSchema } from '../validators/personalValidation';
import { NotFoundError, ValidationError } from '../lib/errors';

export const createPersonal = async (req: Request, res: Response) => {
    const parseResult = createPersonalSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const personal = await personalService.createPersonal(parseResult.data);
        return res.status(201).json(personal);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('[PersonalController] Error al crear personal:', error);
        return res.status(500).json({ message: 'Error al crear el personal' });
    }
};

export const getAllPersonal = async (req: Request, res: Response) => {
    try {
        const { nombre, estado, area } = req.query;
        const filters = {
            nombre: typeof nombre === 'string' ? nombre : undefined,
            estado: typeof estado === 'string' ? estado : undefined,
            area: typeof area === 'string' ? area : undefined,
        };
        const personalList = await personalService.getAllPersonal(filters);
        res.json(personalList);
    } catch (error) {
        console.error('[PersonalController] Error al obtener personal:', error);
        res.status(500).json({ message: 'Error al obtener la lista de personal' });
    }
};

export const getPersonalById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const personal = await personalService.getPersonalById(id);
        return res.json(personal);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[PersonalController] Error al obtener personal:', error);
        return res.status(500).json({ message: 'Error al obtener el personal' });
    }
};

export const updatePersonal = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const parseResult = updatePersonalSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const personal = await personalService.updatePersonal(id, parseResult.data);
        return res.json(personal);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('[PersonalController] Error al actualizar personal:', error);
        return res.status(500).json({ message: 'Error al actualizar el personal' });
    }
};
