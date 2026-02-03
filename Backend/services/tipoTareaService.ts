import { PrismaClient, TipoTarea } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTipos = async (): Promise<TipoTarea[]> => {
    return await prisma.tipoTarea.findMany({
        orderBy: { id: 'asc' }
    });
};

export const getTipoById = async (id: number): Promise<TipoTarea | null> => {
    return await prisma.tipoTarea.findUnique({
        where: { id }
    });
};

export const createTipo = async (nombre: string): Promise<TipoTarea> => {
    return await prisma.tipoTarea.create({
        data: { nombre }
    });
};

export const updateTipo = async (id: number, nombre: string): Promise<TipoTarea> => {
    return await prisma.tipoTarea.update({
        where: { id },
        data: { nombre }
    });
};

export const deleteTipo = async (id: number): Promise<void> => {
    await prisma.tipoTarea.delete({
        where: { id }
    });
};
