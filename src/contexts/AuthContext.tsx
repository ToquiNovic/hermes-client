import React, { createContext } from 'react';
import { useUserStore } from '../store/states';
import { UserWithId } from '../types/User';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserWithId | null;
  login: (userData: UserWithId) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, login, logout } = useUserStore(); 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Aquí exportamos AuthContext
export { AuthContext };
