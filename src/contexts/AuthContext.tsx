import React, { createContext } from 'react';
import { useAuth } from '../store/authSlice';
import { User } from '../types/User';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: { username: string; role: "admin" | "student"; password?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
