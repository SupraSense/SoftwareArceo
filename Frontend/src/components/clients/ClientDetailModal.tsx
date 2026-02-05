import React from 'react';
import type { Client } from '../../types/client';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ClientDetailModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, isOpen, onClose }) => {
    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl overflow-hidden mx-4">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalle de Cliente</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        &times;
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-start space-x-6">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full flex-shrink-0">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{client.razonSocial}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">CUIT: {client.cuit}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</label>
                                <p className="text-gray-900 dark:text-gray-100">{client.address || '-'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Estado</label>
                                <div className="mt-1">
                                    <Badge variant={client.status === 'Activo' ? 'success' : 'default'}>{client.status}</Badge>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Contacto Principal</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{client.contactName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{client.email}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{client.phone}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Contratos Activos</label>
                                <p className="text-gray-900 dark:text-gray-100 font-semibold">{client.activeContracts}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t dark:border-gray-700 flex justify-end">
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                </div>
            </div>
        </div>
    );
};
