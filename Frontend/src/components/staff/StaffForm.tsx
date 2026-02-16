import React, { useState, useEffect } from 'react';
import type { Personal } from '../../types/personal';
import api from '../../services/api';
import { X, Save, AlertCircle } from 'lucide-react';

interface StaffFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    initialData?: Personal | null;
}

export const StaffForm: React.FC<StaffFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        area: 'Logística',
        estado: 'Disponible',
        fecha_ingreso: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState<string | null>(null);
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

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (initialData) {
                await api.put(`/personal/${initialData.id}`, formData);
            } else {
                await api.post('/personal', formData);
            }
            onSubmit();
        } catch (err: any) {
            // Handle generic or specific errors (like duplicate email)
            const msg = err.response?.data?.error || err.response?.data?.message || 'Ocurrió un error al guardar.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Editar Personal' : 'Registrar Nuevo Personal'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Apellido *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                value={formData.apellido}
                                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Área *</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            >
                                <option value="Logística">Logística</option>
                                <option value="Módulos">Módulos</option>
                                <option value="Periféricos">Periféricos</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Inicial *</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                disabled={!initialData} // Create defaults to 'Disponible' but allow edit
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="En Servicio">En Servicio</option>
                                <option value="Licencia">Licencia</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Ingreso *</label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                                value={formData.fecha_ingreso}
                                onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>Wait...</>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {initialData ? 'Guardar Cambios' : 'Registrar'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
