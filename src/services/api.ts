import { User } from '../store/slices/authSlice';
import { Board } from '../store/slices/boardsSlice';
import { Task } from '../store/slices/tasksSlice';
import { Notification } from '../store/slices/notificationsSlice';
import { mockUsers, mockBoards, mockTasks, mockNotifications, generateMoreTasks } from './mockData';

// Simulate API calls with realistic delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    const token = `mock_token_${user.id}_${Date.now()}`;
    return { user, token };
  },

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await delay(1000);
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'MEMBER',
    };
    
    mockUsers.push(user);
    const token = `mock_token_${user.id}_${Date.now()}`;
    return { user, token };
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(300);
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => token.includes(u.id));
    if (!user) {
      throw new Error('Invalid token');
    }
    return user;
  },
};

// Boards API
export const boardsApi = {
  async getBoards(): Promise<Board[]> {
    await delay(600);
    return mockBoards;
  },

  async getBoard(id: string): Promise<Board> {
    await delay(400);
    const board = mockBoards.find(b => b.id === id);
    if (!board) {
      throw new Error('Board not found');
    }
    return board;
  },

  async createBoard(data: { title: string; description: string }): Promise<Board> {
    await delay(800);
    
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title: data.title,
      description: data.description,
      owner_id: 'user-1', // Current user
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
      members: [{
        id: `member-${Date.now()}`,
        user_id: 'user-1',
        user_name: 'Alex Chen',
        user_email: 'admin@collabtask.app',
        avatar_url: mockUsers[0].avatar_url,
        role: 'ADMIN',
        last_active: new Date().toISOString(),
      }],
      lists: [
        {
          id: `list-${Date.now()}-1`,
          board_id: `board-${Date.now()}`,
          title: 'To-Do',
          position: 0,
          task_count: 0,
        },
        {
          id: `list-${Date.now()}-2`,
          board_id: `board-${Date.now()}`,
          title: 'In Progress',
          position: 1,
          task_count: 0,
        },
        {
          id: `list-${Date.now()}-3`,
          board_id: `board-${Date.now()}`,
          title: 'Done',
          position: 2,
          task_count: 0,
        },
      ],
    };
    
    mockBoards.unshift(newBoard);
    return newBoard;
  },

  async updateBoard(id: string, data: Partial<Board>): Promise<Board> {
    await delay(500);
    const board = mockBoards.find(b => b.id === id);
    if (!board) {
      throw new Error('Board not found');
    }
    Object.assign(board, data, { updated_at: new Date().toISOString() });
    return board;
  },

  async deleteBoard(id: string): Promise<void> {
    await delay(600);
    const index = mockBoards.findIndex(b => b.id === id);
    if (index >= 0) {
      mockBoards.splice(index, 1);
    }
  },
};

// Tasks API
export const tasksApi = {
  async getTasksForBoard(boardId: string): Promise<Task[]> {
    await delay(500);
    
    if (!mockTasks[boardId]) {
      const board = mockBoards.find(b => b.id === boardId);
      if (board) {
        const listIds = board.lists.map(l => l.id);
        mockTasks[boardId] = generateMoreTasks(boardId, listIds);
      }
    }
    
    return mockTasks[boardId] || [];
  },

  async createTask(data: {
    list_id: string;
    board_id: string;
    title: string;
    description?: string;
    priority?: Task['priority'];
    due_date?: string;
  }): Promise<Task> {
    await delay(600);
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      board_id: data.board_id,
      list_id: data.list_id,
      creator_id: 'user-1',
      title: data.title,
      description: data.description || '',
      due_date: data.due_date,
      priority: data.priority || 'MEDIUM',
      status: 'TODO',
      position: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      assignees: [],
      comments: [],
      attachments: [],
    };
    
    if (!mockTasks[data.board_id]) {
      mockTasks[data.board_id] = [];
    }
    mockTasks[data.board_id].unshift(newTask);
    
    return newTask;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await delay(400);
    
    for (const boardId in mockTasks) {
      const task = mockTasks[boardId].find(t => t.id === id);
      if (task) {
        Object.assign(task, data, { 
          updated_at: new Date().toISOString(),
          version: task.version + 1,
        });
        return task;
      }
    }
    
    throw new Error('Task not found');
  },

  async deleteTask(id: string): Promise<void> {
    await delay(500);
    
    for (const boardId in mockTasks) {
      const index = mockTasks[boardId].findIndex(t => t.id === id);
      if (index >= 0) {
        mockTasks[boardId].splice(index, 1);
        return;
      }
    }
  },

  async addComment(taskId: string, body: string): Promise<Task> {
    await delay(400);
    
    for (const boardId in mockTasks) {
      const task = mockTasks[boardId].find(t => t.id === taskId);
      if (task) {
        const comment = {
          id: `comment-${Date.now()}`,
          author_id: 'user-1',
          author_name: 'Alex Chen',
          author_avatar: mockUsers[0].avatar_url,
          body,
          created_at: new Date().toISOString(),
        };
        task.comments.push(comment);
        return task;
      }
    }
    
    throw new Error('Task not found');
  },

  async searchTasks(query: string): Promise<Task[]> {
    await delay(300);
    
    const allTasks = Object.values(mockTasks).flat();
    return allTasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  },
};

// Notifications API
export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return mockNotifications;
  },

  async markAsRead(ids: string[]): Promise<void> {
    await delay(200);
    mockNotifications.forEach(n => {
      if (ids.includes(n.id)) {
        n.is_read = true;
      }
    });
  },

  async markAllAsRead(): Promise<void> {
    await delay(300);
    mockNotifications.forEach(n => {
      n.is_read = true;
    });
  },
};