import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Home } from './pages/dashboard/Home';
import { TipoTareaPage } from './pages/configuration/TipoTareaPage';
import { Clients } from './pages/dashboard/Clients';
import { DashboardLayout } from './components/layout/DashboardLayout';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/configuration/type-task" element={<TipoTareaPage />} />
            <Route path="/app/clients" element={<Clients />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
