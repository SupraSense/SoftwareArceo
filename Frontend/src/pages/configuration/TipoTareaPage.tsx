import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { tipoTareaService } from '../../services/tipoTareaService';
import type { TipoTarea } from '../../types/tipoTarea';
import { Button } from '../../components/ui/Button';
import { TipoTareaForm } from '../../components/tipoTarea/TipoTareaForm';

export const TipoTareaPage: React.FC = () => {
    const [tipos, setTipos] = useState<TipoTarea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TipoTarea | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTipos = async () => {
        try {
            setIsLoading(true);
            const data = await tipoTareaService.getAll();
            setTipos(data);
        } catch (error) {
            console.error('Error fetching tipos de tarea:', error);
            // Ideally use a toast notification here
            alert('Error al cargar tipos de tarea');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: TipoTarea) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este tipo de tarea?')) return;

        try {
            await tipoTareaService.delete(id);
            fetchTipos();
        } catch (error) {
            console.error('Error deleting tipo de tarea:', error);
            alert('Error al eliminar');
        }
    };

    const handleSubmit = async (data: { nombre: string }) => {
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await tipoTareaService.update(editingItem.id, data);
            } else {
                await tipoTareaService.create(data);
            }
            await fetchTipos();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            // @ts-ignore
            if (error.response?.status === 409) {
                alert('Ya existe un tipo de tarea con ese nombre');
            } else {
                alert('Error al guardar');
            }
            throw error; // Re-throw to keep form open if handled by form
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Configuración de Tipos de Tareas
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gestione los tipos de tareas disponibles para las órdenes de trabajo
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    leftIcon={<Plus size={18} />}
                    className="bg-[#1e293b] hover:bg-[#334155] text-white" // Custom dark color from image
                >
                    Nuevo Tipo de Tarea
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Tipos de Tareas Disponibles
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total: {tipos.length} tipo(s) de tarea configurado(s)
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">ID</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-48">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : tipos.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500">
                                        No hay tipos de tarea registrados
                                    </td>
                                </tr>
                            ) : (
                                tipos.map((tipo) => (
                                    <tr key={tipo.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                                            {tipo.id}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                            {tipo.nombre}
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(tipo)}
                                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                leftIcon={<Pencil size={14} />}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDelete(tipo.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                                                leftIcon={<Trash2 size={14} />}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TipoTareaForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                isLoading={isSubmitting}
            />
        </div>
    );
};
