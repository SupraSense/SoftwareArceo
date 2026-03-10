import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { UserTable } from '../../../components/users/UserTable';
import { useUsers } from '../../../hooks/useUsers';
import type { User } from '../../../types/user';

export const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        users,
        loading,
        loadUsers,
        deactivateUser,
        activateUser,
        resendInvitation,
    } = useUsers();

    // Deactivation confirmation dialog
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);
    const [isDeactivating, setIsDeactivating] = useState(false);

    // Activation confirmation dialog
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
    const [activatingUser, setActivatingUser] = useState<User | null>(null);
    const [isActivating, setIsActivating] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // === Navigate to create page ===
    const handleCreateClick = () => {
        navigate('/app/configuration/usuarios/new');
    };

    // === Navigate to detail/edit page ===
    const handleEditClick = (user: User) => {
        navigate(`/app/configuration/usuarios/${user.id}`);
    };

    // === Deactivation flow ===
    const handleDeactivateClick = (user: User) => {
        setDeactivatingUser(user);
        setIsDeactivateDialogOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        if (!deactivatingUser) return;
        setIsDeactivating(true);
        try {
            await deactivateUser(deactivatingUser.id);
        } finally {
            setIsDeactivating(false);
            setIsDeactivateDialogOpen(false);
            setDeactivatingUser(null);
        }
    };

    // === Activation flow ===
    const handleActivateClick = (user: User) => {
        setActivatingUser(user);
        setIsActivateDialogOpen(true);
    };

    const handleConfirmActivate = async () => {
        if (!activatingUser) return;
        setIsActivating(true);
        try {
            await activateUser(activatingUser.id);
        } finally {
            setIsActivating(false);
            setIsActivateDialogOpen(false);
            setActivatingUser(null);
        }
    };

    // === Resend invitation ===
    const handleResendInvitation = async (user: User) => {
        await resendInvitation(user.id);
    };

    if (loading && users.length === 0) {
        return <Loader message="Cargando usuarios..." />;
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Administra las cuentas, roles y permisos del sistema
                    </p>
                </div>
                <Button
                    onClick={handleCreateClick}
                    leftIcon={<UserPlus size={18} />}
                    className="bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                    Agregar Nuevo Usuario
                </Button>
            </div>

            {/* User table */}
            <UserTable
                users={users}
                onEditUser={handleEditClick}
                onDeactivateUser={handleDeactivateClick}
                onActivateUser={handleActivateClick}
                onResendInvitation={handleResendInvitation}
            />

            {/* Deactivation confirmation — kept as dialog (simple, no form) */}
            {isDeactivateDialogOpen && deactivatingUser && (
                <ConfirmDialog
                    isOpen={true}
                    title="Dar de Baja al Usuario"
                    description={`¿Estás seguro que deseas dar de baja a ${deactivatingUser.firstName} ${deactivatingUser.lastName}? El usuario no podrá acceder al sistema hasta ser reactivado.`}
                    isHardDelete={false}
                    onConfirm={handleConfirmDeactivate}
                    onCancel={() => {
                        setIsDeactivateDialogOpen(false);
                        setDeactivatingUser(null);
                    }}
                    confirmText="Dar de Baja"
                    isLoading={isDeactivating}
                />
            )}

            {/* Activation confirmation — kept as dialog (simple, no form) */}
            {isActivateDialogOpen && activatingUser && (
                <ConfirmDialog
                    isOpen={true}
                    title="Reactivar Usuario"
                    description={`¿Estás seguro que deseas reactivar a ${activatingUser.firstName} ${activatingUser.lastName}? El usuario podrá volver a acceder al sistema.`}
                    isHardDelete={false}
                    onConfirm={handleConfirmActivate}
                    onCancel={() => {
                        setIsActivateDialogOpen(false);
                        setActivatingUser(null);
                    }}
                    confirmText="Reactivar"
                    isLoading={isActivating}
                />
            )}
        </div>
    );
};
