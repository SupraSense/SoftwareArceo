import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/auth/Login';
import { Home } from './pages/dashboard/Home';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Layout para rutas protegidas (Placeholder para Auth Check real)
const AuthLayout = () => {
  // Aquí iría la lógica de verificación de sesión (Keycloak token check)
  // Por ahora hardcoded a true para que se pueda ver, o mejor, simplemente permitir el paso
  // Si en el futuro integramos Keycloak, esto validará el token.
  // IMPORTANTE: Para la demo, asumimos que si entras a /dashboard estás "logueado" o el login te redirige.
  // Pero AuthLayout debería proteger.
  // Simulación de autenticación
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<AuthLayout />}>
          <Route path="/app" element={<Home />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
