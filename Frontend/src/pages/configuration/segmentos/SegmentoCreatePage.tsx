import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { SegmentoForm } from '../../../components/segmentos/SegmentoForm';
import { useSegmentos } from '../../../hooks/useSegmentos';
import type { SegmentoFormData } from '../../../schemasZod/segmentoSchema';

export const SegmentoCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { createSegmento } = useSegmentos();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: SegmentoFormData) => {
        setIsSubmitting(true);
        try {
            const success = await createSegmento(data);
            if (success) {
                navigate('/app/configuration/segmentos');
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
                    onClick={() => navigate('/app/configuration/segmentos')}
                    leftIcon={<ArrowLeft size={18} />}
                >
                    Volver
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-6 h-6" />
                        Registrar Nuevo Segmento
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Complete los datos para añadir un nuevo segmento al catálogo
                    </p>
                </div>
            </div>

            {/* Card con formulario */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <SegmentoForm onSubmitData={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};
