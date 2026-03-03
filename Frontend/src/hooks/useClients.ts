import { useState, useCallback } from 'react';
import { clientService } from '../services/clientService';
import type { Client } from '../types/client';
import type { ClientFormData } from '../schemasZod/clientSchema';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // useCallback memoriza la función para evitar re-renderizados innecesarios en los componentes que la usen
    const loadClients = useCallback(async () => {
        setLoading(true);
        try {
            const data = await clientService.getAll();
            setClients(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de clientes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getClient = async (id: string): Promise<Client | null> => {
        setLoading(true);
        try {
            const data = await clientService.getById(id);
            setError(null);
            return data;
        } catch (err) {
            setError('Error al obtener los detalles del cliente');
            console.error(err);
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
            } else {
                await clientService.create(data);
            }
            await loadClients(); // Refrescamos la lista de fondo
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            const errMsg = errorObj.response?.data?.message || 'Error al guardar el cliente';
            setError(errMsg);
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
            return true;
        } catch (err) {
            setError('Error al eliminar el cliente');
            console.error(err);
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