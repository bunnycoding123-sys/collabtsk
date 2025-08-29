import React, { useEffect } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeToast } from '../../store/slices/uiSlice';

const ToastContainer: React.FC = () => {
  const toasts = useAppSelector(state => state.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: theme => theme.zIndex.snackbar,
      }}
    >
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          severity={toast.type}
          onClose={() => dispatch(removeToast(toast.id))}
          sx={{
            minWidth: 300,
            boxShadow: 3,
          }}
        >
          {toast.message}
        </Alert>
      ))}
    </Stack>
  );
};

export default ToastContainer;