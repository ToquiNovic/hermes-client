// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
// import userReducer from "./states/userSlice";
import { persistedSidebarReducer } from "./states/sidebarSlice.ts"; 

// const userPersistConfig = {
//   key: "user",
//   storage,
// };

// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    // user: persistedUserReducer,
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
// export * from "./states/sidebarSlice";