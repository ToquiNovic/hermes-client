// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { persistedSidebarReducer } from "./states/sidebarSlice.ts";
import { supabasePersistReducer } from "./states/supabaseSlice.ts";


export const store = configureStore({
  reducer: {
    supabase: supabasePersistReducer,
    sidebar: persistedSidebarReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./states/sidebarSlice.ts";
export * from "./states/supabaseSlice.ts";