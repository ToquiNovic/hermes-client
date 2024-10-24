import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext, lazy } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/sonner"
import Register from '@/pages/Register/Register';
import Dashboard from './pages/Dashboard';
import Sensor from './pages/Sensor';
import Users from './pages/Users';
import Team from './pages/Team';
import Perfil from './pages/Perfil';

const Login = lazy(() => import("@/pages/Login/Login"));

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  return authContext.isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} >
          <Route path="sensor" element={<Sensor />} />
          <Route path="users" element={<Users />} />
          <Route path="team" element={<Team />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
