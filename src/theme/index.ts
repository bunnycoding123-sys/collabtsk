import { createTheme } from '@mui/material/styles';

const baseTheme = {
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    button: { textTransform: 'none' as const, fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 6px 20px rgba(0,0,0,0.10)',
    '0 8px 25px rgba(0,0,0,0.12)',
    '0 12px 35px rgba(0,0,0,0.14)',
    '0 16px 45px rgba(0,0,0,0.16)',
    '0 20px 55px rgba(0,0,0,0.18)',
    '0 24px 65px rgba(0,0,0,0.20)',
  ] as any,
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { 
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: { 
      main: '#F97316',
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#FFFFFF',
    },
    background: { 
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    success: { 
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: { 
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: { 
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: { 
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    text: { 
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { 
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: { 
      main: '#FB923C',
      light: '#FDBA74',
      dark: '#F97316',
      contrastText: '#000000',
    },
    background: { 
      default: '#111827',
      paper: '#1F2937',
    },
    success: { 
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    error: { 
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#EF4444',
    },
    warning: { 
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#F59E0B',
    },
    info: { 
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
    },
    text: { 
      primary: '#D1D5DB',
      secondary: '#9CA3AF',
    },
    divider: '#374151',
  },
});