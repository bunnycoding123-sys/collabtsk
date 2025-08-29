import React, { useEffect } from 'react';
import {
  Drawer,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Button,
  Divider,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setNotificationsOpen, markAsRead, markAllAsRead, setNotifications } from '../../store/slices/notificationsSlice';
import { notificationsApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isOpen } = useAppSelector(state => state.notifications);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      dispatch(setNotifications(data));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleClose = () => {
    dispatch(setNotificationsOpen(false));
  };

  const handleMarkAsRead = async (ids: string[]) => {
    try {
      await notificationsApi.markAsRead(ids);
      dispatch(markAsRead(ids));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DUE_SOON':
        return <ScheduleIcon color="warning" />;
      case 'ASSIGNED':
        return <AssignmentIcon color="primary" />;
      case 'COMMENT':
        return <CommentIcon color="info" />;
      case 'MENTION':
        return <CommentIcon color="secondary" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'DUE_SOON':
        return 'warning';
      case 'ASSIGNED':
        return 'primary';
      case 'COMMENT':
        return 'info';
      case 'MENTION':
        return 'secondary';
      default:
        return 'info';
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {unreadCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Button
              size="small"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Mark all read
            </Button>
          </Box>
        )}
      </Box>

      <List sx={{ pt: 0 }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  backgroundColor: !notification.is_read 
                    ? alpha => alpha(`${getNotificationColor(notification.type)}.main`, 0.05)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    backgroundColor: `${getNotificationColor(notification.type)}.main`,
                    width: 40, 
                    height: 40,
                  }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: !notification.is_read ? 600 : 500,
                          color: 'text.primary',
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.is_read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead([notification.id])}
                          sx={{ ml: 1 }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Drawer>
  );
};

export default NotificationsPanel;