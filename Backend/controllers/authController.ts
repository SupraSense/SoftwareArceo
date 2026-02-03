import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';

const KEYCLOAK_URL = 'http://suprasense-keycloak:8080';
const REALM = 'SoftwareArceo';
const CLIENT_ID = 'sgo-frontend';
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || '';

export const login = async (req: Request, res: Response) => {
    try {
        // Frontend sends 'email' but Keycloak expects 'username' (which can be email)
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

        // Set HttpOnly Cookies
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

        // Decode token to get user info without external library
        // The access_token is a JWT
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
            console.error('Keycloak Login Error:', error.response.data);
            // Log full error details for debugging if needed
            // console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Login Error:', error.message);
        }
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ success: true, message: 'Logout successful' });
};

export const me = (req: Request, res: Response) => {
    // If middleware (e.g. express-jwt) has validated the token, req.auth or req.user might be populated.
    // Alternatively, we can check the cookie manually here if the middleware is not yet in place for this route.
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = Buffer.from(parts[1], 'base64').toString();
            const decoded = JSON.parse(payload);
            return res.json({ authenticated: true, user: decoded });
        }
        return res.status(401).json({ authenticated: false });
    } catch (e) {
        return res.status(401).json({ authenticated: false });
    }
};
