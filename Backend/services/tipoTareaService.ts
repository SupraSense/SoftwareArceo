import prisma from '../lib/prisma';
import { ConflictError } from '../lib/errors';

export const getAllTipos = async () => {
    return prisma.tipoTarea.findMany({
        orderBy: { id: 'asc' },
    });
};

export const getTipoById = async (id: number) => {
    return prisma.tipoTarea.findUnique({
        where: { id },
    });
};

export const createTipo = async (nombre: string) => {
    try {
        return await prisma.tipoTarea.create({
            data: { nombre },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Ya existe un tipo de tarea con este nombre');
        }
        throw error;
    }
};

export const updateTipo = async (id: number, nombre: string) => {
    try {
        return await prisma.tipoTarea.update({
            where: { id },
            data: { nombre },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Ya existe un tipo de tarea con este nombre');
        }
        throw error;
    }
};

export const deleteTipo = async (id: number) => {
    await prisma.tipoTarea.delete({
        where: { id },
    });
};
