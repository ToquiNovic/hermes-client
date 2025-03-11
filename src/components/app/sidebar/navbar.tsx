// @/components/app/sidebar/navbar.tsx
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { UserNav } from "./user-nav";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { User  } from "@supabase/supabase-js";

interface NavbarProps {
  title?: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, icon }) => {
  const [userSupabase, setUserSupabase] = useState<User | null>(null);
  const location = useLocation();
  const isOnLoginPage = location.pathname === "/login";
  const isOnRegisterPage = location.pathname === "/register";
  const isOnHomePage = location.pathname === "/";

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUserSupabase(data.user);
      }
    };
    fetchUser();
  }, []);

  const showDashboardButton =
    userSupabase && (isOnHomePage || isOnLoginPage || isOnRegisterPage);

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center justify-between">
        {/* Menú lateral en móviles */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-bold">Menú</h2>
              {isOnRegisterPage && (
                <Link to="/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
              )}
              {isOnLoginPage && (
                <Link to="/register">
                  <Button>Registrarse</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo y título */}
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h1 className="font-bold text-lg">{title}</h1>
        </div>

        {/* Acciones */}
        <div className="hidden lg:flex items-center gap-4">
          {isOnRegisterPage && (
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          )}
          {isOnLoginPage && (
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          )}

          {/* Mostrar botón de Dashboard si el usuario está autenticado y en '/' '/login' '/register' */}
          {showDashboardButton && (
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}

          <ModeToggle />

          {/* Mostrar UserNav si el usuario está autenticado */}
          {userSupabase && <UserNav />}
        </div>
      </div>
    </header>
  );
};
