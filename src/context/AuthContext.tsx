import { createContext, ReactNode, useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface SupabaseSignInResponse {
  user: User | null;
  session: Session | null;
}

interface SignInResponse {
  data: SupabaseSignInResponse | null;
  error: Error | null;
}

interface SignOutResponse {
  error: Error | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: () => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      // Asegúrate de que la respuesta de getSession tenga el tipo correcto
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else if (data?.session) {
        setUser(data.session.user); // Ajustado para acceder a la sesión y el usuario
        setSession(data.session);
      } else {
        setUser(null);
        setSession(null);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (): Promise<SignInResponse> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { skipBrowserRedirect: false },
    });
  
    if (data && data.user) {
      return { data: { user: data.user, session: data.session || null }, error: null };
    } else {
      return { data: null, error: error || new Error('No user data returned') };
    }
  };

  const signOut = async (): Promise<SignOutResponse> => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
