// @/context/AuthContext.tsx
import { createContext, ReactNode, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { authStart, authSuccess, authFailure, authSignOut } from "@/redux/states/supabaseSlice";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user, session, loading } = useSelector((state: RootState) => state.supabase);

  useEffect(() => {
    const fetchSession = async () => {
      dispatch(authStart());
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        dispatch(authFailure(error.message));
      } else {
        dispatch(authSuccess({ user: data.session?.user || null, session: data.session || null }));
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(authSuccess({ user: session.user, session }));
      } else {
        dispatch(authSignOut());
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  const signIn = async () => {
    dispatch(authStart());
    
    const {  error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { skipBrowserRedirect: false },
    });
  
    if (error) {
      dispatch(authFailure(error.message));
      return;
    }
  
    // Esperar a que el usuario se autentique y obtener la sesión actualizada
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
    if (sessionError) {
      dispatch(authFailure(sessionError.message));
    } else {
      dispatch(authSuccess({ user: sessionData.session?.user || null, session: sessionData.session || null }));
    }
  };


  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(authSignOut());
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
