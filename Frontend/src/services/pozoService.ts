import api from './api';
import type { Pozo, CreatePozoDTO } from '../types/pozo';

const RESOURCE = '/pozos';

export const pozoService = {
    getAll: async (): Promise<Pozo[]> => {
        const response = await api.get<Pozo[]>(RESOURCE);
        return response.data;
    },

    create: async (data: CreatePozoDTO): Promise<Pozo> => {
        const response = await api.post<Pozo>(RESOURCE, data);
        return response.data;
    },

    softDelete: async (id: string): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    },
};
