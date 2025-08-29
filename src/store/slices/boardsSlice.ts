import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Board {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  members: BoardMember[];
  lists: TaskList[];
}

export interface BoardMember {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  avatar_url?: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  last_active?: string;
}

export interface TaskList {
  id: string;
  board_id: string;
  title: string;
  position: number;
  task_count: number;
}

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoardsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.unshift(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Partial<Board> & { id: string }>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index >= 0) {
        state.boards[index] = { ...state.boards[index], ...action.payload };
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = { ...state.currentBoard, ...action.payload };
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard = null;
      }
    },
    addListToBoard: (state, action: PayloadAction<TaskList>) => {
      if (state.currentBoard) {
        state.currentBoard.lists.push(action.payload);
      }
    },
    updateListInBoard: (state, action: PayloadAction<Partial<TaskList> & { id: string }>) => {
      if (state.currentBoard) {
        const index = state.currentBoard.lists.findIndex(list => list.id === action.payload.id);
        if (index >= 0) {
          state.currentBoard.lists[index] = { ...state.currentBoard.lists[index], ...action.payload };
        }
      }
    },
    removeListFromBoard: (state, action: PayloadAction<string>) => {
      if (state.currentBoard) {
        state.currentBoard.lists = state.currentBoard.lists.filter(list => list.id !== action.payload);
      }
    },
  },
});

export const {
  setBoardsLoading,
  setBoards,
  setCurrentBoard,
  addBoard,
  updateBoard,
  deleteBoard,
  addListToBoard,
  updateListInBoard,
  removeListFromBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;