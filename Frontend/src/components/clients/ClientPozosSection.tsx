import React, { useEffect, useState } from 'react';
import { ExternalLink, Link2Off, Plus, Search, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { usePozos } from '../../hooks/usePozos';
import type { ClientPozo } from '../../types/client';
import type { Pozo } from '../../types/pozo';

interface ClientPozosSectionProps {
    clientId: string;
    pozos: ClientPozo[];
    onPozosChanged: () => void;
}

export const ClientPozosSection: React.FC<ClientPozosSectionProps> = ({
    clientId,
    pozos,
    onPozosChanged,
}) => {
    const { availablePozos, loadAvailablePozos, associatePozo, disassociatePozo } = usePozos();

    // Modal asociar
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAssociating, setIsAssociating] = useState(false);

    // Confirm dialog desasociar
    const [isDisassociateDialogOpen, setIsDisassociateDialogOpen] = useState(false);
    const [disassociatingPozo, setDisassociatingPozo] = useState<ClientPozo | null>(null);
    const [isDisassociating, setIsDisassociating] = useState(false);

    useEffect(() => {
        if (isAssociateModalOpen) {
            loadAvailablePozos();
            setSearchTerm('');
        }
    }, [isAssociateModalOpen]);

    const filteredAvailable = availablePozos.filter((p: Pozo) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssociate = async (pozoId: string) => {
        setIsAssociating(true);
        const success = await associatePozo(pozoId, clientId);
        setIsAssociating(false);
        if (success) {
            setIsAssociateModalOpen(false);
            onPozosChanged();
        }
    };

    const handleDisassociateClick = (pozo: ClientPozo) => {
        setDisassociatingPozo(pozo);
        setIsDisassociateDialogOpen(true);
    };

    const handleConfirmDisassociate = async () => {
        if (!disassociatingPozo) return;
        setIsDisassociating(true);
        const success = await disassociatePozo(disassociatingPozo.id);
        setIsDisassociating(false);
        setIsDisassociateDialogOpen(false);
        setDisassociatingPozo(null);
        if (success) onPozosChanged();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Pozos
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {pozos.length} pozo(s) asociado(s)
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={() => setIsAssociateModalOpen(true)}
                    leftIcon={<Plus size={16} />}
                    className="bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                    Asociar Pozo Existente
                </Button>
            </div>

            {/* Tabla de pozos */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                                Ubicación
                            </th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {pozos.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    No hay pozos asociados a este cliente
                                </td>
                            </tr>
                        ) : (
                            pozos.map((pozo) => (
                                <tr key={pozo.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-gray-200">
                                        {pozo.nombre}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <a
                                            href={pozo.ubicacionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium
                                                bg-emerald-50 text-emerald-700 hover:bg-emerald-100
                                                dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50
                                                transition-colors"
                                        >
                                            <ExternalLink size={13} />
                                            Ver en Mapa
                                        </a>
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDisassociateClick(pozo)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            leftIcon={<Link2Off size={15} />}
                                        >
                                            Desasociar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Asociar Pozo */}
            {isAssociateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Asociar Pozo Existente
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Seleccione un pozo del catálogo global para asociar a este cliente
                            </p>
                        </div>

                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar pozo por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {filteredAvailable.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    No hay pozos disponibles para asociar
                                </div>
                            ) : (
                                filteredAvailable.map((pozo: Pozo) => (
                                    <button
                                        key={pozo.id}
                                        onClick={() => handleAssociate(pozo.id)}
                                        disabled={isAssociating}
                                        className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-50 dark:border-gray-800 last:border-b-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                {pozo.nombre}
                                            </p>
                                        </div>
                                        <Plus size={16} className="text-gray-400" />
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end border-t border-gray-200 dark:border-gray-800">
                            <Button
                                variant="outline"
                                onClick={() => setIsAssociateModalOpen(false)}
                                disabled={isAssociating}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Dialog Desasociar */}
            <ConfirmDialog
                isOpen={isDisassociateDialogOpen}
                title="Desasociar Pozo"
                description={`¿Estás seguro de desasociar el pozo "${disassociatingPozo?.nombre ?? ''}" de este cliente?`}
                isHardDelete={false}
                onConfirm={handleConfirmDisassociate}
                onCancel={() => {
                    setIsDisassociateDialogOpen(false);
                    setDisassociatingPozo(null);
                }}
                confirmText="Desasociar"
                isLoading={isDisassociating}
            />
        </div>
    );
};
