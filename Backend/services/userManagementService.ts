import prisma from '../lib/prisma';
import { ValidationError, NotFoundError } from '../lib/errors';
import type { IIdentityProvider } from '../interfaces/IIdentityProvider';
import type { IEmailService } from '../interfaces/IEmailService';
import type { CreateUserInput, UpdateUserInput } from '../validators/userValidation';
import { generateTemporaryPassword } from '../utils/passwordUtils';
import { generateInvitationToken, buildInvitationLink } from '../utils/tokenUtils';

/**
 * UserManagementService — Orchestrates user lifecycle operations.
 *
 * Follows Dependency Inversion Principle (DIP): depends on abstractions
 * (IIdentityProvider, IEmailService), not concrete implementations.
 *
 * Single Responsibility: only handles admin user management logic.
 * The existing userService.ts remains responsible for auth/profile sync.
 */
export class UserManagementService {
    constructor(
        private readonly identityProvider: IIdentityProvider,
        private readonly emailService: IEmailService
    ) { }

    // ─── QUERIES ─────────────────────────────────────────────

    async getAllUsers() {
        return prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                dni: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                dni: true,
                address: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    // ─── VALIDATIONS ─────────────────────────────────────────

    async checkEmailAvailability(email: string, excludeId?: string) {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (!existing) {
            return { available: true, message: 'Email disponible' };
        }

        if (excludeId && existing.id === excludeId) {
            return { available: true, message: 'Email disponible' };
        }

        return { available: false, message: 'Este email ya está registrado en el sistema' };
    }

    async checkDniAvailability(dni: string, excludeId?: string) {
        const existing = await prisma.user.findUnique({ where: { dni } });

        if (!existing) {
            return { available: true, message: 'DNI disponible' };
        }

        if (excludeId && existing.id === excludeId) {
            return { available: true, message: 'DNI disponible' };
        }

        return { available: false, message: 'Este DNI ya está registrado en el sistema' };
    }

    // ─── MUTATIONS ───────────────────────────────────────────

    async createUser(data: CreateUserInput) {
        // 1. Check uniqueness in local DB
        const emailCheck = await this.checkEmailAvailability(data.email);
        if (!emailCheck.available) {
            throw new ValidationError(emailCheck.message);
        }

        const dniCheck = await this.checkDniAvailability(data.dni);
        if (!dniCheck.available) {
            throw new ValidationError(dniCheck.message);
        }

        // 2. Generate temporary password and invitation token
        const temporaryPassword = generateTemporaryPassword();
        const invitationToken = generateInvitationToken();
        const invitationLink = buildInvitationLink(invitationToken);

        // 3. Create user in Identity Provider (Keycloak)
        let idpUserId: string;
        try {
            idpUserId = await this.identityProvider.createUser({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                temporaryPassword,
            });
        } catch (error) {
            console.error('[UserManagementService] Error creating user in IdP:', error);
            throw new Error('Error al crear el usuario en el proveedor de identidad');
        }

        // 4. Create user in local DB
        const user = await prisma.user.create({
            data: {
                id: idpUserId, // Use the IdP user ID as local ID for consistency
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                dni: data.dni,
                role: data.role,
                status: 'PENDIENTE',
                invitationToken,
            },
        });

        // 5. Send invitation email (stub for now)
        try {
            await this.emailService.sendInvitationEmail({
                to: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                temporaryPassword,
                invitationLink,
            });
        } catch (error) {
            console.error('[UserManagementService] Error sending invitation email:', error);
            // Don't throw — user is created, email can be resent
        }

        return user;
    }

    async updateUser(id: string, data: UpdateUserInput) {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        // If role changed, update in IdP
        if (data.role && data.role !== existing.role) {
            try {
                await this.identityProvider.updateUserRole(id, data.role, existing.role || undefined);
            } catch (error) {
                console.error('[UserManagementService] Error updating role in IdP:', error);
                throw new Error('Error al actualizar el rol en el proveedor de identidad');
            }
        }

        return prisma.user.update({
            where: { id },
            data: {
                ...(data.firstName !== undefined && { firstName: data.firstName }),
                ...(data.lastName !== undefined && { lastName: data.lastName }),
                ...(data.dni !== undefined && { dni: data.dni }),
                ...(data.email !== undefined && { email: data.email }),
                ...(data.role !== undefined && { role: data.role }),
                ...(data.status !== undefined && { status: data.status }),
            },
        });
    }

    async deactivateUser(id: string) {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        // Disable in IdP
        try {
            await this.identityProvider.disableUser(id);
        } catch (error) {
            console.error('[UserManagementService] Error disabling user in IdP:', error);
            throw new Error('Error al deshabilitar el usuario en el proveedor de identidad');
        }

        return prisma.user.update({
            where: { id },
            data: { status: 'INACTIVO' },
        });
    }

    async activateUser(id: string) {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        // Enable in IdP
        try {
            await this.identityProvider.enableUser(id);
        } catch (error) {
            console.error('[UserManagementService] Error enabling user in IdP:', error);
            throw new Error('Error al habilitar el usuario en el proveedor de identidad');
        }

        return prisma.user.update({
            where: { id },
            data: { status: 'ACTIVO' },
        });
    }

    async resendInvitation(id: string) {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        if (existing.status !== 'PENDIENTE') {
            throw new ValidationError('Solo se puede reenviar la invitación a usuarios con estado PENDIENTE');
        }

        // Generate new token and password
        const temporaryPassword = generateTemporaryPassword();
        const invitationToken = generateInvitationToken();
        const invitationLink = buildInvitationLink(invitationToken);

        // Update invitation token in DB
        await prisma.user.update({
            where: { id },
            data: { invitationToken },
        });

        // Send email
        await this.emailService.sendInvitationEmail({
            to: existing.email,
            firstName: existing.firstName || '',
            lastName: existing.lastName || '',
            temporaryPassword,
            invitationLink,
        });
    }

    async processForgotPassword(email: string) {
        const token = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        try {
            await prisma.user.update({
                where: { email },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: expiresAt,
                },
            });

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const resetLink = `${frontendUrl}/reset-password?token=${token}`;

            await this.emailService.sendPasswordResetEmail({
                to: email,
                resetLink,
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                // Email not found logic is ignored for security
                return;
            }
            throw error;
        }
    }

    async processResetPassword(data: import('../validators/authValidation').ResetPasswordInput) {
        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: data.token },
        });

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new ValidationError('El token ha caducado o es inválido');
        }

        // Update password in IDP
        await this.identityProvider.resetUserPassword(user.id, data.newPassword);

        // Clear tokens
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
    }
}

