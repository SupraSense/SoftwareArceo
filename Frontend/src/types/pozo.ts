export interface Pozo {
    id: string;
    nombre: string;
    ubicacionUrl: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePozoDTO {
    nombre: string;
    ubicacionUrl: string;
}
