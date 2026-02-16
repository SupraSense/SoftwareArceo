import { PrismaClient, Personal } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to find or create ID for Area/Status (if we wanted dynamic, but for now we look up)
// User wants strict adherence to available areas/statuses, but frontend sends strings.
// We should look up the IDs corresponding to the strings.

export const createPersonal = async (data: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    area: string; // "Logística", etc.
    fecha_ingreso: string; // ISO String
    estado?: string; // Optional init status
}): Promise<Personal> => {
    // Look up Area
    const areaRecord = await prisma.areaPersonal.findUnique({ where: { nombre: data.area } });
    if (!areaRecord) throw new Error(`Área no válida: ${data.area}`);

    // Look up Status (Default Available)
    const statusName = data.estado || 'Disponible';
    const statusRecord = await prisma.personalStatus.findUnique({ where: { nombre: statusName } });
    if (!statusRecord) throw new Error(`Estado no válido: ${statusName}`);

    return await prisma.personal.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            areaId: areaRecord.id,
            statusId: statusRecord.id,
            fecha_ingreso: new Date(data.fecha_ingreso),
        },
        include: {
            area: true,
            status: true
        }
    });
};

export const getAllPersonal = async (filters?: {
    nombre?: string;
    estado?: string;
    area?: string;
}): Promise<any[]> => { // Return type complex with includes, using any [] or inferred
    const where: any = {};

    if (filters?.nombre) {
        where.OR = [
            { nombre: { contains: filters.nombre, mode: 'insensitive' } },
            { apellido: { contains: filters.nombre, mode: 'insensitive' } }
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
        include: {
            area: true,
            status: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    // Flatten for frontend compatibility if needed, or frontend updates to check .area.nombre
    // Refactoring service to return flat object similar to before for minimal frontend breakage?
    // Frontend expects: area: string, estado: string.
    return personal.map(p => ({
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre,
        areaId: undefined, // hide implementation details optionally
        statusId: undefined
    }));
};

export const getPersonalById = async (id: number): Promise<any | null> => {
    const p = await prisma.personal.findUnique({
        where: { id },
        include: {
            area: true,
            status: true
        }
    });

    if (!p) return null;

    return {
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre
    };
};

export const updatePersonal = async (
    id: number,
    data: Partial<{
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        area: string;
        estado: string;
        fecha_ingreso: string;
    }>
): Promise<any> => {
    const updateData: any = {};

    if (data.nombre) updateData.nombre = data.nombre;
    if (data.apellido) updateData.apellido = data.apellido;
    if (data.email) updateData.email = data.email;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.fecha_ingreso) updateData.fecha_ingreso = new Date(data.fecha_ingreso);

    if (data.area) {
        const areaRecord = await prisma.areaPersonal.findUnique({ where: { nombre: data.area } });
        if (areaRecord) updateData.areaId = areaRecord.id;
    }

    if (data.estado) {
        const statusRecord = await prisma.personalStatus.findUnique({ where: { nombre: data.estado } });
        if (statusRecord) updateData.statusId = statusRecord.id;
    }

    const p = await prisma.personal.update({
        where: { id },
        data: updateData,
        include: {
            area: true,
            status: true
        }
    });

    return {
        ...p,
        area: p.area.nombre,
        estado: p.status.nombre
    };
};
