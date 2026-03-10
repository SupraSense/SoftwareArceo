import crypto from 'crypto';

/**
 * Generates a cryptographically secure temporary password.
 * Includes uppercase, lowercase, digits, and special characters.
 */
export const generateTemporaryPassword = (length: number = 12): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%&*';
    const allChars = uppercase + lowercase + digits + special;

    // Ensure at least one of each category
    const mandatoryChars = [
        uppercase[crypto.randomInt(uppercase.length)],
        lowercase[crypto.randomInt(lowercase.length)],
        digits[crypto.randomInt(digits.length)],
        special[crypto.randomInt(special.length)],
    ];

    const remainingLength = length - mandatoryChars.length;
    const remainingChars: string[] = [];

    for (let i = 0; i < remainingLength; i++) {
        remainingChars.push(allChars[crypto.randomInt(allChars.length)]);
    }

    // Shuffle all characters together
    const combined = [...mandatoryChars, ...remainingChars];
    for (let i = combined.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined.join('');
};
