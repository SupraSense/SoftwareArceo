import prisma from '../lib/prisma';
import { ConflictError, NotFoundError } from '../lib/errors';
import type { CreatePozoInput } from '../validators/pozoValidation';

export const getAllPozos = async () => {
    return prisma.pozo.findMany({
        where: { isActive: true },
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
