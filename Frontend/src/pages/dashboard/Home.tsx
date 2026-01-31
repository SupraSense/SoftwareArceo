import React from 'react';
import {
    ClipboardList,
    Truck,
    AlertTriangle,
    Users,
    Plus,
    MessageSquare,
    BarChart3,
    Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const Home: React.FC = () => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
                <p className="text-gray-500">Resumen general del sistema de gestión</p>
            </div>

            {/* KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 */}
                <Card className="bg-orange-50/50 border-orange-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Órdenes Activas</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">18</h3>
                                <span className="text-xs font-semibold text-green-600">+12%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">+3 hoy</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-orange-100/50 shadow-sm text-orange-600">
                            <ClipboardList size={20} />
                        </div>
                    </div>
                </Card>

                {/* KPI 2 */}
                <Card className="bg-emerald-50/50 border-emerald-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Recursos en Campo</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">342</h3>
                                <span className="text-xs font-semibold text-green-600">+8%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">de 550 trailers</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-100/50 shadow-sm text-emerald-600">
                            <Truck size={20} />
                        </div>
                    </div>
                </Card>

                {/* KPI 3 */}
                <Card className="bg-amber-50/50 border-amber-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Remitos Pendientes</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">7</h3>
                            </div>
                            <p className="text-xs text-amber-600 mt-1 font-medium">2 críticos</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-amber-100/50 shadow-sm text-amber-500">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                </Card>

                {/* KPI 4 */}
                <Card className="bg-white border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Choferes Activos</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">28</h3>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">24/7 operativo</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-gray-600">
                            <Users size={20} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Actions & Agenda) */}
                <div className="space-y-6">
                    {/* Actions */}
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <Button className="w-full justify-center bg-slate-800 hover:bg-slate-900 text-white" leftIcon={<Plus size={18} />}>
                                Nueva Orden de Trabajo
                            </Button>
                            <Button className="w-full justify-center bg-green-600 hover:bg-green-700 text-white" leftIcon={<MessageSquare size={18} />}>
                                Comunicar al Grupo
                            </Button>
                            <Button variant="outline" className="w-full justify-center border-gray-300 text-gray-700" leftIcon={<BarChart3 size={18} />}>
                                Ver KPIs Completos
                            </Button>
                        </div>
                    </Card>

                    {/* Agenda */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock size={18} className="text-gray-500" /> Agenda del Día
                            </h3>
                        </div>
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                            {/* Event 1 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500">08:00</span>
                                    <span className="text-sm font-medium text-gray-900">DTM Tráiler 12m - PAD Loma Norte</span>
                                    <span className="text-xs text-gray-500 mb-1">Chofer: Juan Pérez</span>
                                    <div className="flex gap-2 mt-1">
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">T-045</Badge>
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">YPF</Badge>
                                    </div>
                                </div>
                            </div>
                            {/* Event 2 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500">10:30</span>
                                    <span className="text-sm font-medium text-gray-900">Entrega Cisterna - Vaca Muerta Sur</span>
                                    <span className="text-xs text-gray-500 mb-1">Chofer: María González</span>
                                    <div className="flex gap-2 mt-1">
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">C-012</Badge>
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">Shell</Badge>
                                    </div>
                                </div>
                            </div>
                            {/* Event 3 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500">13:00</span>
                                    <span className="text-sm font-medium text-gray-900">Mantenimiento Torre - Neuquén Central</span>
                                    <span className="text-xs text-gray-500 mb-1">Chofer: Carlos Ramírez</span>
                                    <div className="flex gap-2 mt-1">
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">Torre T-003</Badge>
                                        <Badge size="sm" variant="neutral" className="border border-gray-200 bg-white">Chevron</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column (Recent Orders) */}
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Órdenes Recientes</h3>
                            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 bg-primary-50">
                                Ver todas
                            </Button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {/* Order Item 1 */}
                            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">OT-2024-001</span>
                                            <Badge variant="error" size="sm">Alta</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">YPF - Loma Campana • DTM</p>
                                        <p className="text-xs text-gray-500">Chofer: Juan Pérez</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-100">En curso</Badge>
                                        <p className="text-xs text-gray-400 mt-2">2024-01-15</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Item 2 */}
                            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">OT-2024-002</span>
                                            <Badge variant="info" className="bg-blue-100 text-blue-700" size="sm">Media</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">Shell - Vaca Muerta • Entrega</p>
                                        <p className="text-xs text-gray-500">Chofer: María González</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="neutral" className="bg-slate-800 text-white">Completada</Badge>
                                        <p className="text-xs text-gray-400 mt-2">2024-01-15</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Item 3 */}
                            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">OT-2024-003</span>
                                            <Badge variant="info" className="bg-blue-100 text-blue-700" size="sm">Media</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">Chevron - Neuquén • Mantenimiento preventivo</p>
                                        <p className="text-xs text-gray-500">Chofer: Carlos Ramírez</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="neutral" className="bg-gray-100 text-gray-600">Planificada</Badge>
                                        <p className="text-xs text-gray-400 mt-2">2024-01-16</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Item 4 */}
                            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">OT-2024-004</span>
                                            <Badge variant="error" size="sm">Alta</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">Total - Añelo • Taller móvil</p>
                                        <p className="text-xs text-gray-500">Chofer: Roberto Silva</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-100">En curso</Badge>
                                        <p className="text-xs text-gray-400 mt-2">2024-01-14</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Item 5 */}
                            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">OT-2024-005</span>
                                            <Badge variant="success" size="sm">Baja</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">Pan American Energy • Devolución</p>
                                        <p className="text-xs text-gray-500">Chofer: Luis Morales</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                                        <p className="text-xs text-gray-400 mt-2">2024-01-15</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
