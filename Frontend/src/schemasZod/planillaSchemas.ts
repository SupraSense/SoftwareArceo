import { z } from 'zod';


export const updateDiaSchemaZod = z.object({
  estado: z.enum(['TRABAJO', 'FRANCO', 'VACACIONES'], {
    message: 'El estado debe ser TRABAJO, FRANCO o VACACIONES'
  }),
  observacion: z.string().max(300, 'La observación no puede superar los 300 caracteres').optional().nullable(),
});

export const registrarPernoctaSchemaZod = z.object({
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export const registrarConexionSchemaZod = z.object({
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export const registrarDesconexionSchemaZod = z.object({
  patente: z.string().min(1, 'La patente es obligatoria'),
});

export type UpdateDiaFormValues = z.infer<typeof updateDiaSchemaZod>;
export type RegistrarPernoctaFormValues = z.infer<typeof registrarPernoctaSchemaZod>;
export type RegistrarConexionFormValues = z.infer<typeof registrarConexionSchemaZod>;
export type RegistrarDesconexionFormValues = z.infer<typeof registrarDesconexionSchemaZod>;
