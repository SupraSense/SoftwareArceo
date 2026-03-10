import axios from 'axios';
import type { IIdentityProvider, CreateIdentityUserDTO } from '../interfaces/IIdentityProvider';

/**
 * KeycloakIdentityProvider — Concrete implementation of IIdentityProvider
 * using Keycloak Admin REST API.
 *
 * Single Responsibility: Only handles communication with Keycloak.
 * Open/Closed: New IdP = new class implementing IIdentityProvider, no changes here.
 */
export class KeycloakIdentityProvider implements IIdentityProvider {
    private readonly baseUrl: string;
    private readonly realm: string;
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor() {
        this.baseUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
        this.realm = process.env.KEYCLOAK_REALM || 'SoftwareArceo';
        this.clientId = process.env.KEYCLOAK_CLIENT_ID || 'sgo-frontend';
        this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || 'my-secret-key-123';
    }

    /**
     * Obtains an admin access token via client credentials grant.
     */
    private async getAdminToken(): Promise<string> {
        const tokenUrl = `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;

        const response = await axios.post(tokenUrl, new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data.access_token;
    }

    /**
     * Helper to get admin API base URL for the realm.
     */
    private get adminApiUrl(): string {
        return `${this.baseUrl}/admin/realms/${this.realm}`;
    }

    async createUser(data: CreateIdentityUserDTO): Promise<string> {
        const token = await this.getAdminToken();

        // 1. Create user in Keycloak
        const createResponse = await axios.post(
            `${this.adminApiUrl}/users`,
            {
                username: data.email,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                enabled: true,
                emailVerified: true,
                credentials: [
                    {
                        type: 'password',
                        value: data.temporaryPassword,
                        temporary: true,
                    },
                ],
            },
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }
        );

        // 2. Extract the user ID from Location header
        const locationHeader = createResponse.headers['location'] || '';
        const keycloakUserId = locationHeader.split('/').pop() || '';

        if (!keycloakUserId) {
            throw new Error('Failed to extract Keycloak user ID from response');
        }

        // 3. Assign role if available
        if (data.role) {
            await this.assignRealmRole(keycloakUserId, data.role, token);
        }

        return keycloakUserId;
    }

    async deleteUser(idpUserId: string): Promise<void> {
        const token = await this.getAdminToken();
        await axios.delete(`${this.adminApiUrl}/users/${idpUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async updateUserRole(idpUserId: string, newRole: string, oldRole?: string): Promise<void> {
        const token = await this.getAdminToken();

        // Remove old role if provided
        if (oldRole) {
            try {
                const oldRoleObj = await this.getRealmRole(oldRole, token);
                if (oldRoleObj) {
                    await axios.delete(
                        `${this.adminApiUrl}/users/${idpUserId}/role-mappings/realm`,
                        {
                            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                            data: [oldRoleObj],
                        }
                    );
                }
            } catch (_err) {
                // Old role might not exist, continue
            }
        }

        // Assign new role
        await this.assignRealmRole(idpUserId, newRole, token);
    }

    async disableUser(idpUserId: string): Promise<void> {
        const token = await this.getAdminToken();
        await axios.put(
            `${this.adminApiUrl}/users/${idpUserId}`,
            { enabled: false },
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }
        );
    }

    async enableUser(idpUserId: string): Promise<void> {
        const token = await this.getAdminToken();
        await axios.put(
            `${this.adminApiUrl}/users/${idpUserId}`,
            { enabled: true },
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }
        );
    }

    /**
     * Gets a realm role object by name.
     */
    private async getRealmRole(roleName: string, token: string): Promise<{ id: string; name: string } | null> {
        try {
            const response = await axios.get(
                `${this.adminApiUrl}/roles/${roleName}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (_err) {
            return null;
        }
    }

    /**
     * Assigns a realm role to a user.
     */
    private async assignRealmRole(userId: string, roleName: string, token: string): Promise<void> {
        const role = await this.getRealmRole(roleName, token);
        if (!role) {
            console.warn(`[KeycloakIdentityProvider] Role "${roleName}" not found in Keycloak realm. Skipping assignment.`);
            return;
        }

        await axios.post(
            `${this.adminApiUrl}/users/${userId}/role-mappings/realm`,
            [role],
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }
        );
    }
}
