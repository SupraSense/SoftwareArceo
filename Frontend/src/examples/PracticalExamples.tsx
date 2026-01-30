/**
 * Ejemplos Prácticos de Implementación
 * Casos de uso comunes basados en el prototipo del sistema de gestión
 */

import React from 'react';
import { Button, Badge, Card } from '../components';

// ============================================
// EJEMPLO 1: Card de Personal
// ============================================
export const PersonnelCard: React.FC = () => {
    return (
        <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Juan Pérez</h3>
                    <p className="text-sm text-text-secondary">Logística</p>
                </div>
                <Badge variant="available">Disponible</Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-text-secondary">Turno:</span>
                    <span className="text-text-primary font-medium">Mañana</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-secondary">OT Activas:</span>
                    <span className="text-text-primary font-medium">2</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-secondary">OT Completadas:</span>
                    <span className="text-text-primary font-medium">45</span>
                </div>
            </div>

            <div className="flex gap-2">
                <Button variant="primary" className="flex-1">Ver Detalles</Button>
                <Button variant="ghost">📞</Button>
            </div>
        </Card>
    );
};

// ============================================
// EJEMPLO 2: Barra de Búsqueda con Filtros
// ============================================
export const SearchBar: React.FC = () => {
    return (
        <Card className="p-4">
            <div className="flex gap-4">
                <input
                    type="text"
                    className="input flex-1"
                    placeholder="Buscar por nombre o especialidad..."
                />

                <select className="input w-48">
                    <option>Todos los estados</option>
                    <option>Disponible</option>
                    <option>En servicio</option>
                    <option>Licencia</option>
                </select>

                <Button variant="primary">Buscar</Button>
            </div>
        </Card>
    );
};

// ============================================
// EJEMPLO 3: Tabla de Personal
// ============================================
export const PersonnelTable: React.FC = () => {
    const personnel = [
        { id: 1, name: 'Juan Pérez', area: 'Logística', status: 'available', shift: 'Mañana', activeOT: 2 },
        { id: 2, name: 'María González', area: 'Médicos', status: 'in-service', shift: 'Tarde', activeOT: 1 },
        { id: 3, name: 'Carlos Rodríguez', area: 'Intendencia', status: 'on-leave', shift: 'Noche', activeOT: 0 },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'available': return 'available';
            case 'in-service': return 'in-service';
            case 'on-leave': return 'on-leave';
            default: return 'inactive';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'Disponible';
            case 'in-service': return 'En servicio';
            case 'on-leave': return 'Licencia';
            default: return 'Inactivo';
        }
    };

    return (
        <Card className="overflow-hidden">
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Área</th>
                        <th>Estado</th>
                        <th>Turno</th>
                        <th>OT Activas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {personnel.map((person) => (
                        <tr key={person.id}>
                            <td className="font-medium">{person.name}</td>
                            <td>{person.area}</td>
                            <td>
                                <Badge variant={getStatusVariant(person.status) as any}>
                                    {getStatusLabel(person.status)}
                                </Badge>
                            </td>
                            <td>{person.shift}</td>
                            <td>{person.activeOT}</td>
                            <td>
                                <Button variant="ghost" size="sm">👁️ Ver</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

// ============================================
// EJEMPLO 4: Sidebar de Navegación
// ============================================
export const Sidebar: React.FC = () => {
    const menuItems = [
        { icon: '🏠', label: 'Inicio', active: true },
        { icon: '👥', label: 'Personal', active: false },
        { icon: '📋', label: 'Órdenes de Trabajo', active: false },
        { icon: '📊', label: 'Reportes', active: false },
        { icon: '⚙️', label: 'Configuración', active: false },
    ];

    return (
        <aside className="sidebar">
            <div className="p-4 border-b border-border-light">
                <h1 className="text-xl font-bold text-primary-600">SupraSense</h1>
                <p className="text-xs text-text-secondary">Sistema de Gestión</p>
            </div>

            <nav className="flex-1 p-2">
                {menuItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`sidebar-item ${item.active ? 'active' : ''}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-border-light">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        JD
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">John Doe</p>
                        <p className="text-xs text-text-secondary">Administrador</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

// ============================================
// EJEMPLO 5: Formulario de Nuevo Personal
// ============================================
export const NewPersonnelForm: React.FC = () => {
    return (
        <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Nuevo Personal</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Área
                        </label>
                        <select className="input">
                            <option>Seleccione un área</option>
                            <option>Logística</option>
                            <option>Médicos</option>
                            <option>Intendencia</option>
                            <option>Planilla Cadetes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Turno
                        </label>
                        <select className="input">
                            <option>Seleccione un turno</option>
                            <option>Mañana</option>
                            <option>Tarde</option>
                            <option>Noche</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Contacto
                        </label>
                        <input
                            type="tel"
                            className="input"
                            placeholder="Ej: +54 9 11 1234-5678"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Especialidad
                    </label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Ej: Manejo de usuarios"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary">Cancelar</Button>
                    <Button variant="primary">Guardar Personal</Button>
                </div>
            </form>
        </Card>
    );
};

// ============================================
// EJEMPLO 6: Dashboard Stats Cards
// ============================================
export const DashboardStats: React.FC = () => {
    const stats = [
        { label: 'Total Personal', value: '5', icon: '👥', color: 'bg-primary-500' },
        { label: 'Disponibles', value: '3', icon: '✅', color: 'bg-status-available' },
        { label: 'En Servicio', value: '1', icon: '🔄', color: 'bg-status-inService' },
        { label: 'En Licencia', value: '1', icon: '📅', color: 'bg-status-onLeave' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} hover className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                            {stat.icon}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

// ============================================
// EJEMPLO 7: Layout Principal Completo
// ============================================
export const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-surface-secondary">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container-custom py-8">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Gestión de Personal
                        </h1>
                        <p className="text-text-secondary">
                            Administración de recursos humanos y asignaciones
                        </p>
                    </header>

                    {/* Stats */}
                    <div className="mb-8">
                        <DashboardStats />
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar />
                    </div>

                    {/* Personnel Table */}
                    <PersonnelTable />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
