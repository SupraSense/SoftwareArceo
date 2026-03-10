import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Landing } from './pages/publicPage/Landing';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Home } from './pages/features/Home';
import { TipoTareaPage } from './pages/configuration/TipoTareaPage';
import { Clients } from './pages/features/clients/ClientsPage';
import { ClientDetailPage } from './pages/features/clients/ClientsDetailPage';
import { Profile } from './pages/features/perfil/Profile';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { InProgress } from './pages/inProgress/InProgress';
import { Staff } from './pages/features/personal/PersonalPage';
import { StaffDetail } from './pages/features/personal/PersonalDetailPage';
import { UsersPage } from './pages/configuration/users/UsersPage';



function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/configuration/type-task" element={<TipoTareaPage />} />
            <Route path="/app/configuration/pozos" element={<InProgress />} />
            <Route path="/app/configuration/segmentos" element={<InProgress />} />
            <Route path="/app/configuration/usuarios" element={<UsersPage />} />
            <Route path="/app/clients" element={<Clients />} />
            <Route path="/app/clients/:id" element={<ClientDetailPage />} />
            <Route path="/app/profile" element={<Profile />} />

            {/* Rutas en Implementación */}
            <Route path="/app/orders" element={<InProgress />} />
            <Route path="/app/remitos" element={<InProgress />} />
            <Route path="/app/agenda" element={<InProgress />} />
            <Route path="/app/resources" element={<InProgress />} />
            <Route path="/app/resources" element={<InProgress />} />
            <Route path="/app/staff" element={<Staff />} />
            <Route path="/app/staff/:id" element={<StaffDetail />} />
            <Route path="/app/drivers" element={<InProgress />} />
            <Route path="/app/drivers" element={<InProgress />} />
            <Route path="/app/workshops" element={<InProgress />} />
            <Route path="/app/billing" element={<InProgress />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
