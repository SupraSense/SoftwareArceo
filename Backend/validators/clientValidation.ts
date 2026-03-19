import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().default(''),
    phone: z.string()
        .regex(/^\+?\d{4,20}$/, 'Teléfono inválido (opcionalmente +, seguido de 4 a 20 dígitos)')
        .or(z.literal(''))
        .default(''),
    email: z.string()
        .email('Formato de email inválido')
        .or(z.literal(''))
        .default(''),
    isPrincipal: z.boolean().default(false),
});

export const createClientSchema = z.object({
    razonSocial: z
        .string()
        .min(1, 'La razón social es obligatoria')
        .max(100, 'La razón social no puede superar los 100 caracteres'),
    cuit: z
        .string()
        .regex(/^[\d-]{4,20}$/, 'CUIT inválido (solo números y guiones, de 4 a 20 caracteres)'),
    address: z
        .string()
        .default(''),
    contacts: z.array(contactSchema)
        .min(1, 'Debe tener al menos un contacto'),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
