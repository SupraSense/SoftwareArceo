import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Personal } from '../../types/personal';
import api from '../../services/api';
import { ArrowLeft, Phone, Mail, Edit, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { StaffForm } from '../../components/staff/StaffForm';

export const StaffDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [personal, setPersonal] = useState<Personal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchPersonal = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await api.get(`/personal/${id}`);
            setPersonal(response.data);
        } catch (error) {
            console.error('Error fetching personal details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonal();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-400"></div>
            </div>
        );
    }

    if (!personal) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">Personal no encontrado.</p>
                <button
                    onClick={() => navigate('/app/staff')}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    // Mocked Data (retained from original component)
    const activeOTs = Math.floor(Math.random() * 5);
    const completedOTs = Math.floor(Math.random() * 50) + 10;
    const antiquityMonths = Math.floor((new Date().getTime() - new Date(personal.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24 * 30));

    const history = [
        { id: 'OT-2024-089', client: 'Chevron', project: 'Entrega de Torre', status: 'Completada', date: '10/02/2026' },
        { id: 'OT-2024-087', client: 'YPF', project: 'DTM', status: 'En Progreso', date: '12/02/2026' },
    ];

    const documents = [
        { name: 'Licencia de Conducir', expiry: '15/08/2026', status: 'Vigente' },
        { name: 'Certificado de Aptitud Física', expiry: '30/12/2025', status: 'Vigente' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/app/staff')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle de Personal</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-2xl border border-slate-200 dark:border-slate-600">
                            {personal.nombre.charAt(0)}{personal.apellido.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{personal.nombre} {personal.apellido}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                    {personal.area}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${personal.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : personal.estado === 'En Servicio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                    {personal.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-2 transition-colors"
                    >
                        <Edit size={18} />
                        Editar Perfil
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Contact & Stats */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Información de Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Phone size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Teléfono</p>
                                    <p>{personal.telefono || 'No registrado'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Mail size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p>{personal.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Métricas de Desempeño</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">OTs Activas</span>
                                </div>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{activeOTs}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Completadas</span>
                                </div>
                                <span className="text-lg font-bold text-green-700 dark:text-green-400">{completedOTs}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} className="text-blue-500" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Antigüedad</span>
                                </div>
                                <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{antiquityMonths} m</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: History & Docs (Spans 2 cols) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Recent History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Historial Reciente</h3>
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.client} - {item.project}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Completada' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documentation */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Documentación</h3>
                        <div className="space-y-3">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-700/20">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-gray-400 dark:text-gray-500" size={24} />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Vence: {doc.expiry}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        Ver Documento
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal (reusing StaffForm) */}
            {isEditOpen && personal && (
                <StaffForm
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={() => {
                        setIsEditOpen(false);
                        fetchPersonal();
                    }}
                    initialData={personal}
                />
            )}
        </div>
    );
};
