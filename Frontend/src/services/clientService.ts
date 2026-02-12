import api from './api';
import type { Client } from '../types/client';

const RESOURCE = '/clients';

export const clientService = {
    getAll: async (): Promise<Client[]> => {
        const response = await api.get<Client[]>(RESOURCE);
        return response.data;
    },

    getById: async (id: string): Promise<Client> => {
        const response = await api.get<Client>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: Partial<Client>): Promise<Client> => {
        const response = await api.post<Client>(RESOURCE, data);
        return response.data;
    },

    update: async (id: string, data: Partial<Client>): Promise<Client> => {
        const response = await api.put<Client>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    }
};
