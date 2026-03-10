import { z } from 'zod';

export const createTipoTareaSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'El nombre no puede superar los 100 caracteres'),
});

export const updateTipoTareaSchema = createTipoTareaSchema;

export type CreateTipoTareaInput = z.infer<typeof createTipoTareaSchema>;
