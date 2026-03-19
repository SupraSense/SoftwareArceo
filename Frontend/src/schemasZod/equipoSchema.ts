import { z } from 'zod';

export const equipoSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre del equipo es obligatorio')
        .max(200, 'El nombre no puede superar los 200 caracteres'),
});

export type EquipoFormData = z.infer<typeof equipoSchema>;
