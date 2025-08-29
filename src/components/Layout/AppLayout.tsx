import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { lightTheme, darkTheme } from '../../theme';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ToastContainer from '../UI/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useAppSelector(state => state.ui.theme);
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8,
            pl: sidebarOpen ? 30 : 8,
            transition: theme => theme.transitions.create(['padding-left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;