import { useState, useEffect } from 'react';
import { StaffList } from '../../components/staff/StaffList';
import { StaffForm } from '../../components/staff/StaffForm';
import type { Personal, PersonalFilters } from '../../types/personal';
import api from '../../services/api';
import { Plus, Search, Filter, X, Users, CheckCircle, Clock, UserX } from 'lucide-react';

export const Staff = () => {
    const [staff, setStaff] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<PersonalFilters>({
        nombre: '',
        estado: 'Todos',
        area: 'Todas'
    });

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Personal | null>(null);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filters.nombre) params.nombre = filters.nombre;
            if (filters.estado && filters.estado !== 'Todos') params.estado = filters.estado;
            if (filters.area && filters.area !== 'Todas') params.area = filters.area;

            const response = await api.get('/personal', { params });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [filters]);

    const handleCreate = () => {
        setSelectedStaff(null);
        setIsFormOpen(true);
    };

    const handleEdit = (personal: Personal) => {
        setSelectedStaff(personal);
        setIsFormOpen(true);
    };

    const handleFormSubmit = () => {
        setIsFormOpen(false);
        fetchStaff(); // Refresh list
    };

    // KPI calculations
    const totalPersonal = staff.length;
    const availablePersonal = staff.filter(p => p.estado === 'Disponible').length;
    const inServicePersonal = staff.filter(p => p.estado === 'En Servicio').length;
    const licensePersonal = staff.filter(p => p.estado === 'Licencia').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Personal</h1>
                    <p className="text-gray-500 dark:text-gray-400">Administración de recursos humanos y asignaciones</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Personal
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Personal</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalPersonal}</h3>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <Users className="text-slate-600 dark:text-slate-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Disponibles</p>
                            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{availablePersonal}</h3>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En Servicio</p>
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{inServicePersonal}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En Licencia</p>
                            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{licensePersonal}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <UserX className="text-orange-600 dark:text-orange-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-200">
                    <Filter size={20} />
                    <h3 className="font-semibold">Filtros de Búsqueda</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                            value={filters.nombre}
                            onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                        />
                    </div>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                        value={filters.estado}
                        onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                    >
                        <option value="Todos">Todos los Estados</option>
                        <option value="Disponible">Disponible</option>
                        <option value="En Servicio">En Servicio</option>
                        <option value="Licencia">Licencia</option>
                    </select>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                        value={filters.area}
                        onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    >
                        <option value="Todas">Todas las Áreas</option>
                        <option value="Logística">Logística</option>
                        <option value="Módulos">Módulos</option>
                        <option value="Periféricos">Periféricos</option>
                    </select>
                    <button
                        onClick={() => setFilters({ nombre: '', estado: 'Todos', area: 'Todas' })}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <X size={18} />
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* List */}
            <StaffList
                staff={staff}
                loading={loading}
                onEdit={handleEdit}
                onView={() => { }}
            />

            {/* Modals */}
            {isFormOpen && (
                <StaffForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={selectedStaff}
                />
            )}
        </div>
    );
};
