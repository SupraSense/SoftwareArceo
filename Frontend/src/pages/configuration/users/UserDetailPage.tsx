import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, Mail, CreditCard, Shield, Settings, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { updateUserSchema, type UpdateUserFormData } from '../../../schemasZod/userSchema';
import { USER_ROLES, USER_STATUSES } from '../../../types/user';
import type { User as UserType } from '../../../types/user';
import { useUsers } from '../../../hooks/useUsers';
import { useNotification } from '../../../hooks/useNotification';
import { Loader } from '../../../components/ui/Loader';
import api from '../../../services/api';

export const UserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { updateUser } = useUsers();
    const { showServerError } = useNotification();

    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUser = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        } catch {
            showServerError('Error al cargar el usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (loading) {
        return <Loader message="Cargando usuario..." />;
    }

    if (!user) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">Usuario no encontrado.</p>
                <button
                    onClick={() => navigate('/app/configuration/usuarios')}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/app/configuration/usuarios')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Editar Usuario' : 'Detalle de Usuario'}
                </h1>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                {isEditing ? (
                    <div className="p-6">
                        <UserEditFormInline
                            user={user}
                            isSubmitting={isSubmitting}
                            onSubmit={async (data) => {
                                setIsSubmitting(true);
                                try {
                                    const result = await updateUser(user.id, data);
                                    if (result) {
                                        setIsEditing(false);
                                        fetchUser();
                                    }
                                } catch {
                                    // useUsers hook handles error notifications
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-2xl border border-slate-200 dark:border-slate-600">
                                    {(user.firstName || '?').charAt(0)}{(user.lastName || '?').charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                            {user.role || 'Sin rol'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'ACTIVO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            user.status === 'PENDIENTE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsEditing(true)}
                                leftIcon={<Edit size={18} />}
                                className="bg-[#1e293b] hover:bg-[#334155] text-white"
                            >
                                Editar Usuario
                            </Button>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-700/20 rounded-xl p-5 space-y-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Información Personal</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Mail size={18} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <CreditCard size={18} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">DNI</p>
                                            <p>{user.dni || 'No registrado'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/20 rounded-xl p-5 space-y-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Cuenta</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Shield size={18} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Rol</p>
                                            <p>{user.role || 'Sin asignar'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Settings size={18} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Estado</p>
                                            <p>{user.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Inline Edit Form (embedded in page, not a modal) ────

interface UserEditFormInlineProps {
    user: UserType;
    isSubmitting: boolean;
    onSubmit: (data: UpdateUserFormData) => Promise<void>;
    onCancel: () => void;
}

const UserEditFormInline: React.FC<UserEditFormInlineProps> = ({
    user,
    isSubmitting,
    onSubmit,
    onCancel,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            dni: user.dni || '',
            email: user.email || '',
            role: user.role || undefined,
            status: user.status || undefined,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name fields row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Nombre"
                    placeholder="Ej: Juan"
                    icon={<User size={16} />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <Input
                    label="Apellido"
                    placeholder="Ej: Pérez"
                    icon={<User size={16} />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            {/* DNI */}
            <Input
                label="DNI"
                placeholder="Ej: 30456789"
                icon={<CreditCard size={16} />}
                maxLength={8}
                error={errors.dni?.message}
                {...register('dni')}
            />

            {/* Email */}
            <Input
                label="Email"
                type="email"
                placeholder="Ej: juan.perez@empresa.com"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                {...register('email')}
            />

            {/* Role + Status row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                        <div className="flex items-center gap-1.5">
                            <Shield size={14} className="text-gray-400" />
                            Rol
                        </div>
                    </label>
                    <select
                        className={`
                            w-full rounded-lg border bg-surface text-text-primary 
                            dark:bg-gray-800 dark:border-gray-700 dark:text-white
                            focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow
                            px-4 py-2 appearance-none cursor-pointer
                            ${errors.role ? 'border-red-500 focus:ring-red-200' : 'border-border'}
                        `}
                        {...register('role')}
                    >
                        <option value="" disabled>Seleccionar rol...</option>
                        {USER_ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                        Estado
                    </label>
                    <select
                        className={`
                            w-full rounded-lg border bg-surface text-text-primary 
                            dark:bg-gray-800 dark:border-gray-700 dark:text-white
                            focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow
                            px-4 py-2 appearance-none cursor-pointer
                            ${errors.status ? 'border-red-500 focus:ring-red-200' : 'border-border'}
                        `}
                        {...register('status')}
                    >
                        {USER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={!isDirty}
                >
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
};
