import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Plus, Trash2, Search } from 'lucide-react';
import { useEquipos } from '../../../hooks/useEquipos';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const EquiposPage: React.FC = () => {
    const { equipos, loading, loadEquipos, deleteEquipo } = useEquipos();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingEquipo, setDeletingEquipo] = useState<{ id: number; nombre: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadEquipos();
    }, []);

    const filteredEquipos = equipos.filter((equipo) =>
        equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: number, nombre: string) => {
        setDeletingEquipo({ id, nombre });
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingEquipo) return;
        setIsDeleting(true);
        try {
            await deleteEquipo(deletingEquipo.id);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setDeletingEquipo(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setDeletingEquipo(null);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wrench className="w-6 h-6" />
                        Catálogo de Equipos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gestione los equipos disponibles para las órdenes de trabajo
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/app/configuration/equipos/new')}
                    leftIcon={<Plus size={18} />}
                    className="bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                    Nuevo Equipo
                </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre del equipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Tabla de equipos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Equipos Registrados
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Total: {filteredEquipos.length} equipo(s) activo(s)
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="py-8 text-center">
                                        <Loader message="Cargando equipos..." />
                                    </td>
                                </tr>
                            ) : filteredEquipos.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-8 text-center text-gray-500">
                                        {searchTerm
                                            ? 'No se encontraron equipos con ese nombre'
                                            : 'No hay equipos registrados'}
                                    </td>
                                </tr>
                            ) : (
                                filteredEquipos.map((equipo) => (
                                    <tr
                                        key={equipo.id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200 font-bold">
                                            {equipo.nombre}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDeleteClick(equipo.id, equipo.nombre)}
                                                className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                                                leftIcon={<Trash2 size={16} />}
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

            {/* Confirm Dialog para soft-delete */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Desactivar Equipo"
                description={`¿Estás seguro de que deseas eliminar el equipo "${deletingEquipo?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
                isHardDelete={false}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Desactivar"
                isLoading={isDeleting}
            />
        </div>
    );
};
