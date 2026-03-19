import { useState, useCallback } from 'react';
import { segmentoService } from '../services/segmentoService';
import type { Segmento } from '../types/segmento';
import type { SegmentoFormData } from '../schemasZod/segmentoSchema';
import { useNotification } from './useNotification';

export const useSegmentos = () => {
    const [segmentos, setSegmentos] = useState<Segmento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showValidationError, showServerError } = useNotification();

    const loadSegmentos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await segmentoService.getAll();
            setSegmentos(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de segmentos');
            showServerError(err, 'Error al cargar la lista de segmentos');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSegmento = async (data: SegmentoFormData): Promise<boolean> => {
        setLoading(true);
        try {
            await segmentoService.create(data);
            showSuccess('Segmento registrado correctamente');
            await loadSegmentos();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al registrar el segmento';
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

    const deleteSegmento = async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            await segmentoService.softDelete(id);
            await loadSegmentos();
            setError(null);
            showSuccess('Segmento desactivado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al eliminar el segmento';
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
        segmentos,
        loading,
        error,
        loadSegmentos,
        createSegmento,
        deleteSegmento,
    };
};
