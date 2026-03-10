import { useState, useCallback } from 'react';
import { userService } from '../services/userService';
import type { User, UpdateUserDTO } from '../types/user';
import type { CreateUserFormData } from '../schemasZod/userSchema';
import { useNotification } from './useNotification';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showValidationError, showServerError } = useNotification();

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar la lista de usuarios');
            showServerError(err, 'Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    }, [showServerError]);

    const createUser = async (data: CreateUserFormData): Promise<boolean> => {
        setLoading(true);
        try {
            await userService.create(data);
            showSuccess(
                'Usuario registrado correctamente',
                'Se enviará un email con las credenciales de acceso'
            );
            await loadUsers();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al registrar el usuario';
            setError(errMsg);

            if (status === 400 || status === 409) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, data: UpdateUserDTO): Promise<boolean> => {
        setLoading(true);
        try {
            await userService.update(id, data);
            showSuccess('Usuario actualizado correctamente');
            await loadUsers();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al actualizar el usuario';
            setError(errMsg);

            if (status === 400 || status === 409) {
                showValidationError(errMsg);
            } else {
                showServerError(err, errMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deactivateUser = async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await userService.deactivate(id);
            showSuccess('Usuario dado de baja correctamente');
            await loadUsers();
            setError(null);
            return true;
        } catch (err) {
            const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
            const status = errorObj.response?.status;
            const errMsg = errorObj.response?.data?.message || 'Error al dar de baja al usuario';
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

    const activateUser = async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await userService.activate(id);
            showSuccess('Usuario reactivado correctamente');
            await loadUsers();
            setError(null);
            return true;
        } catch (err) {
            showServerError(err, 'Error al reactivar el usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendInvitation = async (id: string): Promise<boolean> => {
        try {
            await userService.resendInvitation(id);
            showSuccess(
                'Invitación reenviada',
                'Se envió un nuevo email con las credenciales de acceso'
            );
            return true;
        } catch (err) {
            showServerError(err, 'Error al reenviar la invitación');
            return false;
        }
    };

    return {
        users,
        loading,
        error,
        loadUsers,
        createUser,
        updateUser,
        deactivateUser,
        activateUser,
        resendInvitation,
    };
};
