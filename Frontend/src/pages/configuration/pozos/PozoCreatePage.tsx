import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PozoForm } from '../../../components/pozos/PozoForm';
import { usePozos } from '../../../hooks/usePozos';
import type { PozoFormData } from '../../../schemasZod/pozoSchema';

export const PozoCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { createPozo } = usePozos();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: PozoFormData) => {
        setIsSubmitting(true);
        try {
            const success = await createPozo(data);
            if (success) {
                navigate('/app/configuration/pozos');
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
                    onClick={() => navigate('/app/configuration/pozos')}
                    leftIcon={<ArrowLeft size={18} />}
                >
                    Volver
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-6 h-6" />
                        Registrar Nuevo Pozo
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Complete los datos para añadir un nuevo pozo al catálogo
                    </p>
                </div>
            </div>

            {/* Card con formulario */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <PozoForm onSubmitData={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};
