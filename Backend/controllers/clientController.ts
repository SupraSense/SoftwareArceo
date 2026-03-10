import { Request, Response } from 'express';
import * as clientService from '../services/clientService';
import { createClientSchema, updateClientSchema } from '../validators/clientValidation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error) {
        console.error('[ClientController] Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener la lista de clientes' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const client = await clientService.getClientById(req.params.id);
        return res.json(client);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[ClientController] Error al obtener cliente:', error);
        return res.status(500).json({ message: 'Error al obtener el cliente' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createClientSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const newClient = await clientService.createClient(parseResult.data);
        return res.status(201).json(newClient);
    } catch (error) {
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[ClientController] Error al crear cliente:', error);
        return res.status(500).json({ message: 'Error al crear el cliente' });
    }
};

export const update = async (req: Request, res: Response) => {
    const parseResult = updateClientSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const updatedClient = await clientService.updateClient(req.params.id, parseResult.data);
        return res.json(updatedClient);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ConflictError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('[ClientController] Error al actualizar cliente:', error);
        return res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        await clientService.deleteClient(req.params.id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[ClientController] Error al eliminar cliente:', error);
        return res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};
