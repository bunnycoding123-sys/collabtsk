import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { closeDialog, addToast } from '../../store/slices/uiSlice';
import { updateTask, addCommentToTask } from '../../store/slices/tasksSlice';
import { tasksApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const TaskDetailsDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.dialogs.taskDetails);
  const selectedTask = useAppSelector(state => state.tasks.selectedTask);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
  });

  React.useEffect(() => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
      });
    }
  }, [selectedTask]);

  const handleClose = () => {
    dispatch(closeDialog('taskDetails'));
    setActiveTab(0);
    setIsEditing(false);
    setCommentText('');
  };

  const handleSaveEdit = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await tasksApi.updateTask(selectedTask.id, {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
      });
      
      dispatch(updateTask(updatedTask));
      dispatch(addToast({
        message: 'Task updated successfully',
        type: 'success',
      }));
      setIsEditing(false);
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to update task',
        type: 'error',
      }));
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const updatedTask = await tasksApi.addComment(selectedTask.id, commentText.trim());
      dispatch(updateTask(updatedTask));
      setCommentText('');
      dispatch(addToast({
        message: 'Comment added successfully',
        type: 'success',
      }));
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to add comment',
        type: 'error',
      }));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!selectedTask) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'between', 
        alignItems: 'center',
        pb: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isEditing ? (
            <TextField
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              variant="standard"
              sx={{ fontSize: '1.25rem', fontWeight: 600 }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedTask.title}
            </Typography>
          )}
          
          <Chip
            icon={<FlagIcon sx={{ fontSize: 16 }} />}
            label={selectedTask.priority}
            size="small"
            color={getPriorityColor(selectedTask.priority) as any}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? (
            <>
              <IconButton onClick={() => setIsEditing(false)} size="small">
                <CancelIcon />
              </IconButton>
              <IconButton onClick={handleSaveEdit} size="small" color="primary">
                <SaveIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => setIsEditing(true)} size="small">
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Details" />
          <Tab label={`Comments (${selectedTask.comments.length})`} />
          <Tab label="History" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Task Details */}
          <Box sx={{ mb: 3 }}>
            {isEditing ? (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={6}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Add a description... (Markdown supported)"
                  sx={{ mb: 3 }}
                />
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                    label="Priority"
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <>
                {selectedTask.description ? (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: 'background.default',
                      borderRadius: 2,
                      mb: 3,
                      '& p': { mb: 1 },
                      '& h1, & h2, & h3': { mb: 1, fontWeight: 600 },
                      '& ul, & ol': { pl: 2 },
                      '& code': { 
                        backgroundColor: 'grey.200', 
                        px: 0.5, 
                        py: 0.25, 
                        borderRadius: 1,
                        fontSize: '0.875rem',
                      },
                    }}
                  >
                    <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
                  </Box>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    backgroundColor: 'background.default',
                    borderRadius: 2,
                    mb: 3,
                  }}>
                    <Typography color="text.secondary">
                      No description provided
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* Task Meta */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Assignees
                </Typography>
                {selectedTask.assignees.length > 0 ? (
                  <AvatarGroup max={4}>
                    {selectedTask.assignees.map((assignee) => (
                      <Avatar
                        key={assignee.id}
                        src={assignee.avatar_url}
                        alt={assignee.user_name}
                        title={assignee.user_name}
                        sx={{ width: 32, height: 32 }}
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Unassigned
                  </Typography>
                )}
              </Box>

              {selectedTask.due_date && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Due Date
                  </Typography>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={new Date(selectedTask.due_date).toLocaleDateString()}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatDistanceToNow(new Date(selectedTask.created_at), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Comments */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<SendIcon />}
                onClick={handleAddComment}
                disabled={!commentText.trim() || isSubmittingComment}
                sx={{ textTransform: 'none' }}
              >
                {isSubmittingComment ? 'Sending...' : 'Add Comment'}
              </Button>
            </Box>
          </Box>

          <List>
            {selectedTask.comments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography>No comments yet. Start the conversation!</Typography>
              </Box>
            ) : (
              selectedTask.comments.map((comment, index) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={comment.author_avatar} alt={comment.author_name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {comment.author_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                          {comment.body}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < selectedTask.comments.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))
            )}
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* History */}
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography>Task history will be implemented with backend integration</Typography>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;