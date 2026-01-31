import axios from 'axios';
import type { TipoTarea, CreateTipoTareaDTO, UpdateTipoTareaDTO } from '../types/tipoTarea';

const API_URL = 'http://localhost:3000/api/tipo-tarea';

export const tipoTareaService = {
    getAll: async (): Promise<TipoTarea[]> => {
        const response = await axios.get<TipoTarea[]>(API_URL);
        return response.data;
    },

    getById: async (id: number): Promise<TipoTarea> => {
        const response = await axios.get<TipoTarea>(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (data: CreateTipoTareaDTO): Promise<TipoTarea> => {
        const response = await axios.post<TipoTarea>(API_URL, data);
        return response.data;
    },

    update: async (id: number, data: UpdateTipoTareaDTO): Promise<TipoTarea> => {
        const response = await axios.put<TipoTarea>(`${API_URL}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
