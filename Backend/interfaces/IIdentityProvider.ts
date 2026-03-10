/**
 * IIdentityProvider — Abstraction for the Identity Provider (Keycloak today, any other tomorrow).
 * Follows Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP).
 */

export interface CreateIdentityUserDTO {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    temporaryPassword: string;
}

export interface IIdentityProvider {
    /** Creates a user in the IdP and returns the IdP user ID */
    createUser(data: CreateIdentityUserDTO): Promise<string>;

    /** Deletes a user from the IdP */
    deleteUser(idpUserId: string): Promise<void>;

    /** Updates the role/group of a user in the IdP */
    updateUserRole(idpUserId: string, newRole: string, oldRole?: string): Promise<void>;

    /** Disables user login in the IdP */
    disableUser(idpUserId: string): Promise<void>;

    /** Enables user login in the IdP */
    enableUser(idpUserId: string): Promise<void>;
}
