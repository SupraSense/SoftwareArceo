import { Request, Response } from 'express';
import * as clientService from '../services/clientService';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        const response = clients.map((c: any) => ({
            id: c.id,
            razonSocial: c.razonSocial,
            cuit: c.cuit,
            contactName: c.contacts[0]?.name || 'Sin Contacto',
            phone: c.contacts[0]?.phone || '',
            email: c.contacts[0]?.email || '',
            activeContracts: c._count.contracts,
            status: c.status.name,
        }));
        res.json(response);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Error fetching clients', error });
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const client = await clientService.getClientById(id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Map to required format, excluding Last OT
        const response = {
            id: client.id,
            razonSocial: client.razonSocial,
            cuit: client.cuit,
            address: client.direccion,
            status: client.status.name,
            contactName: (client as any).contacts[0]?.name || 'Sin Contacto',
            phone: (client as any).contacts[0]?.phone || '',
            email: (client as any).contacts[0]?.email || '',
            activeContracts: (client as any)._count.contracts
        };
        return res.json(response);
    } catch (error) {
        console.error('Error fetching client details:', error);
        return res.status(500).json({ message: 'Error fetching client details', error });
    }
};

export const create = async (req: Request, res: Response) => {
    const { razonSocial, cuit, address, contactName, phone, email } = req.body;

    // Validations
    if (!razonSocial) return res.status(400).json({ message: 'Business Name is required' });

    // CUIT validation: XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuit || !cuitRegex.test(cuit)) {
        return res.status(400).json({ message: 'Invalid CUIT format. Expected XX-XXXXXXXX-X' });
    }

    try {
        const newClient = await clientService.createClient({
            razonSocial, cuit, address, contactName, phone, email
        });
        return res.status(201).json(newClient);
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint violation (likely CUIT)
            return res.status(400).json({ message: 'El CUIT ingresado ya existe.' });
        }
        console.error('Error creating client:', error);
        return res.status(500).json({ message: 'Error creating client', error });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { razonSocial, cuit, address, contactName, phone, email } = req.body;

    try {
        const updatedClient = await clientService.updateClient(id, {
            razonSocial, cuit, address, contactName, phone, email
        });
        return res.json(updatedClient);
    } catch (error: any) {
        if (error.message === "Cannot update CUIT for client with existing contracts") {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error updating client:', error);
        return res.status(500).json({ message: 'Error updating client', error });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await clientService.deleteClient(id); // Ensure deleteClient exists in service
        return res.status(204).send();
    } catch (error: any) {
        if (error.message === "Client not found") {
            return res.status(404).json({ message: "Client not found" });
        }
        console.error('Error deleting client:', error);
        return res.status(500).json({ message: 'Error deleting client', error });
    }
};
