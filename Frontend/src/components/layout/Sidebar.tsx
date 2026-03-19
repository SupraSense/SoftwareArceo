import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Inbox,
    Calendar,
    Users,
    Truck,
    UserCircle,
    DollarSign,
    Settings,
    Building2,
    X,
    Menu,
    Locate,
    TableColumnsSplit,
    User
} from 'lucide-react';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onClose, isCollapsed = false, onToggleCollapse }) => {
    const navItems = [
        { name: 'Inicio', icon: LayoutDashboard, path: '/app' },
        { name: 'Órdenes de Trabajo', icon: ClipboardList, path: '/app/orders' },
        { name: 'Bandeja Remitos', icon: Inbox, path: '/app/remitos' },
        { name: 'Agenda', icon: Calendar, path: '/app/agenda' },
        { name: 'Clientes', icon: Building2, path: '/app/clients' },
        { name: 'Recursos', icon: Truck, path: '/app/resources' },
        { name: 'Personal', icon: Users, path: '/app/staff' },
        { name: 'Planilla Choferes', icon: UserCircle, path: '/app/drivers' },
        { name: 'Facturación', icon: DollarSign, path: '/app/billing' },
    ];

    const configItems = [
        { name: 'Tipos de Tareas', icon: Settings, path: '/app/configuration/type-task' },
        { name: 'Pozos', icon: Locate, path: '/app/configuration/pozos' },
        { name: 'Segmentos', icon: TableColumnsSplit, path: '/app/configuration/segmentos' },
        { name: 'Usuarios', icon: User, path: '/app/configuration/usuarios' }
    ];

    return (
        <div className={`bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 overflow-y-auto overflow-x-hidden duration-300 transition-all ${className} ${!className.includes('w-') ? (isCollapsed ? 'w-20' : 'w-64') : ''}`}>
            {/* Header Logo */}
            <div className={`min-h-16 h-16 flex items-center ${isCollapsed ? 'justify-center px-1' : 'px-4'} border-b border-gray-100 dark:border-gray-800 shrink-0 sticky top-0 bg-white dark:bg-gray-900 z-10 duration-200 transition-colors`}>
                <div className="flex items-center overflow-hidden">
                    <button onClick={onToggleCollapse} className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isCollapsed ? '' : 'mr-3'}`}>
                        <Menu size={24} />
                    </button>
                    {!isCollapsed && (
                        <div className="flex items-center">
                            <h1 className="font-bold text-gray-900 dark:text-white leading-tight text-xl">Arceo</h1>
                        </div>
                    )}
                </div>
                {!isCollapsed && onClose && (
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 ml-auto">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1 w-full px-2">
                {!isCollapsed && <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Sistema</p>}
                {isCollapsed && <div className="h-4"></div>}
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/app'}
                        title={isCollapsed ? item.name : undefined}
                        className={({ isActive }) => `
              flex items-center h-10 transition-colors
              ${isCollapsed ? 'justify-center w-10 mx-auto rounded-full' : 'px-4 rounded-full'}
              ${isActive
                                ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-200'}
            `}
                        onClick={() => {
                            if (onClose) onClose();
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`shrink-0 h-5 w-5 ${isCollapsed ? '' : 'mr-4'} ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                                {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="pt-2 pb-6">
                    {!isCollapsed ? (
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Configuración</p>
                    ) : (
                        <div className="h-px w-8 bg-gray-200 dark:bg-gray-800 mx-auto my-4 rounded-full" />
                    )}
                    {configItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            title={isCollapsed ? item.name : undefined}
                            className={({ isActive }) => `
                                flex items-center h-10 transition-colors
                                ${isCollapsed ? 'justify-center w-10 mx-auto rounded-full' : 'px-4 rounded-full'}
                                ${isActive ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-200'}
                            `}
                            onClick={() => {
                                if (onClose) onClose();
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`shrink-0 h-5 w-5 ${isCollapsed ? '' : 'mr-4'} ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                                    {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};
