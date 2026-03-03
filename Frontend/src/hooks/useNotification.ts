import { toast } from 'sonner';

export const useNotification = () => {
    const showSuccess = (message: string, description?: string) => {
        toast.success(message, { description });
    };

    const showValidationError = (message: string, description?: string) => {
        toast.warning(message, { description });
    };

    const showServerError = (error: unknown, fallbackMessage = 'Ocurrió un error inesperado al procesar tu solicitud') => {
        console.error('[Server Error]:', error);
        toast.error(fallbackMessage);
    };

    const showInfo = (message: string, description?: string) => {
        toast.info(message, { description });
    };

    return {
        showSuccess,
        showValidationError,
        showServerError,
        showInfo
    };
};
