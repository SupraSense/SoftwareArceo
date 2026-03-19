import api from './api';
import type { Segmento, CreateSegmentoDTO } from '../types/segmento';

const RESOURCE = '/segmentos';

export const segmentoService = {
    getAll: async (): Promise<Segmento[]> => {
        const response = await api.get<Segmento[]>(RESOURCE);
        return response.data;
    },

    create: async (data: CreateSegmentoDTO): Promise<Segmento> => {
        const response = await api.post<Segmento>(RESOURCE, data);
        return response.data;
    },

    softDelete: async (id: number): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    },
};
