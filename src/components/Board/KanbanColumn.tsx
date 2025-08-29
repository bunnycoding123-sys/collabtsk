import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskList } from '../../store/slices/boardsSlice';
import { Task } from '../../store/slices/tasksSlice';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
  list: TaskList;
  tasks: Task[];
  onAddTask: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ list, tasks, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  });

  const getListColor = () => {
    switch (list.title.toLowerCase()) {
      case 'to-do':
      case 'backlog':
        return 'grey';
      case 'in progress':
      case 'sprint':
        return 'info';
      case 'review':
      case 'testing':
        return 'warning';
      case 'done':
      case 'deployed':
        return 'success';
      default:
        return 'primary';
    }
  };

  const listColor = getListColor();

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        p: 2,
        backgroundColor: isOver 
          ? alpha => alpha('primary.main', 0.05)
          : 'background.paper',
        border: 1,
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 3,
        boxShadow: 1,
        transition: 'all 0.3s ease',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 240px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Column Header */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {list.title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              backgroundColor: `${listColor}.main`,
              color: 'white',
              minWidth: 24,
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={onAddTask}
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: alpha => alpha('primary.main', 0.1),
              },
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Tasks List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary',
          }}>
            <Typography variant="body2">
              No tasks yet
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={onAddTask}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Add first task
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;