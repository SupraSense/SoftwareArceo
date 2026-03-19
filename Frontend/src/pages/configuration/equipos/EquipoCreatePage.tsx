import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { EquipoForm } from '../../../components/equipos/EquipoForm';
import { useEquipos } from '../../../hooks/useEquipos';
import type { EquipoFormData } from '../../../schemasZod/equipoSchema';

export const EquipoCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { createEquipo } = useEquipos();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: EquipoFormData) => {
        setIsSubmitting(true);
        try {
            const success = await createEquipo(data);
            if (success) {
                navigate('/app/configuration/equipos');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/app/configuration/equipos')}
                    leftIcon={<ArrowLeft size={18} />}
                >
                    Volver
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wrench className="w-6 h-6" />
                        Registrar Nuevo Equipo
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Complete los datos para añadir un nuevo equipo al catálogo
                    </p>
                </div>
            </div>

            {/* Card con formulario */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <EquipoForm onSubmitData={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};
