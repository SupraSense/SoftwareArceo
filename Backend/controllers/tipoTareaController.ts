import { Request, Response } from 'express';
import * as tipoTareaService from '../services/tipoTareaService';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const tipos = await tipoTareaService.getAllTipos();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de tarea', error });
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipo = await tipoTareaService.getTipoById(Number(id));
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }
        return res.json(tipo);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el tipo de tarea', error });
    }
};

export const create = async (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }
    try {
        const nuevoTipo = await tipoTareaService.createTipo(nombre);
        return res.status(201).json(nuevoTipo);
    } catch (error) {
        // @ts-ignore
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un tipo de tarea con este nombre' });
        }
        return res.status(500).json({ message: 'Error al crear el tipo de tarea', error });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const tipoActualizado = await tipoTareaService.updateTipo(Number(id), nombre);
        return res.json(tipoActualizado);
    } catch (error) {
        // @ts-ignore
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un tipo de tarea con este nombre' });
        }
        return res.status(500).json({ message: 'Error al actualizar el tipo de tarea', error });
    }
};

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await tipoTareaService.deleteTipo(Number(id));
        res.json({ message: 'Tipo de tarea eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de tarea', error });
    }
};
