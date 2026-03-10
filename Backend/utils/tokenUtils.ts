import crypto from 'crypto';

/**
 * Generates a unique invitation token (UUID v4) for first-time login links.
 */
export const generateInvitationToken = (): string => {
    return crypto.randomUUID();
};

/**
 * Builds the invitation link URL for the user's first login.
 */
export const buildInvitationLink = (token: string): string => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${baseUrl}/activate-account?token=${token}`;
};
