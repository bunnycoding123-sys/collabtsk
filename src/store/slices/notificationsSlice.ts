import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  user_id: string;
  type: 'MENTION' | 'DUE_SOON' | 'ASSIGNED' | 'COMMENT' | 'SYSTEM';
  title: string;
  message: string;
  payload?: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.is_read).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount++;
      }
    },
    markAsRead: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount--;
        }
      });
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.is_read = true;
      });
      state.unreadCount = 0;
    },
    toggleNotificationsPanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  toggleNotificationsPanel,
  setNotificationsOpen,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;