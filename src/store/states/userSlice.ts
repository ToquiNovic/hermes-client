import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { UserWithId } from '@/models';

const userEmptyState: UserWithId = {
  _id: "",
  username: "",
  role: "student",
  team: "",
  isLeader: false,
  refreshToken: "",
};

interface UserStore {
  user: UserWithId;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserWithId, token: string) => void;
  createUser: (user: UserWithId) => void;
  modifyUser: (partialUser: Partial<UserWithId>) => void;
  resetUser: () => void;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

type PersistedValue = StorageValue<UserStore> | null;

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
      verifyToken: async () => {
        const { token, logout } = get();
        if (!token) {
          logout();
          return false;
        }
        try {
          const response = await fetch('/api/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            set({ isAuthenticated: true });
            return true;
          } else {
            logout();
            return false;
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
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
