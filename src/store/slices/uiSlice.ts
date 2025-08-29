import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toasts: Toast[];
  dialogs: {
    createBoard: boolean;
    createTask: boolean;
    inviteMembers: boolean;
    taskDetails: boolean;
    confirmDelete: { open: boolean; type?: string; id?: string; title?: string };
  };
  loading: {
    global: boolean;
    boards: boolean;
    tasks: boolean;
  };
}

const initialState: UiState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  sidebarOpen: true,
  toasts: [],
  dialogs: {
    createBoard: false,
    createTask: false,
    inviteMembers: false,
    taskDetails: false,
    confirmDelete: { open: false },
  },
  loading: {
    global: false,
    boards: false,
    tasks: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        id: Date.now().toString(),
        duration: 5000,
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    openDialog: (state, action: PayloadAction<keyof UiState['dialogs'] | { type: 'confirmDelete'; data: { type: string; id: string; title: string } }>) => {
      if (typeof action.payload === 'string') {
        state.dialogs[action.payload] = true;
      } else {
        state.dialogs.confirmDelete = {
          open: true,
          type: action.payload.data.type,
          id: action.payload.data.id,
          title: action.payload.data.title,
        };
      }
    },
    closeDialog: (state, action: PayloadAction<keyof UiState['dialogs']>) => {
      if (action.payload === 'confirmDelete') {
        state.dialogs.confirmDelete = { open: false };
      } else {
        state.dialogs[action.payload] = false;
      }
    },
    setLoading: (state, action: PayloadAction<{ key: keyof UiState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
  openDialog,
  closeDialog,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;