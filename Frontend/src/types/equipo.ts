export interface Equipo {
    id: number;
    nombre: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateEquipoDTO {
    nombre: string;
}
