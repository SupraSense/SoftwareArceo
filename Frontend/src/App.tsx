import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Home } from './pages/dashboard/Home';
import { TipoTareaPage } from './pages/configuration/TipoTareaPage';
import { Clients } from './pages/dashboard/Clients';
import { Profile } from './pages/dashboard/Profile';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { InProgress } from './pages/misc/InProgress';



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
            <Route path="/app/profile" element={<Profile />} />

            {/* Rutas en Implementación */}
            <Route path="/app/orders" element={<InProgress />} />
            <Route path="/app/kanban" element={<InProgress />} />
            <Route path="/app/remitos" element={<InProgress />} />
            <Route path="/app/agenda" element={<InProgress />} />
            <Route path="/app/messages" element={<InProgress />} />
            <Route path="/app/reports" element={<InProgress />} />
            <Route path="/app/resources" element={<InProgress />} />
            <Route path="/app/staff" element={<InProgress />} />
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
