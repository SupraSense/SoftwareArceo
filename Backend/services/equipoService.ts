import prisma from '../lib/prisma';
import { ConflictError, NotFoundError } from '../lib/errors';
import type { CreateEquipoInput } from '../validators/equipoValidation';

export const getAllEquipos = async () => {
    return prisma.equipo.findMany({
        where: { isActive: true },
        orderBy: { nombre: 'asc' },
    });
};

export const createEquipo = async (data: CreateEquipoInput) => {
    try {
        return await prisma.equipo.create({ data });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Este equipo ya se encuentra registrado');
        }
        throw error;
    }
};

export const softDeleteEquipo = async (id: number) => {
    const equipo = await prisma.equipo.findUnique({ where: { id } });
    if (!equipo || !equipo.isActive) {
        throw new NotFoundError('Equipo no encontrado');
    }

    return prisma.equipo.update({
        where: { id },
        data: { isActive: false },
    });
};
