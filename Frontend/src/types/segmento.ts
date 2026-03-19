export interface Segmento {
    id: number;
    nombre: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateSegmentoDTO {
    nombre: string;
}
