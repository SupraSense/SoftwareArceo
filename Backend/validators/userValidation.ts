import { z } from 'zod';

/**
 * Server-side Zod schemas for user management validation.
 * Mirrors frontend schemas for consistency.
 */

export const createUserSchema = z.object({
    firstName: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede superar los 50 caracteres'),
    dni: z
        .string()
        .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos numéricos'),
    email: z
        .string()
        .email('El formato del email es inválido'),
    role: z.enum(['ADMIN', 'OPERADOR', 'SUPERVISOR', 'CHOFER', 'TALLER'], {
        message: 'Rol inválido',
    }),
});

export const updateUserSchema = createUserSchema.partial().extend({
    status: z.enum(['ACTIVO', 'INACTIVO', 'PENDIENTE']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
