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
