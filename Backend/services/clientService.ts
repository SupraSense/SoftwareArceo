import prisma from '../lib/prisma';
import { NotFoundError, ConflictError } from '../lib/errors';
import type { CreateClientInput, UpdateClientInput } from '../validators/clientValidation';

export const getAllClients = async () => {
    const clients = await prisma.client.findMany({
        where: {
            status: { name: { not: 'Inactivo' } },
        },
        include: {
            status: true,
            contacts: true,
            _count: {
                select: { contracts: { where: { isActive: true } } },
            },
        },
        orderBy: { razonSocial: 'asc' },
    });

    return clients.map((c) => ({
        id: c.id,
        razonSocial: c.razonSocial,
        cuit: c.cuit,
        contactName: c.contacts[0]?.name || 'Sin Contacto',
        phone: c.contacts[0]?.phone || '',
        email: c.contacts[0]?.email || '',
        activeContracts: c._count.contracts,
        status: c.status.name,
    }));
};

export const getClientById = async (id: string) => {
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            status: true,
            contacts: true,
            _count: {
                select: { contracts: { where: { isActive: true } } },
            },
        },
    });

    if (!client) {
        throw new NotFoundError('Cliente no encontrado');
    }

    return {
        id: client.id,
        razonSocial: client.razonSocial,
        cuit: client.cuit,
        address: client.direccion,
        status: client.status.name,
        contactName: client.contacts[0]?.name || 'Sin Contacto',
        phone: client.contacts[0]?.phone || '',
        email: client.contacts[0]?.email || '',
        activeContracts: client._count.contracts,
    };
};

export const createClient = async (data: CreateClientInput) => {
    try {
        return await prisma.$transaction(async (tx) => {
            let activeStatus = await tx.clientStatus.findUnique({ where: { name: 'Activo' } });
            if (!activeStatus) {
                activeStatus = await tx.clientStatus.create({ data: { name: 'Activo' } });
            }

            return tx.client.create({
                data: {
                    razonSocial: data.razonSocial,
                    cuit: data.cuit,
                    direccion: data.address || '',
                    statusId: activeStatus.id,
                    contacts: {
                        create: {
                            name: data.contactName || '',
                            phone: data.phone,
                            email: data.email,
                        },
                    },
                },
                include: {
                    contacts: true,
                    status: true,
                },
            });
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('El CUIT ingresado ya existe');
        }
        throw error;
    }
};

export const updateClient = async (id: string, data: UpdateClientInput) => {
    const client = await prisma.client.findUnique({
        where: { id },
        include: { contracts: true },
    });

    if (!client) {
        throw new NotFoundError('Cliente no encontrado');
    }

    if (data.cuit && data.cuit !== client.cuit && client.contracts.length > 0) {
        throw new ConflictError('No se puede modificar el CUIT de un cliente con contratos existentes');
    }

    return prisma.client.update({
        where: { id },
        data: {
            ...(data.razonSocial !== undefined && { razonSocial: data.razonSocial }),
            ...(data.address !== undefined && { direccion: data.address }),
            contacts: {
                updateMany: {
                    where: { clientId: id },
                    data: {
                        ...(data.contactName !== undefined && { name: data.contactName }),
                        ...(data.phone !== undefined && { phone: data.phone }),
                        ...(data.email !== undefined && { email: data.email }),
                    },
                },
            },
        },
        include: {
            contacts: true,
            status: true,
            _count: {
                select: { contracts: { where: { isActive: true } } },
            },
        },
    });
};

export const deleteClient = async (id: string) => {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
        throw new NotFoundError('Cliente no encontrado');
    }

    let inactiveStatus = await prisma.clientStatus.findUnique({ where: { name: 'Inactivo' } });
    if (!inactiveStatus) {
        inactiveStatus = await prisma.clientStatus.create({ data: { name: 'Inactivo' } });
    }

    return prisma.client.update({
        where: { id },
        data: { statusId: inactiveStatus.id },
    });
};
