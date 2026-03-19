/**
 * IEmailService — Abstraction for the Email Sender.
 * Follows Interface Segregation Principle (ISP).
 * Implementation to be chosen later (SendGrid, SES, SMTP, etc.)
 */

export interface SendInvitationEmailDTO {
    to: string;
    firstName: string;
    lastName: string;
    temporaryPassword: string;
    invitationLink: string;
}

export interface SendPasswordResetEmailDTO {
    to: string;
    resetLink: string;
}

export interface IEmailService {
    /** Sends an invitation email with temporary credentials */
    sendInvitationEmail(data: SendInvitationEmailDTO): Promise<void>;
    
    /** Sends a password reset email */
    sendPasswordResetEmail(data: SendPasswordResetEmailDTO): Promise<void>;
}
