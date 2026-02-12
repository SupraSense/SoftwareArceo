import React from 'react';
import { useForm } from 'react-hook-form';
import type { Client } from '../../types/client';
import { clientService } from '../../services/clientService';
import { Button } from '../ui/Button';

interface ClientFormProps {
    client?: Client | null;
    onSuccess: () => void;
    onCancel: () => void;
}

interface FormData {
    razonSocial: string;
    cuit: string;
    address: string;
    contactName: string;
    email: string;
    phone: string;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSuccess, onCancel }) => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            razonSocial: client?.razonSocial || '',
            cuit: client?.cuit || '',
            address: client?.address || '',
            contactName: client?.contactName || '',
            email: client?.email || '',
            phone: client?.phone || ''
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (client) {
                await clientService.update(client.id, data);
            } else {
                await clientService.create(data);
            }
            onSuccess();
        } catch (error: any) {
            console.error('Error saving client:', error);
            if (error.response?.data?.message) {
                // If backend returns specific error message
                // Manual error setting or general alert
                // For CUIT uniqueness
                if (error.response.data.message.includes('CUIT')) {
                    setError('cuit', { type: 'manual', message: error.response.data.message });
                } else {
                    alert(error.response.data.message);
                }
            } else {
                alert('Ocurrió un error al guardar el cliente.');
            }
        }
    };

    const isCuitDisabled = !!client && (client.activeContracts > 0);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Razón Social</label>
                    <input
                        {...register('razonSocial', { required: 'La Razón Social es obligatoria' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                    />
                    {errors.razonSocial && <p className="text-red-500 text-xs mt-1">{errors.razonSocial.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CUIT</label>
                    <input
                        {...register('cuit', {
                            required: 'El CUIT es obligatorio',
                            pattern: {
                                value: /^\d{2}-\d{8}-\d{1}$/,
                                message: 'Formato inválido (ej. 30-54668997-9)'
                            }
                        })}
                        disabled={isCuitDisabled}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border ${isCuitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {errors.cuit && <p className="text-red-500 text-xs mt-1">{errors.cuit.message}</p>}
                    {isCuitDisabled && <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">No editable (tiene contratos asociados)</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                    <input
                        {...register('address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Contacto</label>
                    <input
                        {...register('contactName')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        {...register('email', {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                            }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                    <input
                        {...register('phone', {
                            pattern: {
                                value: /^[0-9]{9,15}$/,
                                message: 'Teléfono inválido (9-15 dígitos)'
                            }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
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
