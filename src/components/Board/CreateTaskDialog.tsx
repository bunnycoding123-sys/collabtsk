import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { closeDialog, addToast } from '../../store/slices/uiSlice';
import { addTask } from '../../store/slices/tasksSlice';
import { tasksApi } from '../../services/api';

const CreateTaskDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.dialogs.createTask);
  const currentBoard = useAppSelector(state => state.boards.currentBoard);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    due_date: null as Date | null,
    list_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && currentBoard?.lists.length) {
      setFormData(prev => ({
        ...prev,
        list_id: prev.list_id || currentBoard.lists[0].id,
      }));
    }
  }, [isOpen, currentBoard]);

  const handleClose = () => {
    dispatch(closeDialog('createTask'));
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      due_date: null,
      list_id: currentBoard?.lists[0]?.id || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBoard || !formData.title.trim()) return;

    setIsSubmitting(true);
    
    try {
      const taskData = {
        board_id: currentBoard.id,
        list_id: formData.list_id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: formData.due_date?.toISOString(),
      };

      const newTask = await tasksApi.createTask(taskData);
      dispatch(addTask(newTask));
      dispatch(addToast({
        message: 'Task created successfully',
        type: 'success',
      }));
      handleClose();
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to create task',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Task
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 3 }}
              autoFocus
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a description... (Markdown supported)"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>List</InputLabel>
                <Select
                  value={formData.list_id}
                  onChange={(e) => setFormData({ ...formData, list_id: e.target.value })}
                  label="List"
                >
                  {currentBoard?.lists.map((list) => (
                    <MenuItem key={list.id} value={list.id}>
                      {list.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  label="Priority"
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <MuiDatePicker
              label="Due Date (Optional)"
              value={formData.due_date}
              onChange={(date) => setFormData({ ...formData, due_date: date })}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.title.trim() || isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateTaskDialog;