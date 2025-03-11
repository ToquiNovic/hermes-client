import supabase from "@/lib/supabaseClient";
import { AppDispatch } from "@/redux/store";
import { authSignOut } from "@/redux/states/supabaseSlice";

export const logout = async (dispatch: AppDispatch) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
    return false;
  }
  dispatch(authSignOut());
  return true;
};
