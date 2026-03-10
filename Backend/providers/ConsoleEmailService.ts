import type { IEmailService, SendInvitationEmailDTO } from '../interfaces/IEmailService';

/**
 * ConsoleEmailService — Stub implementation of IEmailService.
 *
 * Logs invitation details to console instead of sending real emails.
 * Replace with SendGrid, SES, SMTP, etc. when ready.
 *
 * Follows Liskov Substitution: any IEmailService implementation can replace this
 * without changing the consuming code.
 */
export class ConsoleEmailService implements IEmailService {
    async sendInvitationEmail(data: SendInvitationEmailDTO): Promise<void> {
        console.log('═══════════════════════════════════════════════════════');
        console.log('  📧 INVITATION EMAIL (STUB - NOT ACTUALLY SENT)');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`  To:       ${data.to}`);
        console.log(`  Name:     ${data.firstName} ${data.lastName}`);
        console.log(`  Password: ${data.temporaryPassword}`);
        console.log(`  Link:     ${data.invitationLink}`);
        console.log('═══════════════════════════════════════════════════════');
    }
}
