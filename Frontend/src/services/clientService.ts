import api from './api';
import type { Client, ClientDetail } from '../types/client';

const RESOURCE = '/clients';

export const clientService = {
    getAll: async (): Promise<Client[]> => {
        const response = await api.get<Client[]>(RESOURCE);
        return response.data;
    },

    getById: async (id: string): Promise<ClientDetail> => {
        const response = await api.get<ClientDetail>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>): Promise<ClientDetail> => {
        const response = await api.post<ClientDetail>(RESOURCE, data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>): Promise<ClientDetail> => {
        const response = await api.put<ClientDetail>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    }
};
