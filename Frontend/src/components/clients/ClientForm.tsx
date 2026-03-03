import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormData } from '../../schemasZod/clientSchema';
import type { Client } from '../../types/client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Building2, Mail, Phone, MapPin, User, FileText } from 'lucide-react';

interface ClientFormProps {
    client?: Client | null;
    onSubmitData: (data: ClientFormData) => Promise<void>;
    onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmitData, onCancel }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            razonSocial: client?.razonSocial || '',
            cuit: client?.cuit || '',
            address: client?.address || '',
            contactName: client?.contactName || '',
            email: client?.email || '',
            phone: client?.phone || ''
        }
    });

    const isCuitDisabled = !!client && (client.activeContracts > 0);

    return (
        <form onSubmit={handleSubmit(onSubmitData)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Razón Social"
                    icon={<Building2 size={18} />}
                    placeholder="Ej. Empresa SA"
                    error={errors.razonSocial?.message}
                    {...register('razonSocial')}
                />

                <div>
                    <Input
                        label="CUIT"
                        icon={<FileText size={18} />}
                        placeholder="Ej. 30-12345678-9"
                        disabled={isCuitDisabled}
                        error={errors.cuit?.message}
                        {...register('cuit')}
                    />
                    {isCuitDisabled && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            * El CUIT no se puede modificar por tener contratos activos.
                        </p>
                    )}
                </div>

                <Input
                    label="Director/Contacto Principal"
                    icon={<User size={18} />}
                    placeholder="Nombre del contacto"
                    error={errors.contactName?.message}
                    {...register('contactName')}
                />

                <Input
                    label="Dirección Legal"
                    icon={<MapPin size={18} />}
                    placeholder="Calle, Número, Ciudad"
                    error={errors.address?.message}
                    {...register('address')}
                />

                <Input
                    label="Correo Electrónico"
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="contacto@empresa.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Teléfono"
                    icon={<Phone size={18} />}
                    placeholder="Ej. 1123456789"
                    error={errors.phone?.message}
                    {...register('phone')}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                    {client ? 'Guardar Cambios' : 'Registrar Cliente'}
                </Button>
            </div>
        </form>
    );
};