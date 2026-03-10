import prisma from '../lib/prisma';
import { NotFoundError, ValidationError } from '../lib/errors';
import type { CreatePersonalInput, UpdatePersonalInput } from '../validators/personalValidation';

export const createPersonal = async (data: CreatePersonalInput) => {
    const areaRecord = await prisma.areaPersonal.findUnique({ where: { nombre: data.area } });
    if (!areaRecord) throw new ValidationError(`Área no válida: ${data.area}`);

    const statusName = data.estado || 'Disponible';
    const statusRecord = await prisma.personalStatus.findUnique({ where: { nombre: statusName } });
    if (!statusRecord) throw new ValidationError(`Estado no válido: ${statusName}`);

    return prisma.personal.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono || null,
            areaId: areaRecord.id,
            statusId: statusRecord.id,
            fecha_ingreso: new Date(data.fecha_ingreso),
        },
        include: { area: true, status: true },
    });
};

interface PersonalFilters {
    nombre?: string;
    estado?: string;
    area?: string;
}

export const getAllPersonal = async (filters?: PersonalFilters) => {
    const where: any = {};

    if (filters?.nombre) {
        where.OR = [
            { nombre: { contains: filters.nombre, mode: 'insensitive' } },
            { apellido: { contains: filters.nombre, mode: 'insensitive' } },
        ];
    }

    if (filters?.estado && filters.estado !== 'Todos') {
        where.status = { nombre: filters.estado };
    }

    if (filters?.area && filters.area !== 'Todas') {
        where.area = { nombre: filters.area };
    }

    const personal = await prisma.personal.findMany({
        where,
        include: { area: true, status: true },
        orderBy: { created_at: 'desc' },
    });

    return personal.map((p) => ({
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre,
        areaId: undefined,
        statusId: undefined,
    }));
};

export const getPersonalById = async (id: number) => {
    const p = await prisma.personal.findUnique({
        where: { id },
        include: { area: true, status: true },
    });

    if (!p) {
        throw new NotFoundError('Personal no encontrado');
    }

    return {
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre,
    };
};

export const updatePersonal = async (id: number, data: UpdatePersonalInput) => {
    const existing = await prisma.personal.findUnique({ where: { id } });
    if (!existing) {
        throw new NotFoundError('Personal no encontrado');
    }

    const updateData: any = {};

    if (data.nombre) updateData.nombre = data.nombre;
    if (data.apellido) updateData.apellido = data.apellido;
    if (data.email) updateData.email = data.email;
    if (data.telefono !== undefined) updateData.telefono = data.telefono || null;
    if (data.fecha_ingreso) updateData.fecha_ingreso = new Date(data.fecha_ingreso);

    if (data.area) {
        const areaRecord = await prisma.areaPersonal.findUnique({ where: { nombre: data.area } });
        if (!areaRecord) throw new ValidationError(`Área no válida: ${data.area}`);
        updateData.areaId = areaRecord.id;
    }

    if (data.estado) {
        const statusRecord = await prisma.personalStatus.findUnique({ where: { nombre: data.estado } });
        if (!statusRecord) throw new ValidationError(`Estado no válido: ${data.estado}`);
        updateData.statusId = statusRecord.id;
    }

    const p = await prisma.personal.update({
        where: { id },
        data: updateData,
        include: { area: true, status: true },
    });

    return {
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre,
    };
};
