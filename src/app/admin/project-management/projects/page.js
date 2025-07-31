'use client'
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  Users,
  Clock,
  Target,
  Flag,
  MoreHorizontal,
  Star,
  Archive,
  Share2,
  Settings,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare,
  Paperclip,
  Eye,
  Edit3,
  Copy,
  Trash2,
  X,
  UserPlus,
  Building2,
  DollarSign,
  Timer,
  FileText,
  BarChart3,
  Activity,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Calendar,
  Milestone,
  Gantt,
  Timeline,
  Layers,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Receipt,
  TrendingDown
} from 'lucide-react';

const ProjectPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline, kanban
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  // Enhanced Mock project data with all key features
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Employee Management System',
      description: 'Complete HRMS solution with attendance tracking, payroll, and performance management',
      status: 'active',
      priority: 'high',
      progress: 75,
      dueDate: '2024-08-15',
      startDate: '2024-06-01',
      team: [
        { id: 1, name: 'Juan Cruz', avatar: '/api/placeholder/32/32', role: 'Project Manager', hourlyRate: 80, hoursWorked: 240 },
        { id: 2, name: 'Maria Santos', avatar: '/api/placeholder/32/32', role: 'Frontend Dev', hourlyRate: 65, hoursWorked: 200 },
        { id: 3, name: 'Jose Garcia', avatar: '/api/placeholder/32/32', role: 'Backend Dev', hourlyRate: 70, hoursWorked: 220 },
        { id: 4, name: 'Ana Reyes', avatar: '/api/placeholder/32/32', role: 'UI/UX Designer', hourlyRate: 60, hoursWorked: 180 }
      ],
      client: { 
        id: 1, 
        name: 'TechCorp Solutions', 
        contact: 'john.doe@techcorp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, Silicon Valley, CA'
      },
      tasks: { total: 45, completed: 34, inProgress: 8, todo: 3 },
      milestones: [
        { id: 1, name: 'Requirements Analysis', date: '2024-06-15', status: 'completed' },
        { id: 2, name: 'System Design', date: '2024-07-01', status: 'completed' },
        { id: 3, name: 'Development Phase 1', date: '2024-07-30', status: 'completed' },
        { id: 4, name: 'Testing & QA', date: '2024-08-10', status: 'in-progress' },
        { id: 5, name: 'Deployment', date: '2024-08-15', status: 'pending' }
      ],
      budget: {
        allocated: 150000,
        spent: 112500,
        remaining: 37500,
        expenses: [
          { category: 'Development', amount: 85000 },
          { category: 'Design', amount: 15000 },
          { category: 'Infrastructure', amount: 8500 },
          { category: 'Testing', amount: 4000 }
        ]
      },
      timeTracking: {
        totalHours: 840,
        billableHours: 756,
        currentWeekHours: 42,
        efficiency: 90
      },
      tags: ['Web Development', 'HRMS', 'React'],
      color: 'bg-blue-500',
      lastUpdate: '2024-07-16',
      attachments: 12,
      comments: 28,
      starred: true,
      communication: {
        lastClientContact: '2024-07-15',
        nextMeeting: '2024-07-20',
        messages: 45,
        callsScheduled: 3
      }
    },
    {
      id: 2,
      name: 'Mobile Time Tracker App',
      description: 'Cross-platform mobile application for employee time tracking with GPS and facial recognition',
      status: 'active',
      priority: 'medium',
      progress: 60,
      dueDate: '2024-09-20',
      startDate: '2024-07-01',
      team: [
        { id: 5, name: 'Carlos Lopez', avatar: '/api/placeholder/32/32', role: 'Mobile Dev', hourlyRate: 75, hoursWorked: 160 },
        { id: 6, name: 'Sofia Martinez', avatar: '/api/placeholder/32/32', role: 'UI Designer', hourlyRate: 55, hoursWorked: 120 },
        { id: 7, name: 'Diego Torres', avatar: '/api/placeholder/32/32', role: 'QA Engineer', hourlyRate: 50, hoursWorked: 80 }
      ],
      client: { 
        id: 2, 
        name: 'StartupX Inc', 
        contact: 'sarah@startupx.com',
        phone: '+1 (555) 987-6543',
        address: '456 Innovation Blvd, Austin, TX'
      },
      tasks: { total: 32, completed: 19, inProgress: 10, todo: 3 },
      milestones: [
        { id: 1, name: 'App Architecture', date: '2024-07-15', status: 'completed' },
        { id: 2, name: 'Core Features', date: '2024-08-15', status: 'in-progress' },
        { id: 3, name: 'GPS Integration', date: '2024-09-01', status: 'pending' },
        { id: 4, name: 'Beta Testing', date: '2024-09-15', status: 'pending' },
        { id: 5, name: 'App Store Release', date: '2024-09-20', status: 'pending' }
      ],
      budget: {
        allocated: 80000,
        spent: 48000,
        remaining: 32000,
        expenses: [
          { category: 'Development', amount: 36000 },
          { category: 'Design', amount: 8000 },
          { category: 'Testing', amount: 4000 }
        ]
      },
      timeTracking: {
        totalHours: 360,
        billableHours: 324,
        currentWeekHours: 35,
        efficiency: 88
      },
      tags: ['Mobile', 'React Native', 'GPS'],
      color: 'bg-emerald-500',
      lastUpdate: '2024-07-15',
      attachments: 8,
      comments: 15,
      starred: false,
      communication: {
        lastClientContact: '2024-07-14',
        nextMeeting: '2024-07-22',
        messages: 32,
        callsScheduled: 2
      }
    }
  ]);

  // Mock data for dropdowns
  const [employees] = useState([
    { id: 1, name: 'Juan Cruz', role: 'Project Manager', department: 'IT', hourlyRate: 80, available: true },
    { id: 2, name: 'Maria Santos', role: 'Frontend Developer', department: 'IT', hourlyRate: 65, available: true },
    { id: 3, name: 'Jose Garcia', role: 'Backend Developer', department: 'IT', hourlyRate: 70, available: true },
    { id: 4, name: 'Ana Reyes', role: 'UI/UX Designer', department: 'Design', hourlyRate: 60, available: false },
    { id: 5, name: 'Carlos Lopez', role: 'Mobile Developer', department: 'IT', hourlyRate: 75, available: true },
    { id: 6, name: 'Sofia Martinez', role: 'UI Designer', department: 'Design', hourlyRate: 55, available: true },
    { id: 7, name: 'Diego Torres', role: 'QA Engineer', department: 'QA', hourlyRate: 50, available: true },
    { id: 8, name: 'Isabel Ramos', role: 'Data Analyst', department: 'Analytics', hourlyRate: 58, available: true }
  ]);

  const [clients] = useState([
    { id: 1, name: 'TechCorp Solutions', contact: 'john.doe@techcorp.com', industry: 'Technology', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'StartupX Inc', contact: 'sarah@startupx.com', industry: 'Startup', phone: '+1 (555) 987-6543' },
    { id: 3, name: 'Enterprise Solutions Ltd', contact: 'mike@enterprise.com', industry: 'Enterprise', phone: '+1 (555) 456-7890' },
    { id: 4, name: 'Global Tech Partners', contact: 'alex@globaltech.com', industry: 'Technology', phone: '+1 (555) 321-0987' },
    { id: 5, name: 'SecureCorp Banking', contact: 'linda@securecorp.com', industry: 'Banking', phone: '+1 (555) 654-3210' }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    startDate: '',
    team: [],
    client: null,
    tags: '',
    color: 'bg-blue-500',
    budget: 0,
    milestones: []
  });

  const viewModes = [
    { id: 'grid', label: 'Grid', icon: Grid3X3 },
    { id: 'list', label: 'List', icon: List },
    { id: 'timeline', label: 'Timeline', icon: CalendarIcon },
    { id: 'kanban', label: 'Kanban', icon: Layers }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const statuses = [
    { value: 'planning', label: 'Planning', color: 'bg-gray-100 text-gray-600' },
    { value: 'active', label: 'Active', color: 'bg-blue-100 text-blue-600' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-100 text-yellow-600' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-600' }
  ];

  const projectColors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 
    'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'timeline', label: 'Timeline & Milestones', icon: Calendar },
    { id: 'tasks', label: 'Task Management', icon: CheckCircle2 },
    { id: 'team', label: 'Team Collaboration', icon: Users },
    { id: 'resources', label: 'Resource Allocation', icon: Briefcase },
    { id: 'client', label: 'Client Portal', icon: Building2 },
    { id: 'analytics', label: 'Project Analytics', icon: BarChart3 },
    { id: 'timetrack', label: 'Time Tracking', icon: Timer },
    { id: 'budget', label: 'Budget & Expenses', icon: DollarSign }
  ];

  const handleCreateProject = () => {
    const project = {
      id: projects.length + 1,
      ...newProject,
      status: 'planning',
      progress: 0,
      tasks: { total: 0, completed: 0, inProgress: 0, todo: 0 },
      lastUpdate: new Date().toISOString().split('T')[0],
      attachments: 0,
      comments: 0,
      starred: false,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      timeTracking: { totalHours: 0, billableHours: 0, currentWeekHours: 0, efficiency: 0 },
      communication: { lastClientContact: null, nextMeeting: null, messages: 0, callsScheduled: 0 }
    };
    setProjects([...projects, project]);
    setShowCreateModal(false);
    setNewProject({
      name: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      startDate: '',
      team: [],
      client: null,
      tags: '',
      color: 'bg-blue-500',
      budget: 0,
      milestones: []
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage > 90) return { color: 'text-red-600', status: 'Over Budget' };
    if (percentage > 75) return { color: 'text-yellow-600', status: 'Near Limit' };
    return { color: 'text-green-600', status: 'On Track' };
  };

  const getMilestoneStatus = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'in-progress': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const ProjectCard = ({ project }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${project.color}`}></div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status).color}`}>
          {getStatusBadge(project.status).label}
        </span>
        <div className="flex items-center space-x-2">
          <Flag className={`w-4 h-4 ${getPriorityColor(project.priority)}`} />
          <span className={`text-xs font-medium capitalize ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-800">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${project.color}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Budget Overview */}
      {project.budget && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Budget</span>
            <span className={`text-xs font-medium ${getBudgetStatus(project.budget).color}`}>
              {getBudgetStatus(project.budget).status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">{formatCurrency(project.budget.spent)}</span>
            <span className="text-sm text-gray-600">of {formatCurrency(project.budget.allocated)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-green-600 h-1 rounded-full" 
              style={{ width: `${(project.budget.spent / project.budget.allocated) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Time Tracking */}
      {project.timeTracking && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Time Tracking</span>
            <span className="text-xs text-blue-600 font-medium">{project.timeTracking.efficiency}% Efficiency</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-sm font-bold text-blue-700">{project.timeTracking.totalHours}h</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-sm font-bold text-green-700">{project.timeTracking.billableHours}h</p>
              <p className="text-xs text-gray-600">Billable</p>
            </div>
          </div>
        </div>
      )}

      {/* Client Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">{project.client.name}</p>
            <p className="text-xs text-gray-600">{project.client.contact}</p>
          </div>
        </div>
      </div>

      {/* Milestones Progress */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Milestones</span>
            <span className="text-xs text-gray-500">
              {project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {project.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`h-2 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                title={milestone.name}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Team</span>
          <span className="text-xs text-gray-500">{project.team.length} members</span>
        </div>
        <div className="flex -space-x-2">
          {project.team.slice(0, 4).map((member, index) => (
            <div
              key={member.id}
              className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
              title={`${member.name} - ${member.role}`}
            >
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
          {project.team.length > 4 && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
              +{project.team.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Task Summary */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 p-2 rounded">
            <p className="text-xs text-green-600 font-medium">Done</p>
            <p className="text-sm font-bold text-green-700">{project.tasks.completed}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-blue-600 font-medium">In Progress</p>
            <p className="text-sm font-bold text-blue-700">{project.tasks.inProgress}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-600 font-medium">To Do</p>
            <p className="text-sm font-bold text-gray-700">{project.tasks.todo}</p>
          </div>
        </div>
      </div>

      {/* Communication Status */}
      {project.communication && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Client Communication</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xs text-gray-600">
            <p>Last contact: {project.communication.lastClientContact ? new Date(project.communication.lastClientContact).toLocaleDateString() : 'Never'}</p>
            <p>Messages: {project.communication.messages} | Calls: {project.communication.callsScheduled}</p>
          </div>
        </div>
      )}

      {/* Due Date */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formatDueDate(project.dueDate)}</span>
        </div>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{project.tags.length - 3}
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
            <span>{project.comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Paperclip className="w-3 h-3" />
            <span>{project.attachments}</span>
          </div>
        </div>
        <span>Updated {new Date(project.lastUpdate).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={() => setSelectedProject(project)}
          className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        <button className="flex-1 bg-white/50 hover:bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button className="bg-white/50 hover:bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const statusConfig = statuses.find(s => s.value === status);
    return statusConfig ? statusConfig : { color: 'bg-gray-100 text-gray-600', label: status };
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.color : 'text-gray-600';
  };

  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  // Calculate project statistics
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget?.allocated || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.budget?.spent || 0), 0);
  const totalHours = projects.reduce((sum, p) => sum + (p.timeTracking?.totalHours || 0), 0);
  const avgEfficiency = projects.reduce((sum, p) => sum + (p.timeTracking?.efficiency || 0), 0) / projects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Enhanced Project Management
              </h1>
              <p className="text-gray-600 mt-1">Complete project lifecycle management with timeline, budget, and team collaboration</p>
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
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-gray-800">{projects.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-gray-800">{projects.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-gray-800">{totalHours}h</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                <Timer className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Efficiency</p>
                <p className="text-3xl font-bold text-gray-800">{Math.round(avgEfficiency)}%</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
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
              </div>
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
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started with comprehensive project management.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create First Project
            </button>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${selectedProject.color}`}></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-200">
                {tabs.map(tab => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                      {/* Project Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Project Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedProject.status).color}`}>
                              {getStatusBadge(selectedProject.status).label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <span className={`font-medium ${getPriorityColor(selectedProject.priority)}`}>
                              {selectedProject.priority}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Progress:</span>
                            <span className="font-medium">{selectedProject.progress}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium">{new Date(selectedProject.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Client Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{selectedProject.client.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span>{selectedProject.client.contact}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span>{selectedProject.client.phone}</span>
                          </div>
                          {selectedProject.client.address && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="text-xs">{selectedProject.client.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Quick Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Team Size</span>
                            <span className="font-bold text-lg">{selectedProject.team.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Tasks</span>
                            <span className="font-bold text-lg">{selectedProject.tasks.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Milestones</span>
                            <span className="font-bold text-lg">{selectedProject.milestones?.length || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Comments</span>
                            <span className="font-bold text-lg">{selectedProject.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Progress Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                            {selectedProject.tasks.completed}
                          </div>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                            {selectedProject.tasks.inProgress}
                          </div>
                          <p className="text-sm text-gray-600">In Progress</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                            {selectedProject.tasks.todo}
                          </div>
                          <p className="text-sm text-gray-600">To Do</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                            {selectedProject.progress}%
                          </div>
                          <p className="text-sm text-gray-600">Overall</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline & Milestones Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Project Timeline
                      </h3>
                      <div className="space-y-4">
                        {selectedProject.milestones?.map((milestone, index) => (
                          <div key={milestone.id} className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-500' :
                              milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{milestone.name}</h4>
                              <p className="text-sm text-gray-600">{new Date(milestone.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMilestoneStatus(milestone.status)}`}>
                              {milestone.status.replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget & Expenses Tab */}
                {activeTab === 'budget' && selectedProject.budget && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Budget Overview */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Wallet className="w-5 h-5 mr-2" />
                          Budget Overview
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Allocated</span>
                            <span className="font-bold text-lg">{formatCurrency(selectedProject.budget.allocated)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Spent</span>
                            <span className="font-bold text-lg text-red-600">{formatCurrency(selectedProject.budget.spent)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-bold text-lg text-green-600">{formatCurrency(selectedProject.budget.remaining)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full" 
                              style={{ width: `${(selectedProject.budget.spent / selectedProject.budget.allocated) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-center">
                            <span className={`font-medium ${getBudgetStatus(selectedProject.budget).color}`}>
                              {getBudgetStatus(selectedProject.budget).status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expense Breakdown */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Receipt className="w-5 h-5 mr-2" />
                          Expense Breakdown
                        </h3>
                        <div className="space-y-3">
                          {selectedProject.budget.expenses.map((expense, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-700">{expense.category}</span>
                              <span className="font-medium">{formatCurrency(expense.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Collaboration Tab */}
                {activeTab === 'team' && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Team Members
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.team.map(member => (
                          <div key={member.id} className="bg-white rounded-lg p-4 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span>Rate: {formatCurrency(member.hourlyRate)}/hr</span>
                                <span>Hours: {member.hoursWorked}h</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Tracking Tab */}
                {activeTab === 'timetrack' && selectedProject.timeTracking && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Time Overview */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Timer className="w-5 h-5 mr-2" />
                          Time Overview
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Hours</span>
                            <span className="font-bold">{selectedProject.timeTracking.totalHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Billable Hours</span>
                            <span className="font-bold text-green-600">{selectedProject.timeTracking.billableHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">This Week</span>
                            <span className="font-bold">{selectedProject.timeTracking.currentWeekHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Efficiency</span>
                            <span className="font-bold text-blue-600">{selectedProject.timeTracking.efficiency}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Team Time Distribution */}
                      <div className="md:col-span-2 bg-green-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Team Time Distribution</h3>
                        <div className="space-y-3">
                          {selectedProject.team.map(member => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-gray-700">{member.name}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">{member.hoursWorked}h</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(member.hoursWorked / Math.max(...selectedProject.team.map(m => m.hoursWorked))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client Communication Tab */}
                {activeTab === 'client' && selectedProject.communication && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Client Communication
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Contact</span>
                            <span className="font-medium">
                              {selectedProject.communication.lastClientContact ? 
                                new Date(selectedProject.communication.lastClientContact).toLocaleDateString() : 
                                'Never'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Meeting</span>
                            <span className="font-medium">
                              {selectedProject.communication.nextMeeting ? 
                                new Date(selectedProject.communication.nextMeeting).toLocaleDateString() : 
                                'Not scheduled'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Messages</span>
                            <span className="font-medium">{selectedProject.communication.messages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scheduled Calls</span>
                            <span className="font-medium">{selectedProject.communication.callsScheduled}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </button>
                            <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              Schedule Call
                            </button>
                            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-600 transition-colors flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Meeting
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Performance Metrics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-bold text-lg">{Math.round((selectedProject.tasks.completed / selectedProject.tasks.total) * 100)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">On-Time Delivery</span>
                            <span className="font-bold text-lg text-green-600">95%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Budget Utilization</span>
                            <span className="font-bold text-lg">{Math.round((selectedProject.budget.spent / selectedProject.budget.allocated) * 100)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Team Productivity</span>
                            <span className="font-bold text-lg text-blue-600">{selectedProject.timeTracking.efficiency}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Trend Analysis
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Progress Velocity</span>
                            <div className="flex items-center">
                              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                              <span className="font-bold text-green-600">+12%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Cost Efficiency</span>
                            <div className="flex items-center">
                              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                              <span className="font-bold text-green-600">+8%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Quality Score</span>
                            <div className="flex items-center">
                              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                              <span className="font-bold text-green-600">+5%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Client Satisfaction</span>
                            <div className="flex items-center">
                              <span className="font-bold text-blue-600">4.8/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Project Timeline & Progress</h3>
                      <div className="h-64 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Interactive Timeline Chart</p>
                          <p className="text-sm text-gray-500">Gantt chart with milestone tracking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the project goals and objectives"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({...newProject, budget: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select
                    value={newProject.client?.id || ''}
                    onChange={(e) => {
                      const selectedClient = clients.find(client => client.id === parseInt(e.target.value));
                      setNewProject({...newProject, client: selectedClient || null});
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name} - {client.industry}</option>
                    ))}
                  </select>
                  
                  {newProject.client && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">{newProject.client.name}</p>
                          <p className="text-xs text-blue-700">{newProject.client.contact}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <div className="space-y-3">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const selectedEmployee = employees.find(emp => emp.id === parseInt(e.target.value));
                          if (selectedEmployee && !newProject.team.find(member => member.id === selectedEmployee.id)) {
                            setNewProject({
                              ...newProject,
                              team: [...newProject.team, selectedEmployee]
                            });
                            e.target.value = '';
                          }
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Add team member</option>
                      {employees
                        .filter(emp => !newProject.team.find(member => member.id === emp.id))
                        .map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role} ({employee.department}) - {formatCurrency(employee.hourlyRate)}/hr
                          </option>
                        ))}
                    </select>
                    
                    {newProject.team.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Selected team members:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {newProject.team.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                  <p className="text-xs text-gray-600">{member.role} - {formatCurrency(member.hourlyRate)}/hr</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setNewProject({
                                  ...newProject,
                                  team: newProject.team.filter(m => m.id !== member.id)
                                })}
                                className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Color</label>
                  <div className="flex space-x-2">
                    {projectColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewProject({...newProject, color})}
                        className={`w-8 h-8 rounded-full ${color} border-2 ${
                          newProject.color === color ? 'border-gray-800' : 'border-gray-200'
                        } transition-all duration-200 transform hover:scale-110`}
                      />
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tags separated by commas (e.g. Web Development, React, API)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProject.name || !newProject.client}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;