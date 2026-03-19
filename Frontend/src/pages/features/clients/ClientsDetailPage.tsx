import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '../../../hooks/useClients';
import { ClientForm } from '../../../components/clients/ClientForm';
import { ClientPozosSection } from '../../../components/clients/ClientPozosSection';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import type { ClientDetail } from '../../../types/client';
import type { ClientFormData } from '../../../schemasZod/clientSchema';
import { ArrowLeft, Edit2, Trash2, Building2, Phone, Mail, User } from 'lucide-react';

export const ClientDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getClient, saveClient, deleteClient, loading } = useClients();

    const [client, setClient] = useState<ClientDetail | null>(null);
    const [isEditing, setIsEditing] = useState(id === 'new');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchClient = async () => {
        if (id && id !== 'new') {
            const data = await getClient(id);
            if (data) setClient(data);
            else navigate('/app/clients');
        } else if (id === 'new') {
            setIsEditing(true);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    const handleSave = async (formData: ClientFormData) => {
        const success = await saveClient(formData, id === 'new' ? undefined : id);
        if (success) {
            navigate('/app/clients');
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!id || !client) return;
        setIsDeleting(true);
        const success = await deleteClient(id);
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        if (success) navigate('/app/clients');
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleCancelEdit = () => {
        if (id === 'new') {
            navigate('/app/clients');
        } else {
            setIsEditing(false);
        }
    };

    const handlePozosChanged = () => {
        fetchClient();
    };

    if (loading && !client && id !== 'new') {
        return <Loader message="Cargando detalles..." />;
    }

    if (!client && id !== 'new') return null;


    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6 animate-fadeIn">
            {/* Header de navegación */}
            <div className="flex items-center gap-4 border-b pb-4 dark:border-gray-700">
                <button
                    onClick={() => navigate('/app/clients')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {id === 'new' ? 'Nuevo Cliente' : (isEditing ? 'Editar Cliente' : 'Detalles del Cliente')}
                    </h1>
                </div>
                {!isEditing && client && (
                    <div className="flex gap-2">
                        <Button variant="danger" onClick={handleDeleteClick} disabled={loading}>
                            <Trash2 size={18} className="mr-2" /> Eliminar
                        </Button>
                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} className="mr-2" /> Editar
                        </Button>
                    </div>
                )}
            </div>

            {/* Contenido Principal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                {isEditing ? (
                    <ClientForm
                        client={client}
                        onSubmitData={handleSave}
                        onCancel={handleCancelEdit}
                    />
                ) : client ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tarjeta de Información Visual */}
                        <div className="flex items-start space-x-6 col-span-1 md:col-span-2">
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-5 rounded-2xl flex-shrink-0">
                                <Building2 size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.razonSocial}</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-mono mt-1">CUIT: {client.cuit}</p>
                                <div className="mt-3">
                                    <Badge variant={client.status === 'Activo' ? 'success' : 'default'} size="md">
                                        {client.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Bloques de Datos */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Dirección Legal</h3>
                                <p className="text-gray-900 dark:text-gray-100">{client.address || 'No registrada'}</p>
                            </div>
                        </div>

                        {/* Contactos */}
                        <div className="space-y-4 col-span-1 md:col-span-2">
                            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Contactos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {client.contacts.map((contact, idx) => (
                                    <div
                                        key={contact.id || idx}
                                        className={`p-4 rounded-lg border ${contact.isPrincipal
                                                ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        {contact.isPrincipal && (
                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                Principal
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <User size={14} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                {contact.name || 'Sin nombre'}
                                            </span>
                                        </div>
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</span>
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {!isEditing && client && id !== 'new' && (
                <ClientPozosSection
                    clientId={client.id}
                    pozos={client.pozos}
                    onPozosChanged={handlePozosChanged}
                />
            )}

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Eliminar Cliente"
                description={`¿Estás seguro que deseas eliminar el cliente "${client?.razonSocial}"?`}
                isHardDelete={false}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Eliminar"
                isLoading={isDeleting}
            />
        </div>
    );
};