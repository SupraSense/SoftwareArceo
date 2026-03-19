import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { equipoSchema, type EquipoFormData } from '../../schemasZod/equipoSchema';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Type } from 'lucide-react';

interface EquipoFormProps {
    onSubmitData: (data: EquipoFormData) => Promise<void>;
    isLoading: boolean;
}

export const EquipoForm: React.FC<EquipoFormProps> = ({ onSubmitData, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EquipoFormData>({
        resolver: zodResolver(equipoSchema),
    });

    const onSubmit = async (data: EquipoFormData) => {
        await onSubmitData(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Nombre del Equipo"
                placeholder="Ej: Equipo Pulling"
                icon={<Type size={18} />}
                error={errors.nombre?.message}
                {...register('nombre')}
            />

            <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading}>
                    Registrar Equipo
                </Button>
            </div>
        </form>
    );
};
