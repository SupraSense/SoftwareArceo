import { z } from 'zod';

export const clientSchema = z.object({
    razonSocial: z.string().min(1, 'La Razón Social es obligatoria'),
    cuit: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido (ej. 30-54668997-9)'),
    address: z.string().optional(),
    contactName: z.string().optional(),
    email: z.string().email('Email inválido').or(z.literal('')),
    phone: z.string().regex(/^[0-9]{9,15}$/, 'Teléfono inválido (9-15 dígitos)').or(z.literal(''))
});

export type ClientFormData = z.infer<typeof clientSchema>;