import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserWithId } from "@/models";

// Estado inicial del usuario
const userEmptyState: UserWithId = {
  _id: "",
  username: "",
  role: "student",  // Valor predeterminado
  team: "",
  isLeader: false,
  refreshToken: "", // Aquí almacenaremos el token de acceso
};

// Interfaz de la tienda de usuario
interface UserStore {
  user: UserWithId;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserWithId, token: string) => void;
  createUser: (user: UserWithId) => void;
  modifyUser: (partialUser: Partial<UserWithId>) => void;
  resetUser: () => void;
  logout: () => void;
  verifyToken: () => Promise<boolean>; // Verificación del token
}

// Crear la tienda Zustand
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: userEmptyState,
      token: null, // Para almacenar el token
      isAuthenticated: false,
      // Función para manejar login
      login: (newUser, token) => {
        set({ user: newUser, token: token, isAuthenticated: true });
      },
      createUser: (newUser) => set({ user: newUser }), 
      modifyUser: (partialUser) =>
        set((state) => ({ user: { ...state.user, ...partialUser } })),
      resetUser: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),
      logout: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),

      // Verificación del refreshToken
      verifyToken: async () => {
        const { token, logout } = get();

        if (!token) {
          logout(); // Si no hay token, cierra sesión
          return false;
        }

        try {
          // Verificación del token (puedes ajustarlo según tu API)
          const response = await fetch('/api/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Envía el token para validación
            },
          });

          if (response.ok) {
            set({ isAuthenticated: true });
            return true;
          } else {
            logout(); // Si el token es inválido, cierra sesión
            return false;
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
          logout();
          return false;
        }
      },
    }),
    { name: 'user-storage' } // Configuración de persistencia
  )
);
