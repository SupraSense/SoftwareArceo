import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pozoSchema, type PozoFormData } from '../../schemasZod/pozoSchema';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MapPin, Type } from 'lucide-react';

interface PozoFormProps {
    onSubmitData: (data: PozoFormData) => Promise<void>;
    isLoading: boolean;
}

export const PozoForm: React.FC<PozoFormProps> = ({ onSubmitData, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PozoFormData>({
        resolver: zodResolver(pozoSchema),
    });

    const onSubmit = async (data: PozoFormData) => {
        await onSubmitData(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Nombre del Pozo"
                placeholder="Ej: Vaca Muerta Sur"
                icon={<Type size={18} />}
                error={errors.nombre?.message}
                {...register('nombre')}
            />

            <Input
                label="Ubicación (URL de Google Maps)"
                placeholder="https://www.google.com/maps/place/..."
                icon={<MapPin size={18} />}
                error={errors.ubicacionUrl?.message}
                {...register('ubicacionUrl')}
            />

            <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading}>
                    Registrar Pozo
                </Button>
            </div>
        </form>
    );
};
