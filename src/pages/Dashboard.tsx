import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  TrendingUp as TrendIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setBoards } from '../store/slices/boardsSlice';
import { openDialog } from '../store/slices/uiSlice';
import { boardsApi } from '../services/api';
import BoardCard from '../components/Dashboard/BoardCard';
import StatsCard from '../components/Dashboard/StatsCard';
import CreateBoardDialog from '../components/Dashboard/CreateBoardDialog';
import { motion } from 'framer-motion';
import { isToday, addDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const boards = useAppSelector(state => state.boards.boards);
  const tasks = useAppSelector(state => state.tasks.tasks);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const boardsData = await boardsApi.getBoards();
      dispatch(setBoards(boardsData));
    } catch (error) {
      console.error('Failed to load boards:', error);
    }
  };

  // Calculate stats
  const allTasks = Object.values(tasks).flat();
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'DONE').length;
  const tasksDueToday = allTasks.filter(t => t.due_date && isToday(new Date(t.due_date))).length;
  const overdueTasks = allTasks.filter(t => 
    t.due_date && 
    new Date(t.due_date) < new Date() && 
    !isToday(new Date(t.due_date)) && 
    t.status !== 'DONE'
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeBoards = boards.filter(b => !b.is_archived).length;

  const stats = [
    {
      title: 'Active Boards',
      value: activeBoards,
      subtitle: 'Across all projects',
      icon: <DashboardIcon />,
      color: 'primary' as const,
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      subtitle: `${completedTasks} completed`,
      icon: <TaskIcon />,
      color: 'info' as const,
      trend: {
        value: 12,
        isPositive: true,
      },
    },
    {
      title: 'Due Today',
      value: tasksDueToday,
      subtitle: overdueTasks > 0 ? `${overdueTasks} overdue` : 'All on track',
      icon: <ScheduleIcon />,
      color: tasksDueToday > 0 ? 'warning' as const : 'success' as const,
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: 'This month',
      icon: <CompleteIcon />,
      color: 'success' as const,
      trend: {
        value: 8,
        isPositive: true,
      },
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Good morning, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Here's what's happening with your projects today.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => dispatch(openDialog('createBoard'))}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              px: 3,
            }}
          >
            Create Board
          </Button>
        </Box>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
              <StatsCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {tasksDueToday > 0 && (
          <Card sx={{ mb: 4, borderRadius: 3, border: 1, borderColor: 'warning.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: alpha => alpha('warning.main', 0.1),
                    color: 'warning.main',
                  }}
                >
                  <ScheduleIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {tasksDueToday} task{tasksDueToday > 1 ? 's' : ''} due today
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay on track with your deadlines
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Recent Boards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
          Recent Boards
        </Typography>

        {boards.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
            <CardContent>
              <DashboardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Welcome to CollabTask!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first board to start organizing your team's work.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => dispatch(openDialog('createBoard'))}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Create Your First Board
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {boards.slice(0, 6).map((board) => (
              <Grid item xs={12} sm={6} lg={4} key={board.id}>
                <BoardCard
                  board={board}
                  onEdit={(board) => console.log('Edit board:', board.id)}
                  onArchive={(board) => console.log('Archive board:', board.id)}
                  onDelete={(board) => console.log('Delete board:', board.id)}
                  onManageMembers={(board) => console.log('Manage members:', board.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>

      <CreateBoardDialog />
    </Box>
  );
};

export default Dashboard;