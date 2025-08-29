import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { Board } from '../../store/slices/boardsSlice';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'framer-motion';

interface BoardCardProps {
  board: Board;
  onEdit?: (board: Board) => void;
  onArchive?: (board: Board) => void;
  onDelete?: (board: Board) => void;
  onManageMembers?: (board: Board) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onEdit,
  onArchive,
  onDelete,
  onManageMembers,
}) => {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const totalTasks = board.lists.reduce((sum, list) => sum + list.task_count, 0);
  const doneTasks = board.lists.find(list => list.title === 'Done')?.task_count || 0;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          borderRadius: 3,
          boxShadow: 2,
          border: 1,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
            borderColor: 'primary.main',
          },
        }}
        onClick={() => navigate(`/boards/${board.id}`)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {board.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ color: 'text.secondary' }}
            >
              <MoreIcon />
            </IconButton>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40,
            }}
          >
            {board.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {doneTasks}/{totalTasks} tasks
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
              {board.members.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar_url}
                  alt={member.user_name}
                  title={member.user_name}
                />
              ))}
            </AvatarGroup>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Updated {formatDistanceToNow(new Date(board.updated_at), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleMenuAction(() => onEdit?.(board))}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Board</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(() => onManageMembers?.(board))}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Members</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(() => onArchive?.(board))}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive Board</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(() => onDelete?.(board))}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Board</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default BoardCard;