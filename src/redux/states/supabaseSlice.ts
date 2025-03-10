// @/redux/states/supabaseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { User, Session } from "@supabase/supabase-js";

interface SupabaseState {
  loading: boolean;
  user: (User & { teamId?: string | null }) | null;
  session: Session | null;
  error: string | null;
}

const initialState: SupabaseState = {
  loading: false,
  user: null,
  session: null,
  error: null,
};

const supabaseSlice = createSlice({
  name: "supabase",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.loading = false;
      state.user = action.payload.user ? { ...action.payload.user, teamId: null } : null;
      state.session = action.payload.session;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.user = null;
      state.session = null;
      state.error = action.payload;
    },
    authSignOut: (state) => {
      state.user = null;
      state.session = null;
      state.loading = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    updateTeamId: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.teamId = action.payload;
      }
    },
  },
});


const supabasePersistConfig = {
  key: "supabase",
  storage,
};

export const supabasePersistReducer = persistReducer(supabasePersistConfig, supabaseSlice.reducer);

export const { authStart, authSuccess, authFailure, authSignOut, setUser, updateTeamId } = supabaseSlice.actions;
export default supabaseSlice.reducer;
