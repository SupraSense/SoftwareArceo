import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (_req: Request, res: Response) => {
    try {
        const tipos = await prisma.tipoTarea.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de tarea', error });
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipo = await prisma.tipoTarea.findUnique({
            where: { id: Number(id) }
        });
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tipo de tarea', error });
    }
};

export const create = async (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }
    try {
        const nuevoTipo = await prisma.tipoTarea.create({
            data: { nombre }
        });
        res.status(201).json(nuevoTipo);
    } catch (error) {
        // Prisma unique constraint violation code is P2002
        // @ts-ignore
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un tipo de tarea con este nombre' });
        }
        res.status(500).json({ message: 'Error al crear el tipo de tarea', error });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const tipoActualizado = await prisma.tipoTarea.update({
            where: { id: Number(id) },
            data: { nombre }
        });
        res.json(tipoActualizado);
    } catch (error) {
        // @ts-ignore
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un tipo de tarea con este nombre' });
        }
        res.status(500).json({ message: 'Error al actualizar el tipo de tarea', error });
    }
};

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.tipoTarea.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Tipo de tarea eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de tarea', error });
    }
};
