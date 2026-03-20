import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Landing } from './pages/publicPage/Landing';
import { Login } from './pages/auth/Login';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
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
import { UserCreatePage } from './pages/configuration/users/UserCreatePage';
import { UserDetailPage } from './pages/configuration/users/UserDetailPage';
import { PozosPage } from './pages/configuration/pozos/PozosPage';
import { PozoCreatePage } from './pages/configuration/pozos/PozoCreatePage';
import { EquiposPage } from './pages/configuration/equipos/EquiposPage';
import { EquipoCreatePage } from './pages/configuration/equipos/EquipoCreatePage';
import { SegmentosPage } from './pages/configuration/segmentos/SegmentosPage';
import { SegmentoCreatePage } from './pages/configuration/segmentos/SegmentoCreatePage';
import { PlanillasPage } from './pages/features/planillas/PlanillasPage';



function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/configuration/type-task" element={<TipoTareaPage />} />
            <Route path="/app/configuration/pozos" element={<PozosPage />} />
            <Route path="/app/configuration/pozos/new" element={<PozoCreatePage />} />
            <Route path="/app/configuration/segmentos" element={<SegmentosPage />} />
            <Route path="/app/configuration/segmentos/new" element={<SegmentoCreatePage />} />
            <Route path="/app/configuration/equipos" element={<EquiposPage />} />
            <Route path="/app/configuration/equipos/new" element={<EquipoCreatePage />} />
            <Route path="/app/configuration/usuarios" element={<UsersPage />} />
            <Route path="/app/configuration/usuarios/new" element={<UserCreatePage />} />
            <Route path="/app/configuration/usuarios/:id" element={<UserDetailPage />} />

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
            <Route path="/app/drivers" element={<PlanillasPage />} />
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
