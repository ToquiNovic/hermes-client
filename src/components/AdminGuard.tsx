// components/AdminGuard.tsx
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components";
import { getUserById } from "@/services";

export const AdminGuard = () => {
  const user = useSelector((state: RootState) => state.supabase?.user);
  const [role, setRole] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return; 

      try {
        const userData = await getUserById(user.id);
        setRole(userData?.role || null); 
      } catch (error) {
        console.error("Error obteniendo el rol:", error);
      }
    };

    fetchUser();
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user?.id]); 

  if (isLoading) {
    return <Spinner />;
  }

  const isAdmin = role === "ADMIN";

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};
