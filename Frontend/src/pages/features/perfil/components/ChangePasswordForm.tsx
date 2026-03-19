import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { changePasswordSchema } from '../../../../schemasZod/authSchema';
import type { ChangePasswordInput } from '../../../../schemasZod/authSchema';
import { Input } from '../../../../components/ui/Input';

interface Props {
    onSubmitData: (data: ChangePasswordInput) => void;
    isLoading: boolean;
}

export const ChangePasswordForm: React.FC<Props> = ({ onSubmitData, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmitData)} className="p-6">
            <div className="grid grid-cols-1 gap-6 max-w-md">
                <Input
                    label="Contraseña Actual *"
                    type="password"
                    {...register('currentPassword')}
                    error={errors.currentPassword?.message}
                />

                <Input
                    label="Nueva Contraseña *"
                    type="password"
                    {...register('newPassword')}
                    error={errors.newPassword?.message}
                />

                <Input
                    label="Confirmar Nueva Contraseña *"
                    type="password"
                    {...register('confirmNewPassword')}
                    error={errors.confirmNewPassword?.message}
                />
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
            </div>
        </form>
    );
};
