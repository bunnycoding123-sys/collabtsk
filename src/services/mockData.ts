import { Board, BoardMember, TaskList } from '../store/slices/boardsSlice';
import { Task, TaskComment, TaskAssignee } from '../store/slices/tasksSlice';
import { User } from '../store/slices/authSlice';
import { Notification } from '../store/slices/notificationsSlice';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@collabtask.app',
    name: 'Alex Chen',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'ADMIN',
  },
  {
    id: 'user-2',
    email: 'sarah@collabtask.app',
    name: 'Sarah Johnson',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'MEMBER',
  },
  {
    id: 'user-3',
    email: 'mike@collabtask.app',
    name: 'Mike Torres',
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'MEMBER',
  },
];

// Mock board members
export const mockBoardMembers: BoardMember[] = [
  {
    id: 'member-1',
    user_id: 'user-1',
    user_name: 'Alex Chen',
    user_email: 'admin@collabtask.app',
    avatar_url: mockUsers[0].avatar_url,
    role: 'ADMIN',
    last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: 'member-2',
    user_id: 'user-2',
    user_name: 'Sarah Johnson',
    user_email: 'sarah@collabtask.app',
    avatar_url: mockUsers[1].avatar_url,
    role: 'EDITOR',
    last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: 'member-3',
    user_id: 'user-3',
    user_name: 'Mike Torres',
    user_email: 'mike@collabtask.app',
    avatar_url: mockUsers[2].avatar_url,
    role: 'EDITOR',
    last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
];

// Mock task lists
export const mockLists: TaskList[] = [
  {
    id: 'list-1',
    board_id: 'board-1',
    title: 'To-Do',
    position: 0,
    task_count: 4,
  },
  {
    id: 'list-2',
    board_id: 'board-1',
    title: 'In Progress',
    position: 1,
    task_count: 3,
  },
  {
    id: 'list-3',
    board_id: 'board-1',
    title: 'Review',
    position: 2,
    task_count: 2,
  },
  {
    id: 'list-4',
    board_id: 'board-1',
    title: 'Done',
    position: 3,
    task_count: 8,
  },
];

// Mock boards
export const mockBoards: Board[] = [
  {
    id: 'board-1',
    title: 'Product Launch Q1',
    description: 'Planning and execution for our major product launch in Q1 2025',
    owner_id: 'user-1',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    is_archived: false,
    members: mockBoardMembers,
    lists: mockLists,
  },
  {
    id: 'board-2',
    title: 'Marketing Campaign',
    description: 'Social media and content marketing strategy for Q1',
    owner_id: 'user-2',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    is_archived: false,
    members: mockBoardMembers.slice(0, 2),
    lists: [
      {
        id: 'list-5',
        board_id: 'board-2',
        title: 'Content Ideas',
        position: 0,
        task_count: 6,
      },
      {
        id: 'list-6',
        board_id: 'board-2',
        title: 'In Production',
        position: 1,
        task_count: 2,
      },
      {
        id: 'list-7',
        board_id: 'board-2',
        title: 'Published',
        position: 2,
        task_count: 12,
      },
    ],
  },
  {
    id: 'board-3',
    title: 'Engineering Roadmap',
    description: 'Technical debt, new features, and infrastructure improvements',
    owner_id: 'user-1',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    is_archived: false,
    members: mockBoardMembers,
    lists: [
      {
        id: 'list-8',
        board_id: 'board-3',
        title: 'Backlog',
        position: 0,
        task_count: 15,
      },
      {
        id: 'list-9',
        board_id: 'board-3',
        title: 'Sprint',
        position: 1,
        task_count: 5,
      },
      {
        id: 'list-10',
        board_id: 'board-3',
        title: 'Testing',
        position: 2,
        task_count: 3,
      },
      {
        id: 'list-11',
        board_id: 'board-3',
        title: 'Deployed',
        position: 3,
        task_count: 22,
      },
    ],
  },
];

// Mock tasks
export const mockTasks: { [boardId: string]: Task[] } = {
  'board-1': [
    {
      id: 'task-1',
      board_id: 'board-1',
      list_id: 'list-1',
      creator_id: 'user-1',
      title: 'Design new onboarding flow',
      description: '# Onboarding Redesign\n\nCreate a more intuitive user onboarding experience with:\n\n- Progressive disclosure\n- Interactive tutorials\n- Personalization steps\n\n**Success metrics:**\n- Reduce drop-off by 25%\n- Increase activation rate',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      priority: 'HIGH',
      status: 'TODO',
      position: 0,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      version: 1,
      assignees: [
        {
          id: 'assignee-1',
          user_id: 'user-2',
          user_name: 'Sarah Johnson',
          avatar_url: mockUsers[1].avatar_url,
        },
      ],
      comments: [
        {
          id: 'comment-1',
          author_id: 'user-1',
          author_name: 'Alex Chen',
          author_avatar: mockUsers[0].avatar_url,
          body: 'Started working on the wireframes. Will have initial concepts ready by tomorrow.',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
      ],
      attachments: [],
    },
    {
      id: 'task-2',
      board_id: 'board-1',
      list_id: 'list-1',
      creator_id: 'user-1',
      title: 'Update API documentation',
      description: 'Refresh the API docs with latest endpoint changes and add examples for the new authentication flow.',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'MEDIUM',
      status: 'TODO',
      position: 1,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
      assignees: [
        {
          id: 'assignee-2',
          user_id: 'user-3',
          user_name: 'Mike Torres',
          avatar_url: mockUsers[2].avatar_url,
        },
      ],
      comments: [],
      attachments: [],
    },
    {
      id: 'task-3',
      board_id: 'board-1',
      list_id: 'list-2',
      creator_id: 'user-2',
      title: 'Implement real-time notifications',
      description: '## Real-time Notifications\n\n- WebSocket connection management\n- Toast notifications\n- Email digest option\n- Push notifications for mobile\n\n**Technical requirements:**\n- Sub-second delivery\n- Offline queuing\n- User preferences',
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      position: 0,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      version: 3,
      assignees: [
        {
          id: 'assignee-3',
          user_id: 'user-1',
          user_name: 'Alex Chen',
          avatar_url: mockUsers[0].avatar_url,
        },
        {
          id: 'assignee-4',
          user_id: 'user-3',
          user_name: 'Mike Torres',
          avatar_url: mockUsers[2].avatar_url,
        },
      ],
      comments: [
        {
          id: 'comment-2',
          author_id: 'user-3',
          author_name: 'Mike Torres',
          author_avatar: mockUsers[2].avatar_url,
          body: 'WebSocket connection is working well. Working on the notification queuing system next.',
          created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
      ],
      attachments: [],
    },
    {
      id: 'task-4',
      board_id: 'board-1',
      list_id: 'list-3',
      creator_id: 'user-1',
      title: 'User acceptance testing',
      description: 'Coordinate with beta users for comprehensive testing of the new features before launch.',
      priority: 'HIGH',
      status: 'DONE',
      position: 0,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      version: 2,
      assignees: [
        {
          id: 'assignee-5',
          user_id: 'user-2',
          user_name: 'Sarah Johnson',
          avatar_url: mockUsers[1].avatar_url,
        },
      ],
      comments: [
        {
          id: 'comment-3',
          author_id: 'user-2',
          author_name: 'Sarah Johnson',
          author_avatar: mockUsers[1].avatar_avatar,
          body: 'Completed testing with 15 beta users. Overall feedback is very positive!',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      attachments: [],
    },
  ],
};

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'DUE_SOON',
    title: 'Task Due Tomorrow',
    message: 'Implement real-time notifications is due tomorrow at 5:00 PM',
    payload: { task_id: 'task-3', board_id: 'board-1' },
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'COMMENT',
    title: 'New Comment',
    message: 'Mike Torres commented on "Implement real-time notifications"',
    payload: { task_id: 'task-3', comment_id: 'comment-2', board_id: 'board-1' },
    is_read: false,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'user-1',
    type: 'ASSIGNED',
    title: 'Task Assignment',
    message: 'You were assigned to "Design new onboarding flow"',
    payload: { task_id: 'task-1', board_id: 'board-1' },
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Generate more tasks for other boards
export const generateMoreTasks = (boardId: string, listIds: string[]): Task[] => {
  const titles = [
    'Optimize database queries',
    'Update user interface mockups',
    'Write unit tests for authentication',
    'Research competitor features',
    'Implement search functionality',
    'Setup monitoring dashboard',
    'Create user documentation',
    'Performance optimization',
    'Security audit',
    'Mobile responsive design',
  ];

  return titles.map((title, index) => ({
    id: `task-${boardId}-${index + 1}`,
    board_id: boardId,
    list_id: listIds[index % listIds.length],
    creator_id: mockUsers[index % mockUsers.length].id,
    title,
    description: `**${title}**\n\nDetailed task description will be added here. This is a placeholder for the task content.`,
    due_date: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as Task['priority'],
    status: ['TODO', 'IN_PROGRESS', 'DONE'][Math.floor(Math.random() * 3)] as Task['status'],
    position: index,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - Math.floor(Math.random() * 5) * 60 * 60 * 1000).toISOString(),
    version: 1,
    assignees: Math.random() > 0.3 ? [{
      id: `assignee-${boardId}-${index}`,
      user_id: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      user_name: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
      avatar_url: mockUsers[Math.floor(Math.random() * mockUsers.length)].avatar_url,
    }] : [],
    comments: [],
    attachments: [],
  }));
};