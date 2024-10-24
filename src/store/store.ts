import { create } from "zustand";
import { User } from "@/models";

interface AppState {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {} as User,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: {} as User }),
}));
