export type UserRole = 'ADMIN' | 'OPERADOR' | 'SUPERVISOR' | 'CHOFER' | 'TALLER';

export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';

export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    dni: string | null;
    address: string | null;
    role: UserRole | null;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    role: UserRole;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    dni?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface UserValidationResponse {
    available: boolean;
    message?: string;
}

export const USER_ROLES: { value: UserRole; label: string }[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'OPERADOR', label: 'Operador' },
    { value: 'SUPERVISOR', label: 'Supervisor' },
    { value: 'CHOFER', label: 'Chofer' },
    { value: 'TALLER', label: 'Taller' },
];

export const USER_STATUSES: { value: UserStatus; label: string; variant: 'success' | 'error' | 'warning' }[] = [
    { value: 'ACTIVO', label: 'Activo', variant: 'success' },
    { value: 'INACTIVO', label: 'Inactivo', variant: 'error' },
    { value: 'PENDIENTE', label: 'Pendiente', variant: 'warning' },
];
