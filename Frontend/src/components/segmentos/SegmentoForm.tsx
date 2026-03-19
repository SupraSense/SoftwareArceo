import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { segmentoSchema, type SegmentoFormData } from '../../schemasZod/segmentoSchema';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Layers } from 'lucide-react';

interface SegmentoFormProps {
    onSubmitData: (data: SegmentoFormData) => Promise<void>;
    isLoading: boolean;
}

export const SegmentoForm: React.FC<SegmentoFormProps> = ({ onSubmitData, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SegmentoFormData>({
        resolver: zodResolver(segmentoSchema),
    });

    const onSubmit = async (data: SegmentoFormData) => {
        await onSubmitData(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Nombre del Segmento"
                placeholder="Ej: Perforación"
                icon={<Layers size={18} />}
                error={errors.nombre?.message}
                {...register('nombre')}
            />

            <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading}>
                    Registrar Segmento
                </Button>
            </div>
        </form>
    );
};
