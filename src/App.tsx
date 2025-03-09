import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { AdminPanelLayout, PublicLayout } from "./layouts";
import { AdminGuard } from "@/components/AdminGuard";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Dashboard,
  HomePage,
  ConfirmEmail,
  UsersPage,
  RolesPage,
  TeamsPage,
  AccountPage,
  SensorsPage,
  SensorsPanel,
} from "@/pages";
import { store, persistor } from "./redux/store";
import { Spinner } from "@/components";
import { useCheckBackend } from "@/hooks";
import CompleteProfile from "./pages/register/complete-profile";
import { AuthProvider, ProtectedRoute } from "@/context";

const Login = lazy(() => import("@/pages/login/loginPage"));
const Register = lazy(() => import("@/pages/register/registerPage"));

function AppWrapper() {
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

  return <App />;
}

function App() {
  return (
    <TooltipProvider>
      <PersistGate
        loading={<div>Loading persisted state...</div>}
        persistor={persistor}
      >
        <Toaster
          position="bottom-right"
          richColors
          expand={true}
          duration={3000}
          closeButton={true}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Rutas Públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
            </Route>

            {/* Rutas Protegidas para cualquier usuario autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminPanelLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/sensors" element={<SensorsPage />} />
                <Route path="/sensors-panel" element={<SensorsPanel />} />

                {/* Rutas Exclusivas para Administradores */}
                <Route element={<AdminGuard />}>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </PersistGate>
    </TooltipProvider>
  );
}

export default function MainApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <AppWrapper />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}
