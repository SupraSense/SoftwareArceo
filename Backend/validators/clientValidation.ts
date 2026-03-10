import { z } from 'zod';

export const createClientSchema = z.object({
    razonSocial: z
        .string()
        .min(1, 'La razón social es obligatoria'),
    cuit: z
        .string()
        .regex(/^\d{2}-\d{8}-\d{1}$/, 'Formato de CUIT inválido. Se espera XX-XXXXXXXX-X'),
    address: z
        .string()
        .optional(),
    contactName: z
        .string()
        .optional(),
    phone: z
        .string()
        .optional(),
    email: z
        .string()
        .email('Formato de email inválido')
        .optional()
        .or(z.literal('')),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
