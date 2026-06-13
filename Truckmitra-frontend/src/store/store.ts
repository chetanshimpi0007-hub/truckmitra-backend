// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import uiReducer from '../slices/uiSlice';
import adminReducer from '../slices/adminSlice';
import profileReducer from '../slices/profileSlice';
import ratingReducer from '../slices/ratingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    admin: adminReducer,
    profile: profileReducer,
    rating: ratingReducer,  // ✅ Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;