// redux/states/sidebarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { RootState } from "../store";

// Tipos
type SidebarSettings = { disabled: boolean; isHoverOpen: boolean };

interface SidebarState {
  isOpen: boolean;
  isHover: boolean;
  settings: SidebarSettings;
}

// Estado inicial
const initialState: SidebarState = {
  isOpen: true,
  isHover: false,
  settings: { disabled: false, isHoverOpen: false },
};

// Slice de Sidebar
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setIsHover: (state, action: PayloadAction<boolean>) => {
      state.isHover = action.payload;
    },
    setSettings: (state, action: PayloadAction<Partial<SidebarSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

// Configuración de persistencia
const sidebarPersistConfig = {
  key: "sidebar",
  storage,
};

// Exportar el reducer persistido
export const persistedSidebarReducer = persistReducer(sidebarPersistConfig, sidebarSlice.reducer);

// Exportar acciones
export const { toggleOpen, setIsOpen, setIsHover, setSettings } = sidebarSlice.actions;

// Selectores
export const selectSidebar = (state: RootState) => state.sidebar;
export const selectSidebarOpenState = (state: RootState) =>
  state.sidebar.isOpen || (state.sidebar.settings.isHoverOpen && state.sidebar.isHover);
