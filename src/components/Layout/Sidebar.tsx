import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNavigate, useLocation } from 'react-router-dom';
import { openDialog } from '../../store/slices/uiSlice';
import { format, isToday, isThisWeek } from 'date-fns';

const SIDEBAR_WIDTH = 240;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);
  const boards = useAppSelector(state => state.boards.boards);
  const user = useAppSelector(state => state.auth.user);
  const [boardsExpanded, setBoardsExpanded] = React.useState(true);

  const getProgress = (board: any) => {
    const totalTasks = board.lists.reduce((sum: number, list: any) => sum + list.task_count, 0);
    const doneTasks = board.lists.find((list: any) => list.title === 'Done')?.task_count || 0;
    return totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/reports',
      active: location.pathname === '/reports',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      active: location.pathname === '/settings',
    },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({
      text: 'Admin',
      icon: <AdminIcon />,
      path: '/admin',
      active: location.pathname === '/admin',
    });
  }

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'none',
          backgroundColor: 'background.paper',
          boxShadow: 1,
          pt: 8,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={item.active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.active ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: item.active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
            My Boards
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setBoardsExpanded(!boardsExpanded)}
              sx={{ color: 'text.secondary' }}
            >
              {boardsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => dispatch(openDialog('createBoard'))}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: alpha => alpha('primary.main', 0.1),
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={boardsExpanded}>
          <List>
            {boards.slice(0, 6).map((board) => {
              const progress = getProgress(board);
              const isRecent = isToday(new Date(board.updated_at)) || isThisWeek(new Date(board.updated_at));
              const isActive = location.pathname === `/boards/${board.id}`;

              return (
                <ListItem key={board.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => navigate(`/boards/${board.id}`)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <FolderIcon sx={{ mr: 1, fontSize: 20, color: isActive ? 'inherit' : 'primary.main' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          flexGrow: 1,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {board.title}
                      </Typography>
                      {isRecent && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'secondary.main',
                            color: isActive ? 'inherit' : 'white',
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color={isActive ? 'inherit' : 'text.secondary'}>
                          {progress.toFixed(0)}% complete
                        </Typography>
                        <Typography variant="caption" color={isActive ? 'inherit' : 'text.secondary'}>
                          {board.lists.reduce((sum, list) => sum + list.task_count, 0)} tasks
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            backgroundColor: isActive ? 'rgba(255,255,255,0.8)' : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}

            {boards.length > 6 && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate('/dashboard')}
                  sx={{ borderRadius: 2, justifyContent: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    View all boards ({boards.length - 6} more)
                  </Typography>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Collapse>
      </Box>
    </Drawer>
  );
};

export default Sidebar;