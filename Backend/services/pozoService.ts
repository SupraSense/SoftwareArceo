import prisma from '../lib/prisma';
import { ConflictError, NotFoundError } from '../lib/errors';
import type { CreatePozoInput } from '../validators/pozoValidation';

export const getAllPozos = async () => {
    return prisma.pozo.findMany({
        where: { isActive: true },
        orderBy: { nombre: 'asc' },
    });
};

export const getAvailablePozos = async () => {
    return prisma.pozo.findMany({
        where: { isActive: true, clienteId: null },
        orderBy: { nombre: 'asc' },
    });
};

export const getPozosByClient = async (clienteId: string) => {
    return prisma.pozo.findMany({
        where: { clienteId, isActive: true },
        orderBy: { nombre: 'asc' },
    });
};

export const createPozo = async (data: CreatePozoInput) => {
    try {
        return await prisma.pozo.create({ data });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Ya existe un pozo con ese nombre');
        }
        throw error;
    }
};

export const associateToClient = async (pozoId: string, clienteId: string) => {
    const pozo = await prisma.pozo.findUnique({ where: { id: pozoId } });
    if (!pozo || !pozo.isActive) {
        throw new NotFoundError('Pozo no encontrado');
    }
    if (pozo.clienteId && pozo.clienteId !== clienteId) {
        throw new ConflictError('Este pozo ya está asociado a otro cliente');
    }

    return prisma.pozo.update({
        where: { id: pozoId },
        data: { clienteId },
    });
};

export const disassociateFromClient = async (pozoId: string) => {
    const pozo = await prisma.pozo.findUnique({ where: { id: pozoId } });
    if (!pozo || !pozo.isActive) {
        throw new NotFoundError('Pozo no encontrado');
    }

    return prisma.pozo.update({
        where: { id: pozoId },
        data: { clienteId: null },
    });
};

export const softDeletePozo = async (id: string) => {
    const pozo = await prisma.pozo.findUnique({ where: { id } });
    if (!pozo || !pozo.isActive) {
        throw new NotFoundError('Pozo no encontrado');
    }

    return prisma.pozo.update({
        where: { id },
        data: { isActive: false },
    });
};
