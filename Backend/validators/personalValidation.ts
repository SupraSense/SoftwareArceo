import { z } from 'zod';

export const createPersonalSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres'),
    apellido: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede superar los 50 caracteres'),
    email: z
        .string()
        .email('Formato de email inválido'),
    telefono: z
        .string()
        .optional()
        .or(z.literal('')),
    area: z
        .string()
        .min(1, 'El área es obligatoria'),
    fecha_ingreso: z
        .string()
        .min(1, 'La fecha de ingreso es obligatoria'),
    estado: z
        .string()
        .optional(),
});

export const updatePersonalSchema = createPersonalSchema.partial();

export type CreatePersonalInput = z.infer<typeof createPersonalSchema>;
export type UpdatePersonalInput = z.infer<typeof updatePersonalSchema>;
