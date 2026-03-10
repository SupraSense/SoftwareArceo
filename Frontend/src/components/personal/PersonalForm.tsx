import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Personal } from '../../types/personal';
import api from '../../services/api';
import { User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useNotification } from '../../hooks/useNotification';

const personalSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellido: z.string().min(1, 'El apellido es obligatorio'),
    email: z.string().email('Email inválido'),
    telefono: z.string().optional(),
    area: z.string().min(1, 'El área es obligatoria'),
    estado: z.string(),
    fecha_ingreso: z.string().min(1, 'La fecha de ingreso es obligatoria')
});

type PersonalFormData = z.infer<typeof personalSchema>;

interface StaffFormProps {
    onCancel: () => void;
    onSubmit: () => void;
    initialData?: Personal | null;
}

export const PersonalForm: React.FC<StaffFormProps> = ({ onCancel, onSubmit, initialData }) => {
    const { showSuccess, showValidationError, showServerError } = useNotification();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            nombre: initialData?.nombre || '',
            apellido: initialData?.apellido || '',
            email: initialData?.email || '',
            telefono: initialData?.telefono || '',
            area: initialData?.area || 'Logística',
            estado: initialData?.estado || 'Disponible',
            fecha_ingreso: initialData
                ? new Date(initialData.fecha_ingreso).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
        }
    });

    const onSubmitForm = async (data: PersonalFormData) => {
        try {
            if (initialData) {
                await api.put(`/personal/${initialData.id}`, data);
                showSuccess('Personal actualizado correctamente');
            } else {
                await api.post('/personal', data);
                showSuccess('Personal registrado correctamente');
            }
            onSubmit();
        } catch (err: any) {
            const status = err.response?.status;
            const msg = err.response?.data?.error || err.response?.data?.message || 'Ocurrió un error al guardar.';

            if (status === 400 || status === 403 || status === 404) {
                showValidationError(msg);
            } else {
                showServerError(err, msg);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre"
                    icon={<User size={18} />}
                    placeholder="Ingrese el nombre"
                    error={errors.nombre?.message}
                    {...register('nombre')}
                />

                <Input
                    label="Apellido"
                    icon={<User size={18} />}
                    placeholder="Ingrese el apellido"
                    error={errors.apellido?.message}
                    {...register('apellido')}
                />

                <Input
                    label="Email"
                    icon={<Mail size={18} />}
                    placeholder="contacto@empresa.com"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Teléfono"
                    icon={<Phone size={18} />}
                    placeholder="Ej. 112345679"
                    type="tel"
                    error={errors.telefono?.message}
                    {...register('telefono')}
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Área
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Briefcase size={18} />
                        </div>
                        <select
                            {...register('area')}
                            className={`w-full rounded-lg border bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow pl-10 pr-4 py-2 ${errors.area ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <option value="Logística">Logística</option>
                            <option value="Módulos">Módulos</option>
                            <option value="Periféricos">Periféricos</option>
                        </select>
                    </div>
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                </div>

                <Input
                    label="Fecha de Ingreso"
                    icon={<Calendar size={18} />}
                    type="date"
                    className="[color-scheme:light] dark:[color-scheme:dark]"
                    error={errors.fecha_ingreso?.message}
                    {...register('fecha_ingreso')}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                    {initialData ? 'Guardar Cambios' : 'Registrar Personal'}
                </Button>
            </div>
        </form>
    );
};