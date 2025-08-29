import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  AttachFile as AttachmentIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../store/slices/tasksSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setSelectedTask } from '../../store/slices/tasksSlice';
import { openDialog } from '../../store/slices/uiSlice';
import { formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getDueDateInfo = () => {
    if (!task.due_date) return null;
    
    const dueDate = new Date(task.due_date);
    const isOverdue = isPast(dueDate) && !isToday(dueDate);
    const isDueToday = isToday(dueDate);
    const isDueTomorrow = isTomorrow(dueDate);
    
    let color: any = 'default';
    let text = formatDistanceToNow(dueDate, { addSuffix: true });
    
    if (isOverdue) {
      color = 'error';
      text = 'Overdue';
    } else if (isDueToday) {
      color = 'warning';
      text = 'Due today';
    } else if (isDueTomorrow) {
      color = 'info';
      text = 'Due tomorrow';
    }
    
    return { color, text, isOverdue };
  };

  const dueDateInfo = getDueDateInfo();

  const handleCardClick = () => {
    dispatch(setSelectedTask(task));
    dispatch(openDialog('taskDetails'));
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        mb: 2,
        cursor: sortableIsDragging ? 'grabbing' : 'grab',
        opacity: sortableIsDragging || isDragging ? 0.5 : 1,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Priority Badge */}
        {task.priority !== 'LOW' && (
          <Box sx={{ mb: 1.5 }}>
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor() as any}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            />
          </Box>
        )}

        {/* Task Title */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {task.title}
        </Typography>

        {/* Description Preview */}
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description.replace(/[#*_`]/g, '').substring(0, 100)}
          </Typography>
        )}

        {/* Due Date */}
        {dueDateInfo && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
              label={dueDateInfo.text}
              size="small"
              color={dueDateInfo.color as any}
              variant={dueDateInfo.isOverdue ? 'filled' : 'outlined'}
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          {/* Assignees */}
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
            {task.assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                src={assignee.avatar_url}
                alt={assignee.user_name}
                title={assignee.user_name}
              />
            ))}
          </AvatarGroup>

          {/* Counts */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {task.comments.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.comments.length}
                </Typography>
              </Box>
            )}
            
            {task.attachments.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AttachmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.attachments.length}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;