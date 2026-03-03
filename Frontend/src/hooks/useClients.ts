import { useState, useCallback } from 'react';
import { clientService } from '../services/clientService';
import type { Client } from '../types/client';
import type { ClientFormData } from '../schemasZod/clientSchema';
import { useNotification } from './useNotification';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showValidationError, showServerError } = useNotification();

    // useCallback memoriza la función para evitar re-renderizados innecesarios en los componentes que la usen
    const loadClients = useCallback(async () => {
        setLoading(true);
        try {
            const data = await clientService.getAll();
            setClients(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de clientes');
            showServerError(err, 'Error al cargar la lista de clientes');
        } finally {
            setLoading(false);
        }
    }, [showServerError]);

    const getClient = async (id: string): Promise<Client | null> => {
        setLoading(true);
        try {
            const data = await clientService.getById(id);
            setError(null);
            return data;
        } catch (err) {
            setError('Error al obtener los detalles del cliente');
            showServerError(err, 'Error al obtener los detalles del cliente');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const saveClient = async (data: ClientFormData, id?: string): Promise<boolean> => {
        setLoading(true);
        try {
            if (id) {
                await clientService.update(id, data);
                showSuccess('Cliente actualizado correctamente');
            } else {
                await clientService.create(data);
                showSuccess('Cliente registrado correctamente');
            }
            await loadClients(); // Refrescamos la lista de fondo
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number, data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al guardar el cliente';
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

    const deleteClient = async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await clientService.delete(id);
            await loadClients();
            setError(null);
            showSuccess('Cliente eliminado correctamente');
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number, data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al eliminar el cliente';
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
        clients,
        loading,
        error,
        loadClients,
        getClient,
        saveClient,
        deleteClient
    };
};