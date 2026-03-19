import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Extensión del config de Axios para marcar peticiones que ya intentaron refresh.
 * Esto evita bucles infinitos: si una petición ya fue reintentada, no se vuelve a intentar.
 * Se usa AxiosRequestConfig (exportado en runtime) en lugar de InternalAxiosRequestConfig
 * (tipo interno que Vite no puede resolver como export ESM).
 */
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true // Envía cookies HttpOnly automáticamente en cada petición
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
    // Delay artificial para mejorar UX (evita "flashes" en estados de carga)
    await new Promise(resolve => setTimeout(resolve, 350));
    return config;
});

// ─── Silent Refresh: Mutex State ──────────────────────────────────────────────
// Estas variables implementan un patrón "mutex" para coordinar el refresh:
// - Solo UNA petición ejecuta el refresh; las demás se encolan y esperan.
// - Cuando el refresh termina, todas las peticiones encoladas se resuelven/rechazan.
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

/**
 * Procesa la cola de peticiones que estaban esperando el refresh.
 * Si el refresh tuvo éxito (error === null), resuelve todas las promesas.
 * Si falló, las rechaza — lo que propagará el error a cada petición individual.
 */
const processQueue = (error: AxiosError | null): void => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

// ─── Response Interceptor (Silent Refresh Logic) ──────────────────────────────
api.interceptors.response.use(
    // Respuestas exitosas pasan sin modificación
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Condiciones para NO intentar refresh:
        // 1. No es un 401 (puede ser 403, 500, etc.)
        // 2. La petición ya fue reintentada (_retry = true → evita bucle infinito)
        // 3. La petición original ERA al endpoint de refresh (evita recursión)
        // 4. La petición original era al login (un 401 de login es credenciales inválidas)
        const isUnauthorized = error.response?.status === 401;
        const isRetry = originalRequest?._retry;
        const isRefreshUrl = originalRequest?.url?.includes('/auth/refresh');
        const isLoginUrl = originalRequest?.url?.includes('/auth/login');

        if (!isUnauthorized || isRetry || isRefreshUrl || isLoginUrl) {
            return Promise.reject(error);
        }

        // ─── Mutex: Si ya hay un refresh en curso, encolar esta petición ──────
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                // Cuando el refresh termine exitosamente, reintentar la petición original
                // Las cookies ya fueron actualizadas por el backend
                return api(originalRequest);
            });
        }

        // ─── Esta es la primera petición que detecta el 401: ejecuta el refresh ──
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Llama al endpoint de refresh del backend.
            // El backend toma el refresh_token de la cookie, lo envía a Keycloak,
            // y pisa ambas cookies con los nuevos tokens.
            await api.post('/auth/refresh');

            // Refresh exitoso → resolver todas las peticiones encoladas
            processQueue(null);

            // Reintentar la petición original (ahora con el nuevo access_token en la cookie)
            return api(originalRequest);

        } catch (refreshError) {
            // Refresh falló → la sesión expiró definitivamente
            // Rechazar todas las peticiones encoladas
            processQueue(refreshError as AxiosError);

            // Redirigir al login — el usuario debe autenticarse de nuevo
            window.location.href = '/login';

            return Promise.reject(refreshError);

        } finally {
            // Siempre liberar el mutex, sin importar el resultado
            isRefreshing = false;
        }
    }
);

export default api;
