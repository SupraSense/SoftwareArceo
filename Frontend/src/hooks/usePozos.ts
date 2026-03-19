import { useState, useCallback } from 'react';
import { pozoService } from '../services/pozoService';
import type { Pozo } from '../types/pozo';
import type { PozoFormData } from '../schemasZod/pozoSchema';
import { useNotification } from './useNotification';

export const usePozos = () => {
    const [pozos, setPozos] = useState<Pozo[]>([]);
    const [availablePozos, setAvailablePozos] = useState<Pozo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showValidationError, showServerError } = useNotification();

    const loadPozos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await pozoService.getAll();
            setPozos(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de pozos');
            showServerError(err, 'Error al cargar la lista de pozos');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAvailablePozos = useCallback(async () => {
        try {
            const data = await pozoService.getAvailable();
            setAvailablePozos(data);
        } catch (err) {
            showServerError(err, 'Error al cargar pozos disponibles');
        }
    }, []);

    const createPozo = async (data: PozoFormData): Promise<boolean> => {
        setLoading(true);
        try {
            await pozoService.create(data);
            showSuccess('Pozo registrado correctamente');
            await loadPozos();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al registrar el pozo';
            setError(errMsg);

            if (status === 400 || status === 403 || status === 404 || status === 409) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const associatePozo = async (pozoId: string, clienteId: string): Promise<boolean> => {
        try {
            await pozoService.associate(pozoId, clienteId);
            showSuccess('Pozo asociado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al asociar el pozo';

            if (status === 409) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        }
    };

    const disassociatePozo = async (pozoId: string): Promise<boolean> => {
        try {
            await pozoService.disassociate(pozoId);
            showSuccess('Pozo desasociado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al desasociar el pozo';

            if (status === 404) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        }
    };

    const deletePozo = async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await pozoService.softDelete(id);
            await loadPozos();
            setError(null);
            showSuccess('Pozo desactivado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al eliminar el pozo';
            setError(errMsg);

            if (status === 400 || status === 403 || status === 404) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        pozos,
        availablePozos,
        loading,
        error,
        loadPozos,
        loadAvailablePozos,
        createPozo,
        associatePozo,
        disassociatePozo,
        deletePozo,
    };
};
