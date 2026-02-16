import React from 'react';
import type { Personal } from '../../types/personal';
import { Eye, Pencil, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StaffListProps {
    staff: Personal[];
    loading: boolean;
    onEdit: (personal: Personal) => void;
    onView: (personal: Personal) => void;
}

export const StaffList: React.FC<StaffListProps> = ({ staff, loading, onEdit, onView }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center transition-colors">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-400 mx-auto"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando personal...</p>
            </div>
        );
    }

    if (staff.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center transition-colors">
                <p className="text-gray-500 dark:text-gray-400">No se encontró personal con los filtros seleccionados.</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disponible': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'En Servicio': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Licencia': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Lista de Personal ({staff.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Área</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Contacto</th>
                            <th className="px-6 py-3 text-center">OT Activas</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {staff.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{employee.nombre} {employee.apellido}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {employee.area}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.estado)}`}>
                                        {employee.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {employee.telefono && (
                                            <a href={`tel:${employee.telefono}`} className="p-1 rounded-md text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50" title={employee.telefono}>
                                                <Phone size={16} />
                                            </a>
                                        )}
                                        <a href={`mailto:${employee.email}`} className="p-1 rounded-md text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50" title={employee.email}>
                                            <Mail size={16} />
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {/* Mocked value as requested */}
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {Math.floor(Math.random() * 3)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/app/staff/${employee.id}`)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                            title="Ver Detalle"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(employee)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
