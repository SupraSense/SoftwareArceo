import { z } from 'zod';

export const createUserSchema = z.object({
    firstName: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede superar los 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras'),
    dni: z
        .string()
        .min(7, 'El DNI debe tener al menos 7 dígitos')
        .max(8, 'El DNI no puede superar los 8 dígitos')
        .regex(/^\d+$/, 'El DNI debe ser numérico'),
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('El formato del email es inválido'),
    role: z.enum(['ADMIN', 'OPERADOR', 'SUPERVISOR', 'CHOFER', 'TALLER'], {
    }),
});

export const updateUserSchema = createUserSchema.partial().extend({
    status: z.enum(['ACTIVO', 'INACTIVO', 'PENDIENTE']).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
