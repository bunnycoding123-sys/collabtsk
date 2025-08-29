import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { loadUserFromStorage } from './store/slices/authSlice';
import { setNotifications } from './store/slices/notificationsSlice';
import { notificationsApi } from './services/api';
import AppLayout from './components/Layout/AppLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './components/Board/KanbanBoard';
import LandingPage from './pages/LandingPage';

const AuthenticatedApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const notifications = await notificationsApi.getNotifications();
      dispatch(setNotifications(notifications));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/:boardId" element={<KanbanBoard />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

// Placeholder components for routes
const ReportsPage: React.FC = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
      Analytics & Reports
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Advanced analytics and reporting features will be implemented with backend integration.
    </Typography>
  </Box>
);

const SettingsPage: React.FC = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
      Settings
    </Typography>
    <Typography variant="body1" color="text.secondary">
      User settings and preferences will be implemented with backend integration.
    </Typography>
  </Box>
);

const AdminPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User management and system administration features will be implemented with backend integration.
      </Typography>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthenticatedApp />
    </Provider>
  );
};

export default App;