import { z } from 'zod';
import { EstadoDia } from '@prisma/client';

export const getPlanillaSchema = z.object({
  choferId: z.coerce.number().positive('El id del chofer es requerido y debe ser positivo'),
  mes: z.coerce.number().min(1).max(12, 'El mes debe estar entre 1 y 12'),
  anio: z.coerce.number().min(2000).max(2100, 'Año inválido'),
});

export const updateDiaSchema = z.object({
  estado: z.nativeEnum(EstadoDia, {
    message: 'El estado debe ser TRABAJO, FRANCO o VACACIONES'
  }),
  observacion: z.string().max(300, 'La observación no puede superar los 300 caracteres').optional().nullable(),
});

export const registrarPernoctaSchema = z.object({
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export const registrarConexionSchema = z.object({
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export const registrarDesconexionSchema = z.object({
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export type GetPlanillaQuery = z.infer<typeof getPlanillaSchema>;
export type UpdateDiaInput = z.infer<typeof updateDiaSchema>;
export type RegistrarPernoctaInput = z.infer<typeof registrarPernoctaSchema>;
export type RegistrarConexionInput = z.infer<typeof registrarConexionSchema>;
export type RegistrarDesconexionInput = z.infer<typeof registrarDesconexionSchema>;
