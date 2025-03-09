// @/layouts/AdminLayout.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

export default function AdminGuard() {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Sesión obtenida:", session);

      setIsAuthenticated(!!session); 
    };

    // Listener para detectar cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        console.log("Cambio en sesión:", session);
        setIsAuthenticated(!!session);
      }
    );

    checkAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) return <div>Cargando...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/unauthorized" />;
}

