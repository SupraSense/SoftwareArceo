import { z } from 'zod';

export const pozoSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre del pozo es obligatorio')
        .max(200, 'El nombre no puede superar los 200 caracteres'),
    ubicacionUrl: z
        .string()
        .min(1, 'La URL de ubicación es obligatoria')
        .refine(
            (url) => /^https?:\/\/.+/i.test(url),
            'Debe ser una URL válida (http:// o https://)'
        )
        .refine(
            (url) => /maps/i.test(url),
            'La URL debe contener un enlace de Maps'
        ),
});

export type PozoFormData = z.infer<typeof pozoSchema>;
