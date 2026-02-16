import { Request, Response } from 'express';
import * as personalService from '../services/personalService';

// Helper to handle potential errors
const handleError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'An unknown error occurred' });
    }
};

export const createPersonal = async (req: Request, res: Response): Promise<void> => {
    try {
        const personal = await personalService.createPersonal(req.body);
        res.status(201).json(personal);
    } catch (error) {
        handleError(res, error);
    }
};

export const getAllPersonal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, estado, area } = req.query;
        const filters = {
            nombre: typeof nombre === 'string' ? nombre : undefined,
            estado: typeof estado === 'string' ? estado : undefined,
            area: typeof area === 'string' ? area : undefined
        };
        const personalList = await personalService.getAllPersonal(filters);
        res.json(personalList);
    } catch (error) {
        handleError(res, error);
    }
};

export const getPersonalById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID' });
            return;
        }
        const personal = await personalService.getPersonalById(id);
        if (!personal) {
            res.status(404).json({ error: 'Personal not found' });
            return;
        }
        res.json(personal);
    } catch (error) {
        handleError(res, error);
    }
};

export const updatePersonal = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID' });
            return;
        }
        const personal = await personalService.updatePersonal(id, req.body);
        res.json(personal);
    } catch (error) {
        handleError(res, error);
    }
};
