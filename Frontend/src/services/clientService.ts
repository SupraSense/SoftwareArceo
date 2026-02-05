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
    }
};
