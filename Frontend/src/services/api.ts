import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

api.interceptors.request.use(async (config) => {
    // Artificial delay to improve UX
    await new Promise(resolve => setTimeout(resolve, 350));
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
