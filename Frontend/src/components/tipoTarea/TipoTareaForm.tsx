import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { CreateTipoTareaDTO, TipoTarea, UpdateTipoTareaDTO } from '../../types/tipoTarea';
import { X } from 'lucide-react';

interface TipoTareaFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTipoTareaDTO | UpdateTipoTareaDTO) => Promise<void>;
    initialData?: TipoTarea | null;
    isLoading?: boolean;
}

export const TipoTareaForm: React.FC<TipoTareaFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading = false,
}) => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setNombre(initialData.nombre);
            } else {
                setNombre('');
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('El nombre es requerido');
            return;
        }

        try {
            await onSubmit({ nombre });
            onClose();
        } catch (err) {
            console.error(err);
            // Error handling usually done in parent or service
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Editar Tipo de Tarea' : 'Nuevo Tipo de Tarea'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <Input
                        label="Nombre"
                        placeholder="Ej: Mantenimiento Preventivo"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            setError('');
                        }}
                        error={error}
                        autoFocus
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                        >
                            {initialData ? 'Guardar Cambios' : 'Crear Tipo de Tarea'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
