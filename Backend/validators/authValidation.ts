import { z } from 'zod';

export const forgotPasswordSchema = z.object({
    email: z.string().email('Por favor ingresa un correo electrónico válido')
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'El token es obligatorio'),
    newPassword: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'La contraseña debe tener al menos una letra y un número'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña')
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'La contraseña debe tener al menos una letra y un número'),
    confirmNewPassword: z.string().min(1, 'Confirma la nueva contraseña')
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword']
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
