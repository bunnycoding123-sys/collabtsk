import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { closeDialog, addToast } from '../../store/slices/uiSlice';
import { addBoard } from '../../store/slices/boardsSlice';
import { boardsApi } from '../../services/api';

const CreateBoardDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.dialogs.createBoard);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    dispatch(closeDialog('createBoard'));
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    
    try {
      const newBoard = await boardsApi.createBoard({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      
      dispatch(addBoard(newBoard));
      dispatch(addToast({
        message: 'Board created successfully',
        type: 'success',
      }));
      handleClose();
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to create board',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          Create New Board
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Board Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 3 }}
            autoFocus
            placeholder="e.g., Product Launch Q1"
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What's this board for? (optional)"
          />

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Default Lists
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['To-Do', 'In Progress', 'Done'].map((list) => (
                <Box
                  key={list}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {list}
                </Box>
              ))}
            </Box>
          </Box>
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
            {isSubmitting ? 'Creating...' : 'Create Board'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateBoardDialog;