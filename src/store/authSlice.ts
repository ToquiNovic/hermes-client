import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/User';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: { username: string; role: 'admin' | 'student'; password?: string }) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => {
        set({ isAuthenticated: true, user: { ...userData, password: userData.password } });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'authStore' }
  )
);

export const useAuth = () => useAuthStore();