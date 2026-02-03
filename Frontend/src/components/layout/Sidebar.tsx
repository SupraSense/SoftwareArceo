import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Trello,
    Inbox,
    Calendar,
    MessageSquare,
    BarChart2,
    Users,
    Truck,
    UserCircle,
    FileSpreadsheet,
    DollarSign,
    Settings,
    Building2,
    X
} from 'lucide-react';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onClose }) => {
    const location = useLocation();
    const navItems = [
        { name: 'Inicio', icon: LayoutDashboard, path: '/app', active: true },
        { name: 'Órdenes de Trabajo', icon: ClipboardList, path: '/app/orders' },
        { name: 'Tareas Kanban', icon: Trello, path: '/app/kanban' },
        { name: 'Bandeja Remitos', icon: Inbox, path: '/app/remitos' },
        { name: 'Agenda', icon: Calendar, path: '/app/agenda' },
        { name: 'Mensajes Programados', icon: MessageSquare, path: '/app/messages' },
        { name: 'KPIs y Reportes', icon: BarChart2, path: '/app/reports' },
        { name: 'Clientes', icon: Building2, path: '/app/clients' },
        { name: 'Recursos', icon: Truck, path: '/app/resources' },
        { name: 'Personal', icon: Users, path: '/app/staff' },
        { name: 'Planilla Choferes', icon: UserCircle, path: '/app/drivers' },
        { name: 'Planilla Talleres', icon: FileSpreadsheet, path: '/app/workshops' },
        { name: 'Facturación', icon: DollarSign, path: '/app/billing' },
    ];

    const configItems = [
        { name: 'Tipos de Tareas', icon: Settings, path: '/app/configuration/type-task' },
    ];

    return (
        <div className={`w-64 bg-white flex flex-col border-r border-gray-200 overflow-y-auto ${className}`}>
            {/* Header Logo */}
            <div className="min-h-16 h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center mr-3 text-white">
                        <Building2 size={18} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 leading-tight">Arceo</h1>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sistema</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${isActive || item.active // Hack for this demo
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
                        onClick={() => {
                            if (onClose) onClose();
                            // Removed preventDefault to allow navigation
                        }}
                    >
                        <item.icon className={`mr-3 h-5 w-5 ${item.name === 'Inicio' ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        {item.name}
                    </NavLink>
                ))}

                <div className="pt-6 pb-6">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Configuración</p>
                    {configItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                            onClick={() => {
                                if (onClose) onClose();
                            }}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${item.name === 'Tipos de Tareas' && location.pathname.includes('type-task') ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};
