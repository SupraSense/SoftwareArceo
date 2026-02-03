import axios from 'axios';
import keycloak from '../auth/keycloak';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(
    (config) => {
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
