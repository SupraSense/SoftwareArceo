import { useEffect, useState } from 'react';
import { clientService } from '../../services/clientService';
import type { Client } from '../../types/client';
import { ClientDetailModal } from '../../components/clients/ClientDetailModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Phone, Mail, FileText, Eye, Filter, Search } from 'lucide-react';

export const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const data = await clientService.getAll();
            setClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewClient = async (id: string) => {
        try {
            const client = await clientService.getById(id);
            setSelectedClient(client);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading client details:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Cargando clientes...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
                    <p className="text-gray-500 dark:text-gray-400">Administra la información de tus clientes petroleros</p>
                </div>
                <Button onClick={() => { setSelectedClient(null); setIsModalOpen(true); }}>+ Nuevo Cliente</Button>
            </div>

            <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por razón social o CUIT..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Button variant="outline" className="flex gap-2">
                    <Filter size={16} /> Filtros
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        <FileText size={20} /> Lista de Clientes ({clients.length})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-left text-sm text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-4 font-medium">Razón Social</th>
                                <th className="p-4 font-medium">CUIT</th>
                                <th className="p-4 font-medium">Contacto</th>
                                <th className="p-4 font-medium">Comunicación</th>
                                <th className="p-4 font-medium">Contratos</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">{client.razonSocial}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{client.cuit}</td>
                                    <td className="p-4 text-gray-900 dark:text-gray-200">{client.contactName}</td>
                                    <td className="p-4 flex gap-2 text-gray-400">
                                        {client.phone && <Phone size={16} />}
                                        {client.email && <Mail size={16} />}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                                            {client.activeContracts} contratos
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={client.status === 'Activo' ? 'success' : 'default'}>{client.status}</Badge>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleViewClient(client.id)}
                                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 flex items-center gap-1 text-sm font-medium"
                                        >
                                            <Eye size={16} /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientDetailModal
                client={selectedClient}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClientUpdated={loadClients}
            />
        </div>
    );
};
