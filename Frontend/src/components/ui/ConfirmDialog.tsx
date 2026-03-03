import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    isHardDelete?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title = '¿Estás seguro?',
    description = 'Esta acción no se puede deshacer.',
    isHardDelete = false,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`p-3 rounded-full ${isHardDelete
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500'
                                    : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500'
                                }`}
                        >
                            {isHardDelete ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-4">
                        <p>{description}</p>
                        {isHardDelete ? (
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-800 dark:text-red-400 font-medium">
                                ⚠️ Atención: Esta es una eliminación permanente. Los datos serán
                                borrados definitivamente de la base de datos.
                            </div>
                        ) : (
                            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg text-orange-800 dark:text-orange-400 font-medium">
                                ℹ️ Nota: Este registro se marcará como inactivo para preservar el
                                historial, pero ya no estará disponible para su uso general.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={isHardDelete ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
