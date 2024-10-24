// userSlice.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserWithId } from "@/models";

// Estado inicial del usuario
const userEmptyState: UserWithId = {
  _id: "",
  username: "",
  role: "student",
  team: "",
  isLeader: false,
  refreshToken: "",
};

// Interfaz de la tienda de usuario
interface UserStore {
  user: UserWithId;
  isAuthenticated: boolean;
  login: (user: UserWithId) => void;
  createUser: (user: UserWithId) => void;
  modifyUser: (partialUser: Partial<UserWithId>) => void;
  resetUser: () => void;
  logout: () => void; // Método para cerrar sesión
}

// Crear la tienda Zustand
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: userEmptyState,
      isAuthenticated: false,
      // Función para manejar login
      login: (newUser) => set({ user: newUser, isAuthenticated: true }), 
      createUser: (newUser) => set({ user: newUser }), 
      modifyUser: (partialUser) =>
        set((state) => ({ user: { ...state.user, ...partialUser } })),
      resetUser: () => set({ user: userEmptyState, isAuthenticated: false }),
      logout: () => set({ user: userEmptyState, isAuthenticated: false }),
    }),
    { name: 'user-storage' }
  )
);
