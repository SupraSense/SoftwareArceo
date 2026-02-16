import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Poblando la base de datos');
    // 1. Crear registros estado
    const statusVal = await prisma.clientStatus.upsert({
        where: { name: 'Activo' },
        update: {},
        create: { name: 'Activo' }
    });
    const status2 = await prisma.clientStatus.upsert({
        where: { name: 'Inactivo' },
        update: {},
        create: { name: 'Inactivo' }
    });
    console.log({ "Estados creados": statusVal, status2 });

    // 2. Crear Clientes
    const ypf = await prisma.client.upsert({
        where: { cuit: '30-54668997-9' },
        update: {},
        create: {
            razonSocial: 'YPF S.A.',
            cuit: '30-54668997-9',
            direccion: 'Macacha Güemes 515, CABA',
            statusId: statusVal.id,
            contacts: {
                create: {
                    name: 'Juan Pérez',
                    phone: '+54 11 5466 8997',
                    email: 'juan.perez@ypf.com'
                }
            },
            contracts: {
                create: [
                    { isActive: true },
                    { isActive: true },
                    { isActive: true } // 3 Contracts
                ]
            }
        }
    });
    const shell = await prisma.client.upsert({
        where: { cuit: '30-50003815-4' },
        update: {},
        create: {
            razonSocial: 'Shell Argentina S.A.',
            cuit: '30-50003815-4',
            direccion: 'Av. Roque Sáenz Peña 788, CABA',
            statusId: statusVal.id,
            contacts: {
                create: {
                    name: 'Maria González',
                    phone: '+54 11 5000 3815',
                    email: 'maria.gonzalez@shell.com'
                }
            },
            contracts: {
                create: [
                    { isActive: true },
                    { isActive: true } // 2 Contracts
                ]
            }
        }
    });
    const total = await prisma.client.upsert({
        where: { cuit: '30-62605802-9' },
        update: {},
        create: {
            razonSocial: 'Total Austral S.A.',
            cuit: '30-62605802-9',
            direccion: 'Moreno 877, CABA',
            statusId: statusVal.id,
            contacts: {
                create: {
                    name: 'Carlos Rodríguez',
                    phone: '+54 11 6260 5802',
                    email: 'carlos.rodriguez@total.com'
                }
            },
            contracts: {
                create: [
                    { isActive: true } // 1 Contract
                ]
            }
        }
    });
    console.log({ "Clientes creados": ypf, shell, total });

    // 3. Crear Tipos de Tarea
    const taskTypes = [
        'Entrega',
        'Devolución',
        'DTM',
        'Cambio',
        'Taller móvil',
        'Mantenimiento preventivo'
    ];
    for (const type of taskTypes) {
        await prisma.tipoTarea.upsert({
            where: { nombre: type },
            update: {},
            create: { nombre: type }
        });
    }
    console.log({ "Tipos de Tarea creados": taskTypes });
    // 4. Crear Estados de Personal
    const personalStatuses = ['Disponible', 'En Servicio', 'Licencia'];
    const statusMap: Record<string, number> = {};

    for (const status of personalStatuses) {
        const s = await prisma.personalStatus.upsert({
            where: { nombre: status },
            update: {},
            create: { nombre: status }
        });
        statusMap[status] = s.id;
    }
    console.log({ "Estados Personal creados": personalStatuses });

    // 5. Crear Areas de Personal
    const personalAreas = ['Logística', 'Módulos', 'Periféricos'];
    const areaMap: Record<string, number> = {};

    for (const area of personalAreas) {
        const a = await prisma.areaPersonal.upsert({
            where: { nombre: area },
            update: {},
            create: { nombre: area }
        });
        areaMap[area] = a.id;
    }
    console.log({ "Areas Personal creadas": personalAreas });

    // 6. Crear Personal
    const personalData = [
        {
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juan.perez@example.com',
            telefono: '+54911-5555-5555',
            areaId: areaMap['Logística'],
            statusId: statusMap['Disponible'],
            fecha_ingreso: new Date('2023-01-15')
        },
        {
            nombre: 'Ana',
            apellido: 'Gomez',
            email: 'ana.gomez@example.com',
            telefono: '+54911-6666-6666',
            areaId: areaMap['Módulos'],
            statusId: statusMap['En Servicio'], // Was 'Ocupado' but valid status is 'En Servicio'
            fecha_ingreso: new Date('2023-03-10')
        },
        {
            nombre: 'Carlos',
            apellido: 'Rodriguez',
            email: 'carlos.rodriguez@example.com',
            telefono: '+54911-7777-7777',
            areaId: areaMap['Periféricos'], // Was 'RRHH' but valid is 'Periféricos' (Wait, mock data had RRHH? Prompt says Logistica, Modulos, Perisfericos)
            // Let's assume Carlos is in Perifericos now as RRHH is not in the requested list.
            statusId: statusMap['Licencia'],
            fecha_ingreso: new Date('2022-11-20')
        }
    ];

    for (const p of personalData) {
        await prisma.personal.upsert({
            where: { email: p.email },
            update: {
                areaId: p.areaId,
                statusId: p.statusId
            },
            create: p
        });
    }
    console.log({ "Personal creado": personalData.length });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
