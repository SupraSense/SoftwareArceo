export interface Personal {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    area: string;
    estado: 'Disponible' | 'En Servicio' | 'Licencia';
    fecha_ingreso: string;
    created_at: string;
    updated_at: string;
}

export interface PersonalFilters {
    nombre?: string;
    estado?: string;
    area?: string;
}
