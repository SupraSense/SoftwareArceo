import { z } from 'zod';

export const createEquipoSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre del equipo es obligatorio')
        .max(200, 'El nombre no puede superar los 200 caracteres'),
});

export type CreateEquipoInput = z.infer<typeof createEquipoSchema>;
