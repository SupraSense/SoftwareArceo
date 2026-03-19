import { z } from 'zod';

export const createSegmentoSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre del segmento es obligatorio')
        .max(200, 'El nombre no puede superar los 200 caracteres'),
});

export type CreateSegmentoInput = z.infer<typeof createSegmentoSchema>;
