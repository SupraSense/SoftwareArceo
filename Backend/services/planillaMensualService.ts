import prisma from '../lib/prisma';
import { NotFoundError, ConflictError } from '../lib/errors';
import { 
  UpdateDiaInput, 
  RegistrarPernoctaInput,
  RegistrarConexionInput,
  RegistrarDesconexionInput
} from '../validators/planillaValidation';
import { getDaysInMonth } from 'date-fns';

export const obtenerOCrearPlanilla = async (choferId: number, mes: number, anio: number) => {
  // 1. Validar que el Chofer Existe y pertenece al Area "Chofer"
  const chofer = await prisma.personal.findUnique({
    where: { id: choferId },
    include: { area: true }
  });

  if (!chofer) {
    throw new NotFoundError('Personal no encontrado');
  }
  
  // Asumimos que podemos validar por el nombre del área si contiene "Chofer".
  if (!chofer.area.nombre.toLowerCase().includes('chofer')) {
    throw new ConflictError('El personal no pertenece al área de Choferes');
  }

  // 2. Buscar planilla existente
  let planilla = await prisma.planillaMensual.findUnique({
    where: {
      choferId_mes_anio: { choferId, mes, anio }
    },
    include: {
      dias: {
        include: {
          pernocta: true,
          conexiones: true,
          desconexiones: true
        },
        orderBy: { fecha: 'asc' }
      }
    }
  });

  // 3. Crear si no existe
  if (!planilla) {
    const jsDate = new Date(anio, mes - 1); // mes es 1-12 en UI, Date usa 0-11
    const diasDelMes = getDaysInMonth(jsDate);

    const diasData = Array.from({ length: diasDelMes }, (_, i) => ({
      fecha: new Date(anio, mes - 1, i + 1), // Hora a medianoche en timezone local
      estado: 'TRABAJO' as const
    }));

    planilla = await prisma.planillaMensual.create({
      data: {
        choferId,
        mes,
        anio,
        dias: {
          create: diasData
        }
      },
      include: {
        dias: {
          include: {
            pernocta: true,
            conexiones: true,
            desconexiones: true
          },
          orderBy: { fecha: 'asc' }
        }
      }
    });
  }

  return planilla;
};

export const actualizarDia = async (diaId: string, data: UpdateDiaInput) => {
  const dia = await prisma.diaPlanilla.findUnique({ where: { id: diaId } });
  if (!dia) throw new NotFoundError('Día no encontrado');

  return await prisma.diaPlanilla.update({
    where: { id: diaId },
    data: {
      estado: data.estado,
      observacion: data.observacion
    },
    include: { pernocta: true, conexiones: true, desconexiones: true }
  });
};

export const registrarPernocta = async (diaId: string, data: RegistrarPernoctaInput) => {
  const dia = await prisma.diaPlanilla.findUnique({ 
    where: { id: diaId },
    include: { pernocta: true }
  });
  
  if (!dia) throw new NotFoundError('Día no encontrado');
  if (dia.pernocta) throw new ConflictError('Ya existe una pernocta registrada para este día');

  return await prisma.pernocta.create({
    data: {
      diaPlanillaId: diaId,
      ubicacion: data.ubicacion,
      patente: data.patente
    }
  });
};

export const registrarConexion = async (diaId: string, data: RegistrarConexionInput) => {
  const dia = await prisma.diaPlanilla.findUnique({ where: { id: diaId } });
  if (!dia) throw new NotFoundError('Día no encontrado');

  return await prisma.conexion.create({
    data: { diaPlanillaId: diaId, patente: data.patente }
  });
};

export const registrarDesconexion = async (diaId: string, data: RegistrarDesconexionInput) => {
  const dia = await prisma.diaPlanilla.findUnique({ where: { id: diaId } });
  if (!dia) throw new NotFoundError('Día no encontrado');

  return await prisma.desconexion.create({
    data: { diaPlanillaId: diaId, patente: data.patente }
  });
};
