import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, CreditCard, Shield, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { updateUserSchema, type UpdateUserFormData } from '../../schemasZod/userSchema';
import { USER_ROLES, USER_STATUSES } from '../../types/user';
import type { User as UserType } from '../../types/user';

interface UserEditFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: UpdateUserFormData) => Promise<boolean>;
    user: UserType | null;
    isLoading?: boolean;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    isLoading = false,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (isOpen && user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                dni: user.dni || '',
                email: user.email || '',
                role: user.role || undefined,
                status: user.status || undefined,
            });
        }
    }, [isOpen, user, reset]);

    const handleFormSubmit = async (data: UpdateUserFormData) => {
        if (!user) return;
        const success = await onSubmit(user.id, data);
        if (success) {
            onClose();
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Editar Usuario
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.firstName} {user.lastName} — {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
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
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={!isDirty}
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
