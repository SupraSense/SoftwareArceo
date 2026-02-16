import React from 'react';
import type { Personal } from '../../types/personal';
import { X, Phone, Mail, Edit, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';

interface StaffDetailProps {
    isOpen: boolean;
    onClose: () => void;
    personal: Personal;
    onEdit: () => void;
}

export const StaffDetail: React.FC<StaffDetailProps> = ({ isOpen, onClose, personal, onEdit }) => {
    if (!isOpen) return null;

    // Mocked Data
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-colors">
                <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-xl border border-slate-200 dark:border-slate-600">
                            {personal.nombre.charAt(0)}{personal.apellido.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{personal.nombre} {personal.apellido}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                    {personal.area}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${personal.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : personal.estado === 'En Servicio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                    {personal.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onEdit}
                            className="px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 text-sm flex items-center gap-2 transition-colors"
                        >
                            <Edit size={16} />
                            Editar
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-transparent dark:border-gray-700/50">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Contacto */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-gray-400 dark:text-gray-500" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{personal.telefono || 'No registrado'}</p>
                                    </div>
                                </div>
                                {personal.telefono && <a href={`tel:${personal.telefono}`} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Llamar</a>}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-gray-400 dark:text-gray-500" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{personal.email}</p>
                                    </div>
                                </div>
                                <a href={`mailto:${personal.email}`} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Enviar email</a>
                            </div>
                        </div>
                    </section>

                    {/* Desempeño */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Desempeño</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                                <div className="mb-2 flex justify-center text-slate-400 dark:text-slate-500"><Clock size={24} /></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">OTs Activas</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{activeOTs}</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-100 dark:border-green-900/20">
                                <div className="mb-2 flex justify-center text-green-400 dark:text-green-500/80"><CheckCircle size={24} /></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">OTs Completadas</p>
                                <p className="text-xl font-bold text-green-700 dark:text-green-400">{completedOTs}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center border border-blue-100 dark:border-blue-900/20">
                                <div className="mb-2 flex justify-center text-blue-400 dark:text-blue-500/80"><Calendar size={24} /></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Antigüedad</p>
                                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{antiquityMonths} meses</p>
                            </div>
                        </div>
                    </section>

                    {/* Historial Reciente */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Historial Reciente</h3>
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.client} - {item.project}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Completada' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-600'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Documentación */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Documentación</h3>
                        <div className="space-y-3">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center bg-white dark:bg-transparent">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-gray-400 dark:text-gray-500" size={24} />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Vence: {doc.expiry}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Ver</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
