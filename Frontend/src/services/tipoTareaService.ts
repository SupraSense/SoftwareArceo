import api from './api';
import type { TipoTarea, CreateTipoTareaDTO, UpdateTipoTareaDTO } from '../types/tipoTarea';

const RESOURCE = '/tipo-tarea';

export const tipoTareaService = {
    getAll: async (): Promise<TipoTarea[]> => {
        const response = await api.get<TipoTarea[]>(RESOURCE);
        return response.data;
    },

    getById: async (id: number): Promise<TipoTarea> => {
        const response = await api.get<TipoTarea>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: CreateTipoTareaDTO): Promise<TipoTarea> => {
        const response = await api.post<TipoTarea>(RESOURCE, data);
        return response.data;
    },

    update: async (id: number, data: UpdateTipoTareaDTO): Promise<TipoTarea> => {
        const response = await api.put<TipoTarea>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    }
};
