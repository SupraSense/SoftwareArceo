import prisma from '../lib/prisma';
import { ConflictError, NotFoundError } from '../lib/errors';
import type { CreateSegmentoInput } from '../validators/segmentoValidation';

export const getAllSegmentos = async () => {
    return prisma.segmento.findMany({
        where: { isActive: true },
        orderBy: { nombre: 'asc' },
    });
};

export const createSegmento = async (data: CreateSegmentoInput) => {
    try {
        return await prisma.segmento.create({ data });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Este segmento ya se encuentra registrado');
        }
        throw error;
    }
};

export const softDeleteSegmento = async (id: number) => {
    const segmento = await prisma.segmento.findUnique({ where: { id } });
    if (!segmento || !segmento.isActive) {
        throw new NotFoundError('Segmento no encontrado');
    }

    return prisma.segmento.update({
        where: { id },
        data: { isActive: false },
    });
};
