import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../auth/authService';
import { User, Save, AlertCircle } from 'lucide-react';

interface ProfileForm {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
    address: string;
    role: string;
}

export const Profile: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileForm>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authService.checkAuth();
            if (data.authenticated && data.user) {
                const u = data.user;
                setValue('id', u.id || u.sub); // id from DB or sub from token
                setValue('firstName', u.firstName || u.given_name || '');
                setValue('lastName', u.lastName || u.family_name || '');
                setValue('email', u.email || '');
                setValue('dni', u.dni || '');
                setValue('address', u.address || '');
                setValue('role', u.role || 'User');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Error al cargar perfil' });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProfileForm) => {
        if (!window.confirm('¿Está seguro de guardar los cambios?')) return;

        setSaving(true);
        setMessage(null);
        try {
            await authService.updateProfile(data);
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error al actualizar perfil' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <User size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
                    <p className="text-gray-500 dark:text-gray-400">Administra tu información personal y de cuenta</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    <AlertCircle size={20} />
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Información Personal</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
                        <input
                            {...register('firstName', {
                                required: 'Este campo es obligatorio',
                                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                                pattern: { value: /^[a-zA-Z\s]*$/, message: 'Solo letras' }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                        />
                        {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                    </div>

                    {/* Apellido */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Apellido *</label>
                        <input
                            {...register('lastName', {
                                required: 'Este campo es obligatorio',
                                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                                pattern: { value: /^[a-zA-Z\s]*$/, message: 'Solo letras' }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                        />
                        {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                        <input
                            {...register('email', {
                                required: 'Este campo es obligatorio',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Formato de email inválido'
                                }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    {/* DNI */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">DNI *</label>
                        <input
                            {...register('dni', {
                                required: 'Este campo es obligatorio',
                                pattern: { value: /^\d{7,8}$/, message: 'Debe ser numérico de 7 u 8 dígitos' }
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                        />
                        {errors.dni && <span className="text-xs text-red-500">{errors.dni.message}</span>}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                        <input
                            {...register('address', {
                                maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                            })}
                            placeholder="Calle 123, Ciudad"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                        />
                        {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
                    </div>

                    {/* Role - Read Only */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol (Solo Lectura)</label>
                        <input
                            {...register('role')}
                            readOnly
                            disabled
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
