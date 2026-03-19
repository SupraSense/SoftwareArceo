import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormData } from '../../schemasZod/clientSchema';
import type { ClientDetail } from '../../types/client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Building2, Mail, Phone, MapPin, User, FileText, Plus, X } from 'lucide-react';

interface ClientFormProps {
    client?: ClientDetail | null;
    onSubmitData: (data: ClientFormData) => Promise<void>;
    onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmitData, onCancel }) => {
    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            razonSocial: client?.razonSocial || '',
            cuit: client?.cuit || '',
            address: client?.address || '',
            contacts: client?.contacts && client.contacts.length > 0
                ? client.contacts.map((c) => ({
                    name: c.name || '',
                    phone: c.phone || '',
                    email: c.email || '',
                    isPrincipal: c.isPrincipal,
                }))
                : [{ name: '', phone: '', email: '', isPrincipal: true }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contacts',
    });

    const contacts = watch('contacts');

    const handleSetPrincipal = (selectedIndex: number) => {
        contacts.forEach((_, idx) => {
            setValue(`contacts.${idx}.isPrincipal`, idx === selectedIndex);
        });
    };

    const handleRemoveContact = (index: number) => {
        const wasPrincipal = contacts[index]?.isPrincipal;
        remove(index);
        // Si el eliminado era principal, asignar al primero restante
        if (wasPrincipal && fields.length > 1) {
            setTimeout(() => setValue('contacts.0.isPrincipal', true), 0);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitData)} className="space-y-6">
            {/* Datos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Razón Social"
                    icon={<Building2 size={18} />}
                    placeholder="Ej. Empresa SA"
                    error={errors.razonSocial?.message}
                    {...register('razonSocial')}
                />

                <Input
                    label="CUIT"
                    icon={<FileText size={18} />}
                    placeholder="Ej. 30-12345678-9"
                    error={errors.cuit?.message}
                    {...register('cuit')}
                />

                <Input
                    label="Dirección Legal"
                    icon={<MapPin size={18} />}
                    placeholder="Calle, Número, Ciudad"
                    error={errors.address?.message}
                    {...register('address')}
                />
            </div>

            {/* Contactos dinámicos */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Contactos
                    </h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => append({ name: '', phone: '', email: '', isPrincipal: false })}
                        leftIcon={<Plus size={14} />}
                    >
                        Agregar Contacto
                    </Button>
                </div>

                {errors.contacts?.message && (
                    <p className="text-sm text-red-500">{errors.contacts.message}</p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className={`border rounded-lg p-4 space-y-4 relative transition-colors ${
                            contacts[index]?.isPrincipal
                                ? 'border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10'
                                : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveContact(index)}
                                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Nombre"
                                icon={<User size={16} />}
                                placeholder="Nombre del contacto"
                                error={errors.contacts?.[index]?.name?.message}
                                {...register(`contacts.${index}.name`)}
                            />
                            <Input
                                label="Teléfono"
                                icon={<Phone size={16} />}
                                placeholder="Ej. +54 11 2345-6789"
                                error={errors.contacts?.[index]?.phone?.message}
                                {...register(`contacts.${index}.phone`)}
                            />
                            <Input
                                label="Email"
                                icon={<Mail size={16} />}
                                type="email"
                                placeholder="contacto@empresa.com"
                                error={errors.contacts?.[index]?.email?.message}
                                {...register(`contacts.${index}.email`)}
                            />
                        </div>

                        <label
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                            onClick={() => handleSetPrincipal(index)}
                        >
                            <input
                                type="radio"
                                name="contactPrincipal"
                                checked={contacts[index]?.isPrincipal ?? false}
                                readOnly
                                className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            Contacto Principal
                        </label>
                    </div>
                ))}
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