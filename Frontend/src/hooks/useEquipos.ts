import { useState, useCallback } from 'react';
import { equipoService } from '../services/equipoService';
import type { Equipo } from '../types/equipo';
import type { EquipoFormData } from '../schemasZod/equipoSchema';
import { useNotification } from './useNotification';

export const useEquipos = () => {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showValidationError, showServerError } = useNotification();

    const loadEquipos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await equipoService.getAll();
            setEquipos(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de equipos');
            showServerError(err, 'Error al cargar la lista de equipos');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEquipo = async (data: EquipoFormData): Promise<boolean> => {
        setLoading(true);
        try {
            await equipoService.create(data);
            showSuccess('Equipo registrado correctamente');
            await loadEquipos();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al registrar el equipo';
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

    const deleteEquipo = async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            await equipoService.softDelete(id);
            await loadEquipos();
            setError(null);
            showSuccess('Equipo desactivado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al eliminar el equipo';
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
        equipos,
        loading,
        error,
        loadEquipos,
        createEquipo,
        deleteEquipo,
    };
};
