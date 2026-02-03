import { useKeycloak } from '@react-keycloak/web';
import { Outlet } from 'react-router-dom';

interface PrivateRouteProps {
    roles?: string[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps) => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div className="flex h-screen items-center justify-center">Cargando autenticación...</div>;
    }

    if (!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    const hasRole = roles ? roles.some((role) => keycloak.hasRealmRole(role)) : true;

    if (!hasRole) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
                <p>No tienes permisos para ver esta página.</p>
                <button
                    onClick={() => keycloak.logout()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return <Outlet />;
};

export default PrivateRoute;
