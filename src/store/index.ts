import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import boardsSlice from './slices/boardsSlice';
import tasksSlice from './slices/tasksSlice';
import uiSlice from './slices/uiSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    boards: boardsSlice,
    tasks: tasksSlice,
    ui: uiSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;