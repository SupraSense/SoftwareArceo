export interface Client {
    id: string;
    razonSocial: string;
    cuit: string;
    contactName: string;
    phone: string;
    email: string;
    activeContracts: number;
    status: string;
    address?: string;
}

export interface ClientContact {
    id?: string;
    name: string;
    phone: string;
    email: string;
    isPrincipal: boolean;
}

export interface ClientPozo {
    id: string;
    nombre: string;
    ubicacionUrl: string;
}

export interface ClientDetail {
    id: string;
    razonSocial: string;
    cuit: string;
    address: string;
    status: string;
    contacts: ClientContact[];
    pozos: ClientPozo[];
    activeContracts: number;
}
