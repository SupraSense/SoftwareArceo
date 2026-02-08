import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config'; // Asegura la carga de variables

// Definimos las constantes basadas en el .env que ya tenés
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const REALM = process.env.KEYCLOAK_REALM || 'SoftwareArceo';

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
        jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`
    }) as GetVerificationKey,

    issuer: [
        `${KEYCLOAK_URL}/realms/${REALM}`,
        `http://localhost:8080/realms/${REALM}`,
        `http://suprasense-keycloak:8080/realms/${REALM}`
    ],
    algorithms: ['RS256'],
    getToken: (req: Request) => {
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        return null;
    }
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