import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
  AvatarGroup,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentBoard } from '../../store/slices/boardsSlice';
import { setTasksForBoard, moveTask, setSelectedTask } from '../../store/slices/tasksSlice';
import { openDialog } from '../../store/slices/uiSlice';
import { boardsApi, tasksApi } from '../../services/api';
import { useParams } from 'react-router-dom';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import CreateTaskDialog from './CreateTaskDialog';
import TaskDetailsDialog from './TaskDetailsDialog';

const KanbanBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const dispatch = useAppDispatch();
  const currentBoard = useAppSelector(state => state.boards.currentBoard);
  const tasks = useAppSelector(state => boardId ? state.tasks.tasks[boardId] || [] : []);
  const [draggedTask, setDraggedTask] = React.useState<any>(null);

  useEffect(() => {
    if (boardId) {
      loadBoard();
      loadTasks();
    }
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;
    try {
      const board = await boardsApi.getBoard(boardId);
      dispatch(setCurrentBoard(board));
    } catch (error) {
      console.error('Failed to load board:', error);
    }
  };

  const loadTasks = async () => {
    if (!boardId) return;
    try {
      const tasks = await tasksApi.getTasksForBoard(boardId);
      dispatch(setTasksForBoard({ boardId, tasks }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setDraggedTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over || !boardId) return;

    const taskId = active.id as string;
    const newListId = over.id as string;

    // Find the task and check if it's actually moving to a different list
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.list_id === newListId) return;

    // Calculate new position (add to end of list)
    const tasksInNewList = tasks.filter(t => t.list_id === newListId);
    const newPosition = tasksInNewList.length;

    // Dispatch optimistic update
    dispatch(moveTask({
      taskId,
      newListId,
      newPosition,
      boardId,
    }));

    // TODO: Send API request to update task position
    tasksApi.updateTask(taskId, {
      list_id: newListId,
      position: newPosition,
    }).catch(error => {
      console.error('Failed to move task:', error);
      // TODO: Implement rollback on failure
    });
  };

  const getTasksByListId = (listId: string) => {
    return tasks.filter(task => task.list_id === listId).sort((a, b) => a.position - b.position);
  };

  if (!currentBoard) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading board...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden' }}>
      {/* Board Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              {currentBoard.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentBoard.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<CalendarIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Sync Calendar
            </Button>
            <Button
              startIcon={<PeopleIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => dispatch(openDialog('inviteMembers'))}
            >
              Invite Members
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <AvatarGroup max={6}>
            {currentBoard.members.map((member) => (
              <Avatar
                key={member.id}
                src={member.avatar_url}
                alt={member.user_name}
                title={`${member.user_name} (${member.role})`}
                sx={{ width: 36, height: 36 }}
              />
            ))}
          </AvatarGroup>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`${currentBoard.members.length} members`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${currentBoard.lists.length} lists`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${tasks.length} tasks`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Kanban Board */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            overflowX: 'auto',
            overflowY: 'hidden',
            height: 'calc(100vh - 200px)',
            pb: 2,
          }}
        >
          <SortableContext items={currentBoard.lists.map(l => l.id)} strategy={verticalListSortingStrategy}>
            {currentBoard.lists.map((list) => (
              <KanbanColumn
                key={list.id}
                list={list}
                tasks={getTasksByListId(list.id)}
                onAddTask={() => dispatch(openDialog('createTask'))}
              />
            ))}
          </SortableContext>
        </Box>

        <DragOverlay>
          {draggedTask ? <TaskCard task={draggedTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog />
      <TaskDetailsDialog />
    </Box>
  );
};

export default KanbanBoard;