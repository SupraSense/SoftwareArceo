import api from './api';
import type { User, CreateUserDTO, UpdateUserDTO, UserValidationResponse } from '../types/user';

const RESOURCE = '/users';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>(RESOURCE);
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await api.get<User>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: CreateUserDTO): Promise<User> => {
        const response = await api.post<User>(RESOURCE, data);
        return response.data;
    },

    update: async (id: string, data: UpdateUserDTO): Promise<User> => {
        const response = await api.put<User>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    deactivate: async (id: string): Promise<void> => {
        await api.patch(`${RESOURCE}/${id}/deactivate`);
    },

    activate: async (id: string): Promise<void> => {
        await api.patch(`${RESOURCE}/${id}/activate`);
    },

    checkEmailAvailability: async (email: string, excludeId?: string): Promise<UserValidationResponse> => {
        const params = excludeId ? { excludeId } : {};
        const response = await api.get<UserValidationResponse>(`${RESOURCE}/validate/email`, {
            params: { email, ...params }
        });
        return response.data;
    },

    checkDniAvailability: async (dni: string, excludeId?: string): Promise<UserValidationResponse> => {
        const params = excludeId ? { excludeId } : {};
        const response = await api.get<UserValidationResponse>(`${RESOURCE}/validate/dni`, {
            params: { dni, ...params }
        });
        return response.data;
    },

    resendInvitation: async (id: string): Promise<void> => {
        await api.post(`${RESOURCE}/${id}/resend-invitation`);
    },
};
