import { useEffect, lazy } from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from '@/store/states'; // Importar el store de Zustand
import { useCheckBackend } from "@/hooks/useCheckBackend";
import Spinner from "@/components/app/Spinner";
import ErrorPage from "./pages/ErrorPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Register from "@/pages/Register/Register";
import Sensor from "@/pages/Dashboard/Sensor";
import Users from "@/pages/Dashboard/Users";
import Team from "@/pages/Dashboard/Team";
import Perfil from "@/pages/Dashboard/Perfil";
import { AuthProvider } from "./contexts/AuthContext";

const Login = lazy(() => import("@/pages/Login/Login"));

// Ruta de Dashboard que verifica la autenticación
const DashboardRoutes = () => {
  const { isAuthenticated } = useUserStore(); // Usamos Zustand para verificar la autenticación

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <DashboardLayout />;
};

// Ruta raíz que verifica si hay un token en el store
const RootRoute = () => {
  const { token } = useUserStore(); // Verificar si el token existe

  // Si hay un token, redirigimos al dashboard
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // Si no hay token, redirigimos a la página de login
  return <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Team />
      },
      {
        path: 'team',
        element: <Team />
      },
      {
        path: 'users', 
        element: <Users />
      },
      {
        path: 'perfil',
        element: <Perfil />
      },
      {
        path: 'sensor',
        element: <Sensor />
      }
    ]
  },
  {
    path: '/',
    element: <RootRoute />, // Verificación de token en la ruta raíz
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

export default function App() {
  const { backendReady, loading } = useCheckBackend();
  const { verifyToken } = useUserStore(); // Verificar el token al cargar

  useEffect(() => {
    verifyToken(); // Verifica si el token es válido al cargar la aplicación
  }, [verifyToken]);

  if (loading) {
    return <Spinner />;
  }

  if (!backendReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">
          El backend no está disponible, por favor intenta más tarde.
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
