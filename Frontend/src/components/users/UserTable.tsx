import React, { useState } from 'react';
import { Search, Users, Pencil, Power, PowerOff, MailPlus, Shield, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { User, UserRole, UserStatus } from '../../types/user';
import { USER_ROLES, USER_STATUSES } from '../../types/user';

interface UserTableProps {
    users: User[];
    onEditUser: (user: User) => void;
    onDeactivateUser: (user: User) => void;
    onActivateUser: (user: User) => void;
    onResendInvitation: (user: User) => void;
}

const getRoleLabel = (role: UserRole | null): string => {
    if (!role) return 'Sin Rol';
    const found = USER_ROLES.find(r => r.value === role);
    return found ? found.label : role;
};

const getStatusBadge = (status: UserStatus): { label: string; variant: 'success' | 'error' | 'warning' } => {
    const found = USER_STATUSES.find(s => s.value === status);
    return found || { label: status, variant: 'warning' as const };
};

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onEditUser,
    onDeactivateUser,
    onActivateUser,
    onResendInvitation,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [roleFilter, setRoleFilter] = useState<string>('TODOS');

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.dni || '').includes(searchTerm);

        const matchesStatus = statusFilter === 'TODOS' || user.status === statusFilter;
        const matchesRole = roleFilter === 'TODOS' || user.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const getInitials = (firstName: string | null, lastName: string | null): string => {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return `${first}${last}` || '??';
    };

    return (
        <div className="space-y-4">
            {/* Filters bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o DNI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-sm font-medium transition-shadow"
                        >
                            <option value="TODOS">Todos los estados</option>
                            {USER_STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    {/* Role filter */}
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-sm font-medium transition-shadow"
                        >
                            <option value="TODOS">Todos los roles</option>
                            {USER_ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={20} /> Usuarios del Sistema
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {filteredUsers.length} de {users.length} usuario(s)
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-700/50">
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DNI</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                No se encontraron usuarios
                                            </p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm">
                                                Intenta ajustar los filtros de búsqueda
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const statusInfo = getStatusBadge(user.status);
                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group"
                                        >
                                            {/* Avatar + Name */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                                                        ${user.status === 'ACTIVO'
                                                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                                            : user.status === 'PENDIENTE'
                                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                                        }
                                                    `}>
                                                        {getInitials(user.firstName, user.lastName)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DNI */}
                                            <td className="py-3.5 px-5 text-sm text-gray-600 dark:text-gray-300 font-mono">
                                                {user.dni || '-'}
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-5 text-sm text-gray-600 dark:text-gray-300">
                                                {user.email}
                                            </td>

                                            {/* Role */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-5">
                                                <Badge variant={statusInfo.variant}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => onEditUser(user)}
                                                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                                                        leftIcon={<Pencil size={14} />}
                                                    >
                                                        Editar
                                                    </Button>

                                                    {user.status === 'PENDIENTE' && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => onResendInvitation(user)}
                                                            className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 shadow-sm"
                                                            leftIcon={<MailPlus size={14} />}
                                                        >
                                                            Reenviar
                                                        </Button>
                                                    )}

                                                    {user.status === 'ACTIVO' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => onDeactivateUser(user)}
                                                            className="shadow-sm"
                                                            leftIcon={<PowerOff size={14} />}
                                                        >
                                                            Baja
                                                        </Button>
                                                    ) : user.status === 'INACTIVO' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => onActivateUser(user)}
                                                            className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 shadow-sm"
                                                            leftIcon={<Power size={14} />}
                                                        >
                                                            Activar
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
