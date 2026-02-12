import api from '../services/api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        window.location.href = '/login';
    },

    checkAuth: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put('/auth/me', data);
        return response.data;
    }
};

