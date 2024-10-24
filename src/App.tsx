import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import Register from "@/pages/Register/Register";
import Sensor from "@/pages/Dashboard/Sensor";
import Users from "@/pages/Dashboard/Users";
import Team from "@/pages/Dashboard/Team";
import Perfil from "@/pages/Dashboard/Perfil";
import Spinner from "@/components/app/Spinner";
import { useCheckBackend } from "@/hooks/useCheckBackend";
import ErrorPage from "./pages/ErrorPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './contexts/useAuthContext';

const Login = lazy(() => import("@/pages/Login/Login"));

const DashboardRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <DashboardLayout />;
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
    element: <Navigate to="/login" />
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
