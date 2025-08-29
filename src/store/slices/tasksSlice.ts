import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  board_id: string;
  list_id: string;
  creator_id: string;
  title: string;
  description: string;
  due_date?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  position: number;
  created_at: string;
  updated_at: string;
  assignees: TaskAssignee[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  version: number;
}

export interface TaskAssignee {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
}

export interface TaskComment {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  body: string;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: string;
}

interface TasksState {
  tasks: { [boardId: string]: Task[] };
  selectedTask: Task | null;
  isLoading: boolean;
  searchResults: Task[];
  filters: {
    assignee?: string;
    status?: string;
    priority?: string;
    search?: string;
  };
}

const initialState: TasksState = {
  tasks: {},
  selectedTask: null,
  isLoading: false,
  searchResults: [],
  filters: {},
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasksForBoard: (state, action: PayloadAction<{ boardId: string; tasks: Task[] }>) => {
      state.tasks[action.payload.boardId] = action.payload.tasks;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const boardId = action.payload.board_id;
      if (!state.tasks[boardId]) {
        state.tasks[boardId] = [];
      }
      state.tasks[boardId].push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const boardId = action.payload.board_id;
      if (state.tasks[boardId]) {
        const index = state.tasks[boardId].findIndex(task => task.id === action.payload.id);
        if (index >= 0) {
          state.tasks[boardId][index] = action.payload;
        }
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newListId: string; newPosition: number; boardId: string }>) => {
      const { taskId, newListId, newPosition, boardId } = action.payload;
      if (state.tasks[boardId]) {
        const taskIndex = state.tasks[boardId].findIndex(task => task.id === taskId);
        if (taskIndex >= 0) {
          const task = state.tasks[boardId][taskIndex];
          task.list_id = newListId;
          task.position = newPosition;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string; boardId: string }>) => {
      const { taskId, boardId } = action.payload;
      if (state.tasks[boardId]) {
        state.tasks[boardId] = state.tasks[boardId].filter(task => task.id !== taskId);
      }
      if (state.selectedTask?.id === taskId) {
        state.selectedTask = null;
      }
    },
    addCommentToTask: (state, action: PayloadAction<{ taskId: string; comment: TaskComment; boardId: string }>) => {
      const { taskId, comment, boardId } = action.payload;
      if (state.tasks[boardId]) {
        const task = state.tasks[boardId].find(t => t.id === taskId);
        if (task) {
          task.comments.push(comment);
        }
      }
      if (state.selectedTask?.id === taskId) {
        state.selectedTask.comments.push(comment);
      }
    },
    setFilters: (state, action: PayloadAction<typeof state.filters>) => {
      state.filters = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Task[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const {
  setTasksLoading,
  setTasksForBoard,
  setSelectedTask,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  addCommentToTask,
  setFilters,
  setSearchResults,
} = tasksSlice.actions;

export default tasksSlice.reducer;