import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            auth?: {
                realm_access?: {
                    roles: string[];
                };
                scope?: string;
                [key: string]: any;
            };
        }
    }
}

export const checkJwt = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'http://suprasense-keycloak:8080/realms/SoftwareArceo/protocol/openid-connect/certs'
    }) as GetVerificationKey,

    issuer: 'http://localhost:8080/realms/SoftwareArceo',
    algorithms: ['RS256']
});

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const roles = req.auth?.realm_access?.roles || [];

        if (roles.includes(role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
    };
};
