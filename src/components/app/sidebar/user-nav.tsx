import { Link } from "react-router-dom";
import { LayoutGrid, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useUser as useUserDataBase } from "@/hooks";
import supabase from "@/lib/supabaseClient";
import { logout } from "@/services";
import { useDispatch } from "react-redux";

export function UserNav() {
  const [userSupabase, setUserSupabase] = useState<SupabaseUser | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUserSupabase(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const success = await logout(dispatch);
    if (success) {
      window.location.href = "/login";
    }
  };

  const { userData, loading, error } = useUserDataBase(userSupabase?.id || "");

  if (!userSupabase) return null;
  if (loading)
    return <UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />;
  if (error) return <div>Error: {error}</div>;

  const currentAvatarUrl =
    userData?.imageUrl || userSupabase?.user_metadata?.avatar_url || "";

  return (
    <DropdownMenu>
      {userSupabase && (
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentAvatarUrl} alt="Avatar" />
                  <AvatarFallback className="bg-transparent" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      )}

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userSupabase?.user_metadata?.full_name || ""}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || userSupabase?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center">
              <UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />
              Cuenta
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
