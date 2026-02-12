import React, { useState, useEffect } from 'react';
import type { Client } from '../../types/client';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ClientForm } from './ClientForm'; // Ensure this matches file structure
import { clientService } from '../../services/clientService';
import { Trash2, Edit2, X, AlertTriangle } from 'lucide-react';

interface ClientDetailModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onClientUpdated: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, isOpen, onClose, onClientUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsEditing(!client); // If no client, we are creating
            setDeleteConfirm(false);
        }
    }, [isOpen, client]);

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (!client) return;
        setIsDeleting(true);
        try {
            await clientService.delete(client.id);
            onClientUpdated();
            onClose();
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Error al eliminar cliente');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSuccess = () => {
        onClientUpdated();
        onClose();
    };

    const renderHeader = () => {
        if (deleteConfirm) return 'Confirmar Eliminación';
        if (isEditing) return client ? 'Editar Cliente' : 'Registrar Nuevo Cliente';
        return 'Detalle de Cliente';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all relative z-10 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {renderHeader()}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {deleteConfirm ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                                <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">¿Estás seguro de eliminar este cliente?</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Esta acción eliminará al cliente <strong>{client?.razonSocial}</strong>.
                                {client?.activeContracts && client.activeContracts > 0
                                    ? " Al tener contratos activos, el cliente pasará a estado 'Inactivo'."
                                    : " Esta acción no se puede deshacer."}
                            </p>
                            <div className="flex justify-center gap-4 mt-6">
                                <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                                    Sí, eliminar
                                </Button>
                            </div>
                        </div>
                    ) : isEditing ? (
                        <ClientForm
                            client={client}
                            onSuccess={handleSuccess}
                            onCancel={() => client ? setIsEditing(false) : onClose()}
                        />
                    ) : (
                        <div className="space-y-8 animate-fadeIn">
                            {/* View Mode */}
                            <div className="flex items-start space-x-6">
                                <div className="bg-blue-100 dark:bg-blue-900/40 p-5 rounded-2xl flex-shrink-0">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="col-span-1 md:col-span-2 border-b dark:border-gray-700 pb-4">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{client?.razonSocial}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">CUIT: {client?.cuit}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Dirección</label>
                                        <p className="text-gray-900 dark:text-gray-100 mt-1 font-medium">{client?.address || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Estado</label>
                                        <div className="mt-1">
                                            <Badge variant={client?.status === 'Activo' ? 'success' : 'default'} size="md">{client?.status}</Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Contacto Principal</label>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-gray-900 dark:text-gray-100 font-medium">{client?.contactName}</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                {client?.email}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{client?.phone}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Contratos Activos</label>
                                        <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold mt-1">{client?.activeContracts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!isEditing && !deleteConfirm && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
                        <Button variant="danger" onClick={() => setDeleteConfirm(true)} leftIcon={<Trash2 size={18} />}>
                            Eliminar
                        </Button>
                        <Button variant="primary" onClick={() => setIsEditing(true)} leftIcon={<Edit2 size={18} />}>
                            Editar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
