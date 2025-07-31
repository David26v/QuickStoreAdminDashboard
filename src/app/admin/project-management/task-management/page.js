'use client'
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  Flag,
  Users,
  Target,
  List,
  Grid3X3,
  Kanban,
  Timer,
  MessageSquare,
  Paperclip,
  Star,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  Square,
  TrendingUp,
  BarChart3,
  Activity,
  Building2,
  UserCheck,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Share2,
  Copy,
  X,
  ChevronDown,
  ChevronRight,
  Calendar as CalendarIcon,
  Layers,
  Circle
} from 'lucide-react';

const TaskManage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock task data connected to projects
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design User Authentication Flow',
      description: 'Create wireframes and user flow for the login, registration, and password reset functionality',
      status: 'in-progress',
      priority: 'high',
      project: {
        id: 1,
        name: 'Employee Management System',
        color: 'bg-blue-500'
      },
      assignee: {
        id: 4,
        name: 'Ana Reyes',
        role: 'UI/UX Designer',
        avatar: '/api/placeholder/32/32'
      },
      reporter: {
        id: 1,
        name: 'Juan Cruz',
        role: 'Project Manager'
      },
      dueDate: '2024-07-25',
      startDate: '2024-07-15',
      estimatedHours: 16,
      loggedHours: 8,
      progress: 50,
      tags: ['Design', 'UX', 'Authentication'],
      subtasks: [
        { id: 101, title: 'Create user persona research', completed: true },
        { id: 102, title: 'Design login wireframes', completed: true },
        { id: 103, title: 'Design registration flow', completed: false },
        { id: 104, title: 'Password reset workflow', completed: false }
      ],
      comments: [
        {
          id: 1,
          author: 'Juan Cruz',
          content: 'Please ensure the design follows our brand guidelines',
          timestamp: '2024-07-16T10:30:00Z'
        },
        {
          id: 2,
          author: 'Ana Reyes',
          content: 'Working on the wireframes now, should have initial drafts by EOD',
          timestamp: '2024-07-16T14:15:00Z'
        }
      ],
      attachments: [
        { id: 1, name: 'auth-wireframes-v1.figma', size: '2.4 MB' },
        { id: 2, name: 'user-flow-diagram.png', size: '856 KB' }
      ],
      timeTracking: {
        totalLogged: 8,
        sessions: [
          { date: '2024-07-15', hours: 4, description: 'Initial research and planning' },
          { date: '2024-07-16', hours: 4, description: 'Wireframe creation' }
        ]
      },
      createdDate: '2024-07-15',
      updatedDate: '2024-07-16'
    },
    {
      id: 2,
      title: 'Implement REST API Endpoints',
      description: 'Develop backend API endpoints for user management, authentication, and data operations',
      status: 'todo',
      priority: 'high',
      project: {
        id: 1,
        name: 'Employee Management System',
        color: 'bg-blue-500'
      },
      assignee: {
        id: 3,
        name: 'Jose Garcia',
        role: 'Backend Developer',
        avatar: '/api/placeholder/32/32'
      },
      reporter: {
        id: 1,
        name: 'Juan Cruz',
        role: 'Project Manager'
      },
      dueDate: '2024-08-05',
      startDate: '2024-07-20',
      estimatedHours: 32,
      loggedHours: 0,
      progress: 0,
      tags: ['Backend', 'API', 'Node.js'],
      subtasks: [
        { id: 201, title: 'Setup Express.js server', completed: false },
        { id: 202, title: 'Create user authentication endpoints', completed: false },
        { id: 203, title: 'Implement CRUD operations', completed: false },
        { id: 204, title: 'Add input validation', completed: false },
        { id: 205, title: 'Write API documentation', completed: false }
      ],
      comments: [],
      attachments: [
        { id: 3, name: 'api-specifications.pdf', size: '1.2 MB' }
      ],
      timeTracking: {
        totalLogged: 0,
        sessions: []
      },
      createdDate: '2024-07-14',
      updatedDate: '2024-07-14'
    },
    {
      id: 3,
      title: 'GPS Integration Testing',
      description: 'Test GPS accuracy and implement fallback mechanisms for the mobile time tracker',
      status: 'in-progress',
      priority: 'medium',
      project: {
        id: 2,
        name: 'Mobile Time Tracker App',
        color: 'bg-emerald-500'
      },
      assignee: {
        id: 7,
        name: 'Diego Torres',
        role: 'QA Engineer',
        avatar: '/api/placeholder/32/32'
      },
      reporter: {
        id: 5,
        name: 'Carlos Lopez',
        role: 'Mobile Developer'
      },
      dueDate: '2024-07-28',
      startDate: '2024-07-16',
      estimatedHours: 12,
      loggedHours: 6,
      progress: 40,
      tags: ['Testing', 'GPS', 'Mobile'],
      subtasks: [
        { id: 301, title: 'Test GPS accuracy in different locations', completed: true },
        { id: 302, title: 'Test offline mode functionality', completed: false },
        { id: 303, title: 'Performance testing', completed: false }
      ],
      comments: [
        {
          id: 3,
          author: 'Carlos Lopez',
          content: 'Found some accuracy issues in indoor locations, please test those scenarios',
          timestamp: '2024-07-16T09:00:00Z'
        }
      ],
      attachments: [
        { id: 4, name: 'gps-test-results.xlsx', size: '445 KB' }
      ],
      timeTracking: {
        totalLogged: 6,
        sessions: [
          { date: '2024-07-16', hours: 6, description: 'Initial GPS testing in various locations' }
        ]
      },
      createdDate: '2024-07-16',
      updatedDate: '2024-07-16'
    },
    {
      id: 4,
      title: 'Database Schema Design',
      description: 'Design and implement the database schema for analytics dashboard',
      status: 'completed',
      priority: 'high',
      project: {
        id: 3,
        name: 'Data Analytics Dashboard',
        color: 'bg-purple-500'
      },
      assignee: {
        id: 9,
        name: 'Roberto Silva',
        role: 'Full Stack Dev',
        avatar: '/api/placeholder/32/32'
      },
      reporter: {
        id: 8,
        name: 'Isabel Ramos',
        role: 'Data Analyst'
      },
      dueDate: '2024-07-20',
      startDate: '2024-07-10',
      estimatedHours: 20,
      loggedHours: 18,
      progress: 100,
      tags: ['Database', 'Schema', 'PostgreSQL'],
      subtasks: [
        { id: 401, title: 'Design entity relationship diagram', completed: true },
        { id: 402, title: 'Create database tables', completed: true },
        { id: 403, title: 'Setup indexes and constraints', completed: true },
        { id: 404, title: 'Data migration scripts', completed: true }
      ],
      comments: [
        {
          id: 4,
          author: 'Isabel Ramos',
          content: 'Great work on the schema design! This will support our analytics needs perfectly.',
          timestamp: '2024-07-18T16:45:00Z'
        }
      ],
      attachments: [
        { id: 5, name: 'database-schema.sql', size: '12 KB' },
        { id: 6, name: 'erd-diagram.png', size: '890 KB' }
      ],
      timeTracking: {
        totalLogged: 18,
        sessions: [
          { date: '2024-07-10', hours: 6, description: 'Initial schema planning' },
          { date: '2024-07-12', hours: 8, description: 'Database implementation' },
          { date: '2024-07-15', hours: 4, description: 'Testing and optimization' }
        ]
      },
      createdDate: '2024-07-10',
      updatedDate: '2024-07-18'
    },
    {
      id: 5,
      title: 'Frontend Dashboard Components',
      description: 'Build reusable React components for the dashboard interface',
      status: 'in-progress',
      priority: 'medium',
      project: {
        id: 1,
        name: 'Employee Management System',
        color: 'bg-blue-500'
      },
      assignee: {
        id: 2,
        name: 'Maria Santos',
        role: 'Frontend Developer',
        avatar: '/api/placeholder/32/32'
      },
      reporter: {
        id: 1,
        name: 'Juan Cruz',
        role: 'Project Manager'
      },
      dueDate: '2024-08-01',
      startDate: '2024-07-18',
      estimatedHours: 24,
      loggedHours: 12,
      progress: 35,
      tags: ['Frontend', 'React', 'Components'],
      subtasks: [
        { id: 501, title: 'Create header component', completed: true },
        { id: 502, title: 'Build sidebar navigation', completed: true },
        { id: 503, title: 'Dashboard cards component', completed: false },
        { id: 504, title: 'Data table component', completed: false },
        { id: 505, title: 'Modal components', completed: false }
      ],
      comments: [
        {
          id: 5,
          author: 'Maria Santos',
          content: 'Header and sidebar are complete. Working on dashboard cards now.',
          timestamp: '2024-07-17T11:20:00Z'
        }
      ],
      attachments: [],
      timeTracking: {
        totalLogged: 12,
        sessions: [
          { date: '2024-07-16', hours: 8, description: 'Header and navigation components' },
          { date: '2024-07-17', hours: 4, description: 'Component styling and responsiveness' }
        ]
      },
      createdDate: '2024-07-15',
      updatedDate: '2024-07-17'
    }
  ]);

  // Mock projects data
  const projects = [
    { id: 1, name: 'Employee Management System', color: 'bg-blue-500' },
    { id: 2, name: 'Mobile Time Tracker App', color: 'bg-emerald-500' },
    { id: 3, name: 'Data Analytics Dashboard', color: 'bg-purple-500' },
    { id: 4, name: 'API Integration Platform', color: 'bg-amber-500' }
  ];

  // Mock team members
  const teamMembers = [
    { id: 1, name: 'Juan Cruz', role: 'Project Manager' },
    { id: 2, name: 'Maria Santos', role: 'Frontend Developer' },
    { id: 3, name: 'Jose Garcia', role: 'Backend Developer' },
    { id: 4, name: 'Ana Reyes', role: 'UI/UX Designer' },
    { id: 5, name: 'Carlos Lopez', role: 'Mobile Developer' },
    { id: 7, name: 'Diego Torres', role: 'QA Engineer' },
    { id: 8, name: 'Isabel Ramos', role: 'Data Analyst' },
    { id: 9, name: 'Roberto Silva', role: 'Full Stack Dev' }
  ];

  const statuses = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-600', icon: Circle },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-600', icon: Play },
    { value: 'review', label: 'In Review', color: 'bg-yellow-100 text-yellow-600', icon: Eye },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-600', icon: XCircle }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600', icon: ArrowDown },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', icon: ArrowRight },
    { value: 'high', label: 'High', color: 'text-red-600', icon: ArrowUp },
    { value: 'urgent', label: 'Urgent', color: 'text-red-700', icon: AlertCircle }
  ];

  const viewModes = [
    { id: 'grid', label: 'Grid', icon: Grid3X3 },
    { id: 'list', label: 'List', icon: List },
    { id: 'kanban', label: 'Kanban', icon: Kanban }
  ];

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] } : task
    ));
  };

  const handleStartTimer = (taskId) => {
    // Implementation for starting time tracking
    console.log('Starting timer for task:', taskId);
  };

  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getPriorityConfig = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[0];
  };

  const calculateDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due Today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Due Tomorrow', color: 'text-yellow-600' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-gray-600' };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesProject = filterProject === 'all' || task.project.id.toString() === filterProject;
    const matchesAssignee = filterAssignee === 'all' || task.assignee.id.toString() === filterAssignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  const TaskCard = ({ task }) => {
    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);
    const daysLeft = calculateDaysLeft(task.dueDate);
    const StatusIcon = statusConfig.icon;
    const PriorityIcon = priorityConfig.icon;

    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${task.project.color}`}></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.project.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-4 h-4" />
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <PriorityIcon className={`w-4 h-4 ${priorityConfig.color}`} />
            <span className={`text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-800">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${task.project.color}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Subtasks */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Subtasks</span>
            <span className="text-sm text-gray-500">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          </div>
          <div className="space-y-1">
            {task.subtasks.slice(0, 2).map(subtask => (
              <div key={subtask.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${subtask.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {subtask.title}
                </span>
              </div>
            ))}
            {task.subtasks.length > 2 && (
              <span className="text-xs text-gray-500">+{task.subtasks.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Assignee and Due Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{task.assignee.name}</p>
              <p className="text-xs text-gray-500">{task.assignee.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Due Date</p>
            <p className={`text-xs ${daysLeft.color}`}>{daysLeft.text}</p>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Logged</p>
              <p className="font-medium">{task.loggedHours}h / {task.estimatedHours}h</p>
            </div>
            <button 
              onClick={() => handleStartTimer(task.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Activity */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments.length}</span>
            </div>
          </div>
          <span>Updated {new Date(task.updatedDate).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setSelectedTask(task)}
            className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          <button className="flex-1 bg-white/50 hover:bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button className="bg-white/50 hover:bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Management
              </h1>
              <p className="text-gray-600 mt-1">Organize, track, and manage project tasks with team collaboration</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/50 rounded-lg border border-gray-200">
                {viewModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-2 rounded-lg transition-colors ${viewMode === mode.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    title={mode.label}
                  >
                    <mode.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <List className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">{inProgressTasks}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{completedTasks}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-gray-800">{overdueTasks}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>

            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">No tasks match your current filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterProject('all');
                setFilterAssignee('all');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full ${selectedTask.project.color}`}></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedTask.title}</h2>
                    <p className="text-gray-600">{selectedTask.project.name} • Task #{selectedTask.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'subtasks', label: 'Subtasks', icon: List },
                  { id: 'comments', label: 'Comments', icon: MessageSquare },
                  { id: 'attachments', label: 'Attachments', icon: Paperclip },
                  { id: 'timetrack', label: 'Time Tracking', icon: Timer },
                  { id: 'activity', label: 'Activity', icon: Activity }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    
                    {/* Task Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Task Details</h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Description</p>
                              <p className="text-gray-800">{selectedTask.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedTask.status).color}`}>
                                  {getStatusConfig(selectedTask.status).label}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Priority</p>
                                <span className={`text-sm font-medium ${getPriorityConfig(selectedTask.priority).color}`}>
                                  {getPriorityConfig(selectedTask.priority).label}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Start Date</p>
                                <p className="font-medium">{new Date(selectedTask.startDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Due Date</p>
                                <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Assignee Info */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Assignment</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {selectedTask.assignee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{selectedTask.assignee.name}</p>
                                <p className="text-sm text-gray-600">{selectedTask.assignee.role}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Reporter</p>
                              <p className="font-medium">{selectedTask.reporter.name}</p>
                              <p className="text-sm text-gray-500">{selectedTask.reporter.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        
                        {/* Progress */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Progress</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Overall Progress</span>
                                <span className="text-lg font-bold text-gray-800">{selectedTask.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full ${selectedTask.project.color}`}
                                  style={{ width: `${selectedTask.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Subtasks Completed</p>
                              <p className="text-lg font-bold text-green-700">
                                {selectedTask.subtasks.filter(st => st.completed).length} / {selectedTask.subtasks.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Time Tracking */}
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Time Tracking</h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Estimated</p>
                                <p className="text-lg font-bold text-purple-700">{selectedTask.estimatedHours}h</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Logged</p>
                                <p className="text-lg font-bold text-purple-700">{selectedTask.loggedHours}h</p>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${Math.min((selectedTask.loggedHours / selectedTask.estimatedHours) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <button 
                              onClick={() => handleStartTimer(selectedTask.id)}
                              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Timer
                            </button>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTask.tags.map((tag, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtasks Tab */}
                {activeTab === 'subtasks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Subtasks</h3>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Subtask
                      </button>
                    </div>
                    <div className="space-y-3">
                      {selectedTask.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              readOnly
                            />
                            <span className={subtask.completed ? 'text-gray-500 line-through' : 'text-gray-800'}>
                              {subtask.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
                      <span className="text-sm text-gray-500">{selectedTask.comments.length} comments</span>
                    </div>
                    
                    {/* Add Comment */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <textarea
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Add Comment
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {selectedTask.comments.map(comment => (
                        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-800">{comment.author}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments Tab */}
                {activeTab === 'attachments' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Attachments</h3>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                        <Plus className="w-4 h-4 mr-1" />
                        Upload File
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTask.attachments.map(attachment => (
                        <div key={attachment.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-800">{attachment.name}</p>
                              <p className="text-sm text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Tracking Tab */}
                {activeTab === 'timetrack' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Time Summary */}
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Time Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Hours:</span>
                            <span className="font-bold">{selectedTask.estimatedHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Logged Hours:</span>
                            <span className="font-bold text-purple-700">{selectedTask.loggedHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-bold">{selectedTask.estimatedHours - selectedTask.loggedHours}h</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div 
                              className="bg-purple-600 h-3 rounded-full" 
                              style={{ width: `${Math.min((selectedTask.loggedHours / selectedTask.estimatedHours) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Timer Controls */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Timer</h3>
                        <div className="text-center space-y-4">
                          <div className="text-3xl font-bold text-gray-800">00:00:00</div>
                          <div className="flex justify-center space-x-2">
                            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg">
                              <Play className="w-5 h-5" />
                            </button>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg">
                              <Pause className="w-5 h-5" />
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg">
                              <Square className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Logs */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Time Logs</h3>
                      <div className="space-y-3">
                        {selectedTask.timeTracking.sessions.map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div>
                              <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-600">{session.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-700">{session.hours}h</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManage;