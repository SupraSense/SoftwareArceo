import { Resend } from 'resend';
import type { IEmailService, SendInvitationEmailDTO, SendPasswordResetEmailDTO } from '../interfaces/IEmailService';

export class ResendEmailProvider implements IEmailService {
    private resend: Resend;
    private fromEmail: string;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        this.resend = new Resend(apiKey);
        // Fallback to a verified domain email in Resend, usually onboarding@resend.dev for testing
        this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    }

    async sendInvitationEmail(data: SendInvitationEmailDTO): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: data.to,
                subject: 'Tu cuenta ha sido creada',
                html: `
                    <h1>Bienvenido, ${data.firstName} ${data.lastName}</h1>
                    <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales temporales:</p>
                    <p><strong>Contraseña temporal:</strong> ${data.temporaryPassword}</p>
                    <p>Puedes iniciar sesión usando el siguiente enlace:</p>
                    <a href="${data.invitationLink}">Iniciar sesión</a>
                `
            });
        } catch (error) {
            console.error('[ResendEmailProvider] Error sending invitation email:', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(data: SendPasswordResetEmailDTO): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: data.to,
                subject: 'Recuperación de contraseña',
                html: `
                    <h1>Recuperación de contraseña</h1>
                    <p>Se ha solicitado un restablecimiento de contraseña para tu cuenta. Si no fuiste tú, ignora este correo.</p>
                    <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                    <a href="${data.resetLink}">Restablecer contraseña</a>
                    <br />
                    <p>Este enlace expirará en 1 hora.</p>
                `
            });
        } catch (error) {
            console.error('[ResendEmailProvider] Error sending password reset email:', error);
            throw error;
        }
    }
}
