import React from 'react';

/**
 * Componente de demostración del tema Tailwind CSS
 * Muestra ejemplos de todos los componentes y estilos disponibles
 */
const ThemeDemo: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface-secondary p-8">
            <div className="container-custom">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                        Sistema de Gestión - SupraSense
                    </h1>
                    <p className="text-text-secondary">
                        Demostración del tema Tailwind CSS personalizado
                    </p>
                </header>

                {/* Sección de Colores */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Paleta de Colores</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card p-4">
                            <div className="w-full h-20 bg-primary-500 rounded-lg mb-2"></div>
                            <p className="text-sm font-medium">Primary 500</p>
                        </div>
                        <div className="card p-4">
                            <div className="w-full h-20 bg-status-available rounded-lg mb-2"></div>
                            <p className="text-sm font-medium">Disponible</p>
                        </div>
                        <div className="card p-4">
                            <div className="w-full h-20 bg-status-inService rounded-lg mb-2"></div>
                            <p className="text-sm font-medium">En Servicio</p>
                        </div>
                        <div className="card p-4">
                            <div className="w-full h-20 bg-status-onLeave rounded-lg mb-2"></div>
                            <p className="text-sm font-medium">Licencia</p>
                        </div>
                    </div>
                </section>

                {/* Sección de Botones */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Botones</h2>
                    <div className="card p-6">
                        <div className="flex flex-wrap gap-4">
                            <button className="btn btn-primary">
                                Botón Principal
                            </button>
                            <button className="btn btn-secondary">
                                Botón Secundario
                            </button>
                            <button className="btn btn-ghost">
                                Botón Ghost
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sección de Badges */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Badges de Estado</h2>
                    <div className="card p-6">
                        <div className="flex flex-wrap gap-3">
                            <span className="badge badge-available">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                Disponible
                            </span>
                            <span className="badge badge-in-service">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                En servicio
                            </span>
                            <span className="badge badge-on-leave">
                                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                                Licencia
                            </span>
                            <span className="badge badge-inactive">
                                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                                Inactivo
                            </span>
                        </div>
                    </div>
                </section>

                {/* Sección de Cards */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Cards de Personal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="card card-hover p-6 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">Juan Pérez</h3>
                                    <p className="text-sm text-text-secondary">Logística</p>
                                </div>
                                <span className="badge badge-available">Disponible</span>
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
                                <button className="btn btn-primary flex-1 text-sm">Ver Detalles</button>
                                <button className="btn btn-ghost text-sm">📞</button>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="card card-hover p-6 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">María González</h3>
                                    <p className="text-sm text-text-secondary">Médicos</p>
                                </div>
                                <span className="badge badge-in-service">En servicio</span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Turno:</span>
                                    <span className="text-text-primary font-medium">Tarde</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">OT Activas:</span>
                                    <span className="text-text-primary font-medium">1</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">OT Completadas:</span>
                                    <span className="text-text-primary font-medium">32</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="btn btn-primary flex-1 text-sm">Ver Detalles</button>
                                <button className="btn btn-ghost text-sm">📞</button>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="card card-hover p-6 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">Carlos Rodríguez</h3>
                                    <p className="text-sm text-text-secondary">Intendencia</p>
                                </div>
                                <span className="badge badge-on-leave">Licencia</span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Turno:</span>
                                    <span className="text-text-primary font-medium">Noche</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">OT Activas:</span>
                                    <span className="text-text-primary font-medium">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">OT Completadas:</span>
                                    <span className="text-text-primary font-medium">28</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="btn btn-primary flex-1 text-sm">Ver Detalles</button>
                                <button className="btn btn-ghost text-sm">📞</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Tabla */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Lista de Personal</h2>
                    <div className="card overflow-hidden">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Área</th>
                                    <th>Estado</th>
                                    <th>Turno</th>
                                    <th>Contacto</th>
                                    <th>OT Activas</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-medium">Juan Pérez</td>
                                    <td>Logística</td>
                                    <td>
                                        <span className="badge badge-available">Disponible</span>
                                    </td>
                                    <td>Mañana</td>
                                    <td>📞 💬</td>
                                    <td>2</td>
                                    <td>
                                        <button className="btn btn-ghost text-sm">👁️</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">María González</td>
                                    <td>Médicos</td>
                                    <td>
                                        <span className="badge badge-in-service">En servicio</span>
                                    </td>
                                    <td>Tarde</td>
                                    <td>📞 💬</td>
                                    <td>1</td>
                                    <td>
                                        <button className="btn btn-ghost text-sm">👁️</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Carlos Rodríguez</td>
                                    <td>Intendencia</td>
                                    <td>
                                        <span className="badge badge-on-leave">Licencia</span>
                                    </td>
                                    <td>Noche</td>
                                    <td>📞 💬</td>
                                    <td>0</td>
                                    <td>
                                        <button className="btn btn-ghost text-sm">👁️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Sección de Formularios */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Formularios</h2>
                    <div className="card p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ingrese el nombre"
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
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Buscar por nombre o especialidad..."
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button className="btn btn-secondary">Cancelar</button>
                            <button className="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-text-secondary text-sm mt-12">
                    <p>© 2026 SupraSense - Sistema de Gestión de Órdenes de Trabajo</p>
                </footer>
            </div>
        </div>
    );
};

export default ThemeDemo;
