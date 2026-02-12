import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import * as userService from '../services/userService';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const REALM = process.env.KEYCLOAK_REALM || 'SoftwareArceo';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'sgo-frontend';
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || 'my-secret-key-123';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const data = qs.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'password',
            username: email,
            password: password,
            scope: 'openid'
        });

        const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

        const response = await axios.post(tokenUrl, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data;

        // Configuración de seguridad de cookies para SupraSense
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expires_in * 1000
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: (refresh_expires_in || 3600) * 1000
        });

        // Decodificación segura del JWT para la sesión
        let user = { email };
        try {
            const parts = access_token.split('.');
            if (parts.length === 3) {
                const payload = Buffer.from(parts[1], 'base64').toString();
                const decoded = JSON.parse(payload);
                user = { ...decoded };
            }
        } catch (e) {
            console.error('Error decoding token for user info:', e);
        }

        res.json({ success: true, user });

    } catch (error: any) {
        if (error.response) {
            console.error('Keycloak Login Error Details:', error.response.data);
        } else {
            console.error('Login Connectivity Error:', error.message);
        }
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ success: true, message: 'Logout successful' });
};

export const me = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ authenticated: false });

        // Decode token to get basic info
        const parts = token.split('.');
        if (parts.length !== 3) return res.status(401).json({ authenticated: false });

        const payload = Buffer.from(parts[1], 'base64').toString();
        const decoded = JSON.parse(payload);

        const { sub, email, given_name, family_name, realm_access } = decoded;
        const role = realm_access?.roles?.find((r: string) => !['offline_access', 'uma_authorization', 'default-roles-softwarearceo'].includes(r)) || 'User';

        if (!sub) return res.status(401).json({ authenticated: false });

        // Check if user exists in local DB
        let user = await userService.getUserById(sub);

        if (!user) {
            // First time login sync
            user = await userService.createUser({
                id: sub,
                email: email || '',
                firstName: given_name || '',
                lastName: family_name || '',
                role: role
            });
        }

        // Return combined data (DB source of truth for profile fields)
        // Ensure role and email from token are respected if we want token to be auth source?
        // But requirements say "User can edit Name, Email". So we return DB values.

        return res.json({
            authenticated: true,
            user: {
                ...user,
                // Ensure we return the role if it was missing in DB or to ensure consistency?
                // User requirement: "El campo Rol debe ser de 'Solo lectura' (definido por el sistema)."
                // Usually system roles come from Keycloak.
                role: role // Always use Keycloak role for security/logic? Or DB? 
                // "Solo lectura (definido por el sistema)" usually means Keycloak roles.
                // Let's use the one from Token as it is the "System" truth for permissions.
            }
        });

    } catch (error) {
        console.error('Error in /me:', error);
        return res.status(401).json({ authenticated: false });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id, firstName, lastName, email, dni, address } = req.body;

        // We get the ID from the authenticated session (req.auth via checkJwt or parse token)
        // But here we might not have req.auth fully populated if checkJwt isn't perfectly set up globally.
        // Let's use the same token parsing or req.auth.
        // checkJwt middleware puts payload in req.auth

        const sub = req.auth?.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        if (id && id !== sub) {
            return res.status(403).json({ message: 'Forbidden: Cannot edit other users' });
        }

        // Validations
        // Email format RFC 5322 (handled by simple regex for now or allow frontend to handle strictness, backend should protect)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // DNI Numeric 7-8 digits
        const dniRegex = /^\d{7,8}$/;
        if (!dniRegex.test(dni)) {
            return res.status(400).json({ message: 'DNI must be 7 or 8 digits allowed' });
        }

        // Name/Lastname alpha max 50
        if (firstName.length > 50 || lastName.length > 50) {
            return res.status(400).json({ message: 'Name/Lastname max 50 chars' });
        }

        // Address max 100
        if (address && address.length > 100) {
            return res.status(400).json({ message: 'Address max 100 chars' });
        }

        const updatedUser = await userService.updateUser(sub, {
            firstName,
            lastName,
            email,
            dni,
            address
        });

        return res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Error updating profile' });
    }
};
