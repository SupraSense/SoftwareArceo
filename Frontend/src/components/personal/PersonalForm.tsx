import React, { useState, useEffect } from 'react';
import type { Personal } from '../../types/personal';
import api from '../../services/api';
import { User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useNotification } from '../../hooks/useNotification';

interface StaffFormProps {
    onCancel: () => void;
    onSubmit: () => void;
    initialData?: Personal | null;
}

export const PersonalForm: React.FC<StaffFormProps> = ({ onCancel, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        area: 'Logística',
        estado: 'Disponible',
        fecha_ingreso: new Date().toISOString().split('T')[0]
    });
    const { showSuccess, showValidationError, showServerError } = useNotification();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                apellido: initialData.apellido,
                email: initialData.email,
                telefono: initialData.telefono || '',
                area: initialData.area,
                estado: initialData.estado,
                fecha_ingreso: new Date(initialData.fecha_ingreso).toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                await api.put(`/personal/${initialData.id}`, formData);
                showSuccess('Personal actualizado correctamente');
            } else {
                await api.post('/personal', formData);
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
        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre *"
                    icon={<User size={18} />}
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />

                <Input
                    label="Apellido *"
                    icon={<User size={18} />}
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                />

                <Input
                    label="Email *"
                    icon={<Mail size={18} />}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                    label="Teléfono"
                    icon={<Phone size={18} />}
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Área *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Briefcase size={18} />
                        </div>
                        <select
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow pl-10 pr-4 py-2"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        >
                            <option value="Logística">Logística</option>
                            <option value="Módulos">Módulos</option>
                            <option value="Periféricos">Periféricos</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Fecha de Ingreso *"
                    icon={<Calendar size={18} />}
                    type="date"
                    required
                    className="[color-scheme:light] dark:[color-scheme:dark]"
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={loading}>
                    {initialData ? 'Guardar Cambios' : 'Registrar Personal'}
                </Button>
            </div>
        </form>
    );
};
