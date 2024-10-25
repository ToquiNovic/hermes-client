import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { UserWithId } from '@/models';

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
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserWithId, token: string) => void;
  createUser: (user: UserWithId) => void;
  modifyUser: (partialUser: Partial<UserWithId>) => void;
  resetUser: () => void;
  logout: () => void;
  verifyToken: () => boolean;
}

// Definir el tipo de lo que estamos guardando en localStorage
type PersistedValue = StorageValue<UserStore> | null;

// Wrapper para adaptarse al sistema de persistencia que espera zustand
const localStorageWrapper = {
  getItem: (name: string): PersistedValue => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: PersistedValue) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

// Crear la tienda Zustand con persistencia
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: userEmptyState,
      token: null,
      isAuthenticated: false,
      login: (newUser, token) => {
        set({ user: newUser, token: token, isAuthenticated: true });
      },
      createUser: (newUser) => set({ user: newUser }), 
      modifyUser: (partialUser) =>
        set((state) => ({ user: { ...state.user, ...partialUser } })),
      resetUser: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),
      logout: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),

      verifyToken: () => {
        const { token, logout } = get();
        if (token) {
          set({ isAuthenticated: true });
          return true;
        } else { 
          logout();
          return false;
        }
      },
    }),
    {
      name: 'user-storage',
      storage: localStorageWrapper,
    }
  )
);
