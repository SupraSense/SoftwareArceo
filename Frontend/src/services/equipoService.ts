import api from './api';
import type { Equipo, CreateEquipoDTO } from '../types/equipo';

const RESOURCE = '/equipos';

export const equipoService = {
    getAll: async (): Promise<Equipo[]> => {
        const response = await api.get<Equipo[]>(RESOURCE);
        return response.data;
    },

    create: async (data: CreateEquipoDTO): Promise<Equipo> => {
        const response = await api.post<Equipo>(RESOURCE, data);
        return response.data;
    },

    softDelete: async (id: number): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    },
};
