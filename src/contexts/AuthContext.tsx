// AuthContext.tsx
import { createContext, FC, ReactNode, useEffect } from 'react';
import { useUserStore } from '../store/states';
import { UserWithId } from '../types/User';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserWithId | null;
  login: (user: UserWithId) => void;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, login, logout, verifyToken } = useUserStore();

  useEffect(() => {
    const checkToken = async () => {
      const isValidToken = await verifyToken();
      if (!isValidToken) {
        logout();
      }
    };

    checkToken(); // Verifica el token al montar el componente
  }, [verifyToken, logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
