// components/AdminGuard.tsx
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components";

export const AdminGuard = () => {
  const user = useSelector((state: RootState) => state);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const isLoggedIn = !!user;
  
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};