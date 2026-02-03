import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from './authService';

export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await authService.checkAuth();
                setIsAuthenticated(true);
            } catch (error) {
                // If 401, the interceptor might handle it, or we catch it here.
                // Assuming interceptor redirects, this might not run if it does window.location
                // But for safety:
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        // Loading state
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
