import { Request, Response } from 'express';
import { UserManagementService } from '../services/userManagementService';
import { ValidationError, NotFoundError } from '../lib/errors';
import { createUserSchema, updateUserSchema } from '../validators/userValidation';
import { KeycloakIdentityProvider } from '../providers/KeycloakIdentityProvider';
import { ConsoleEmailService } from '../providers/ConsoleEmailService';

/**
 * Composition Root: Wire dependencies here.
 * When you want to swap Keycloak or the email sender, only change these lines.
 */
const identityProvider = new KeycloakIdentityProvider();
const emailService = new ConsoleEmailService();
const userService = new UserManagementService(identityProvider, emailService);

// ─── HANDLERS ────────────────────────────────────────────

export const getAll = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('[UserManagementController] Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(user);
    } catch (error) {
        console.error('[UserManagementController] Error al obtener usuario:', error);
        return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({
            message: firstIssue?.message || 'Datos de entrada inválidos',
        });
    }

    try {
        const user = await userService.createUser(parseResult.data);
        return res.status(201).json(user);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[UserManagementController] Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const update = async (req: Request, res: Response) => {
    const parseResult = updateUserSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({
            message: firstIssue?.message || 'Datos de entrada inválidos',
        });
    }

    try {
        const user = await userService.updateUser(req.params.id, parseResult.data);
        return res.json(user);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('[UserManagementController] Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const deactivate = async (req: Request, res: Response) => {
    try {
        await userService.deactivateUser(req.params.id);
        return res.json({ message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[UserManagementController] Error al dar de baja usuario:', error);
        return res.status(500).json({ message: 'Error al dar de baja al usuario' });
    }
};

export const activate = async (req: Request, res: Response) => {
    try {
        await userService.activateUser(req.params.id);
        return res.json({ message: 'Usuario reactivado correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error('[UserManagementController] Error al reactivar usuario:', error);
        return res.status(500).json({ message: 'Error al reactivar el usuario' });
    }
};

export const checkEmail = async (req: Request, res: Response) => {
    const { email, excludeId } = req.query;
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'El parámetro "email" es requerido' });
    }

    try {
        const result = await userService.checkEmailAvailability(
            email,
            typeof excludeId === 'string' ? excludeId : undefined
        );
        return res.json(result);
    } catch (error) {
        console.error('[UserManagementController] Error al verificar email:', error);
        return res.status(500).json({ message: 'Error al verificar el email' });
    }
};

export const checkDni = async (req: Request, res: Response) => {
    const { dni, excludeId } = req.query;
    if (!dni || typeof dni !== 'string') {
        return res.status(400).json({ message: 'El parámetro "dni" es requerido' });
    }

    try {
        const result = await userService.checkDniAvailability(
            dni,
            typeof excludeId === 'string' ? excludeId : undefined
        );
        return res.json(result);
    } catch (error) {
        console.error('[UserManagementController] Error al verificar DNI:', error);
        return res.status(500).json({ message: 'Error al verificar el DNI' });
    }
};

export const resendInvitation = async (req: Request, res: Response) => {
    try {
        await userService.resendInvitation(req.params.id);
        return res.json({ message: 'Invitación reenviada correctamente' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('[UserManagementController] Error al reenviar invitación:', error);
        return res.status(500).json({ message: 'Error al reenviar la invitación' });
    }
};
