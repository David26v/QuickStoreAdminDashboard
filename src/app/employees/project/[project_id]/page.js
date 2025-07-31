// app/users/projects/[project_id]/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"; // For task selection
import { Progress } from "@/components/ui/progress"; // For task progress

// Import Lucide React Icons
import {
  Send,
  Folder,
  Calendar,
  User,
  Users,
  CheckCircle,
  Circle,
  Star,
  Bell,
  Settings,
  Home,
  TrendingUp,
  FileText,
  MessageCircle,
  Edit3,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  Clock,
  AlertCircle,
  Flag,
  Filter,
  ListOrdered,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react';

// --- Mock Data ---
const mockProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website.",
    color: "bg-blue-500",
    isFavorite: true,
    tasksCompleted: 12,
    totalTasks: 20,
    dueDate: "2024-07-15",
    status: "in-progress",
    startDate: "2024-05-01",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description: "Development and launch of the new customer mobile app.",
    color: "bg-purple-500",
    isFavorite: false,
    tasksCompleted: 5,
    totalTasks: 30,
    dueDate: "2024-08-20",
    status: "planning",
    startDate: "2024-06-01",
  },
  {
    id: 3,
    name: "Q3 Marketing Campaign",
    description: "Plan and execute the quarterly marketing initiatives.",
    color: "bg-amber-500",
    isFavorite: true,
    tasksCompleted: 8,
    totalTasks: 15,
    dueDate: "2024-09-01",
    status: "on-hold",
    startDate: "2024-07-01",
  },
  {
    id: 4,
    name: "Internal Process Optimization",
    description: "Streamline internal workflows for better efficiency.",
    color: "bg-emerald-500",
    isFavorite: false,
    tasksCompleted: 0,
    totalTasks: 10,
    dueDate: "2024-07-30",
    status: "planning",
    startDate: "2024-06-15",
  },
];

const mockMembers = [
  { id: 1, name: "You", role: "Project Manager", avatar: null },
  { id: 2, name: "Alex Johnson", role: "Developer", avatar: null },
  { id: 3, name: "Sam Smith", role: "Designer", avatar: null },
  { id: 4, name: "Jamie Lee", role: "QA Engineer", avatar: null },
];

const mockTasks = [
  { id: 101, projectId: 1, title: "Design Homepage Wireframes", status: "done", priority: "high", assigneeId: 3, dueDate: "2024-06-12", description: "Create initial wireframes for the new homepage layout." },
  { id: 102, projectId: 1, title: "Develop Homepage Hero Section", status: "in-progress", priority: "high", assigneeId: 2, dueDate: "2024-06-18", description: "Code the hero section based on approved designs." },
  { id: 103, projectId: 1, title: "Write Homepage Copy", status: "todo", priority: "medium", assigneeId: 1, dueDate: "2024-06-15", description: "Draft compelling copy for the hero section and key features." },
  { id: 104, projectId: 1, title: "Setup Analytics", status: "todo", priority: "low", assigneeId: 2, dueDate: "2024-06-25", description: "Integrate Google Analytics or similar tool." },
  { id: 105, projectId: 1, title: "Review Accessibility", status: "in-progress", priority: "medium", assigneeId: 4, dueDate: "2024-06-20", description: "Ensure the new design meets WCAG standards." },
  { id: 106, projectId: 2, title: "Define App Requirements", status: "todo", priority: "high", assigneeId: 1, dueDate: "2024-06-22", description: "Gather and document all functional requirements." },
  { id: 107, projectId: 2, title: "Create App Mockups", status: "todo", priority: "high", assigneeId: 3, dueDate: "2024-06-30", description: "Design detailed UI mockups for main screens." },
];

const initialMessages = [
  { id: 1, userId: 2, userName: "Alex Johnson", message: "Homepage wireframes are ready for review.", timestamp: "2024-06-10T10:00:00Z" },
  { id: 2, userId: 1, userName: "You", message: "Thanks Alex, I'll check them out shortly.", timestamp: "2024-06-10T10:15:00Z" },
  { id: 3, userId: 3, userName: "Sam Smith", message: "The color palette has been updated in Figma.", timestamp: "2024-06-10T11:30:00Z" },
  { id: 4, userId: 1, userName: "You", message: "Looking good so far! Let's aim to finalize the design by Friday.", timestamp: "2024-06-10T14:00:00Z" },
];

const mockActivity = [
  { id: 1, userId: 2, userName: "Alex Johnson", action: "updated task", item: "Develop Homepage Hero Section", timestamp: "2024-06-10T15:00:00Z" },
  { id: 2, userId: 3, userName: "Sam Smith", action: "commented on", item: "Project Chat", timestamp: "2024-06-10T14:30:00Z" },
  { id: 3, userId: 1, userName: "You", action: "created task", item: "Review Accessibility", timestamp: "2024-06-10T11:00:00Z" },
  { id: 4, userId: 4, userName: "Jamie Lee", action: "started work on", item: "Homepage Wireframes", timestamp: "2024-06-10T09:45:00Z" },
];
// --- End Mock Data ---

const ViewPage = () => {
  const params = useParams();
  const projectId = parseInt(params.project_id);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  // --- Task Management State ---
  const [tasks, setTasks] = useState([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(1); // Default to 'You'
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [selectedTaskId, setSelectedTaskId] = useState(null); // For viewing task details
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [taskSortBy, setTaskSortBy] = useState('status'); // Default sort

  // --- Simulate Role-Based Access ---
  const isProjectManager = project?.id === 1; // Placeholder logic

  // --- Simulate Data Fetching ---
  useEffect(() => {
    const foundProject = mockProjects.find(p => p.id === projectId);
    const projectTasks = mockTasks.filter(t => t.projectId === projectId);
    if (foundProject) {
      setProject(foundProject);
      setNewStatus(foundProject.status || 'todo');
      setEditedDescription(foundProject.description);
      setTasks(projectTasks);
    } else {
      console.warn(`Project with ID ${projectId} not found.`);
    }
  }, [projectId]);

  // --- Handlers ---
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !project) return;
    const newMsg = {
      id: messages.length + 1,
      userId: 1,
      userName: "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleUpdateStatus = () => {
    if (!project || !newStatus) return;
    console.log(`Updating project ${project.id} status to:`, newStatus);
    setProject(prevProject => ({ ...prevProject, status: newStatus }));
    setIsEditStatusModalOpen(false);
    alert(`Project status updated to '${getStatusDisplayText(newStatus)}'! (Simulated)`);
  };

  const handleSaveDescription = () => {
    if (!project) return;
    console.log(`Updating project ${project.id} description to:`, editedDescription);
    setProject(prevProject => ({ ...prevProject, description: editedDescription }));
    setIsEditingDescription(false);
    alert(`Project description updated! (Simulated)`);
  };

  // --- Task Handlers ---
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: tasks.length + 1000, // Simple ID for mock
      projectId: project.id,
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      priority: newTaskPriority,
      assigneeId: parseInt(newTaskAssigneeId),
      dueDate: newTaskDueDate || null,
    };
    setTasks([...tasks, newTask]);
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssigneeId(1);
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
    setIsCreateTaskModalOpen(false);
    alert(`Task '${newTask.title}' created! (Simulated)`);
  };

  const openTaskDetail = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  const closeTaskDetail = () => {
    setIsTaskDetailModalOpen(false);
    setSelectedTaskId(null);
  };

  // --- Helper Functions ---
  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Flag className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'low': return <Circle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };


  const sortedTasks = [...tasks].sort((a, b) => {
    if (taskSortBy === 'status') {
      const statusOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'done': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    } else if (taskSortBy === 'priority') {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (taskSortBy === 'dueDate') {
        // Handle null dates by putting them last
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0; // Default no sort
  });

  if (!project) {
    return <div className="p-6">Loading project or project not found...</div>;
  }

  // Get selected task details for modal
  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedTaskAssignee = mockMembers.find(m => m.id === selectedTask?.assigneeId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb/Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/users/project" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full ${project.color} mr-3`}></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Folder className="h-7 w-7 text-blue-500" />
                  {project.name}
                  {project.isFavorite && <Star className="h-5 w-5 text-amber-500 fill-current" />}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusDisplayText(project.status)}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {project.tasksCompleted} of {project.totalTasks} tasks completed
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isProjectManager && (
                <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Project Status</DialogTitle>
                      <DialogDescription>
                        Change the current status of the project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="status" className="block mb-2">
                        Status
                      </Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditStatusModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateStatus}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Dialog open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to the {project.name} project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title *
                      </Label>
                      <Input
                        id="title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="col-span-3"
                        placeholder="What needs to be done?"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        className="col-span-3"
                        placeholder="Add details..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignee" className="text-right">
                        Assignee
                      </Label>
                      <Select value={newTaskAssigneeId.toString()} onValueChange={setNewTaskAssigneeId}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockMembers.map(member => (
                            <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="due-date" className="text-right">
                        Due Date
                      </Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Set priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area - Project Details, Tasks, Chat */}
          <div className="flex-grow space-y-6">
            {/* Project Details Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Project Details
                  {isProjectManager && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingDescription(!isEditingDescription)}
                      className="text-xs"
                    >
                      <Edit3 className="mr-1 h-3 w-3" />
                      {isEditingDescription ? 'Cancel' : 'Edit'}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingDescription ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingDescription(false)}>Cancel</Button>
                      <Button onClick={handleSaveDescription}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="font-medium">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Progress</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.totalTasks > 0 ? (project.tasksCompleted / project.totalTasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{Math.round((project.tasksCompleted / project.totalTasks) * 100) || 0}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Tasks ({tasks.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                  <Select value={taskSortBy} onValueChange={setTaskSortBy}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {sortedTasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[150px]">Assignee</TableHead>
                        <TableHead className="w-[120px]">Due Date</TableHead>
                        <TableHead className="w-[80px] text-right">Priority</TableHead>
                        <TableHead className="w-[50px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTasks.map((task) => {
                        const assignee = mockMembers.find(m => m.id === task.assigneeId);
                        return (
                          <TableRow key={task.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => openTaskDetail(task.id)}>
                            <TableCell>
                              <Badge className={`${getStatusColor(task.status)} text-xs`} variant="secondary">
                                {getStatusDisplayText(task.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="text-xs">{assignee?.name.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs truncate">{assignee?.name || 'Unassigned'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className={getPriorityColor(task.priority)}>
                                      {getPriorityIcon(task.priority)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openTaskDetail(task.id); }}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CheckCircle className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No tasks yet.</p>
                    <p className="text-sm mt-1">Get started by creating a new task.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Project Chat
                </CardTitle>
                <CardDescription>
                  Discuss this project with your team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[400px]">
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.userName === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.userName === 'You' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          <div className="flex items-center mb-1">
                            {msg.userName !== 'You' && (
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="text-xs">{msg.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <span className="font-medium text-sm">{msg.userName}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-grow mr-2"
                    />
                    <Button onClick={handleSendMessage} size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Project Info, Members, etc. */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Project Info Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5 text-indigo-500" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project ID</p>
                  <p className="text-sm">{project.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created</p>
                  <p className="text-sm">{project.startDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Deadline</p>
                  <p className="text-sm">{project.dueDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Members ({mockMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="ml-2">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" className="w-full mt-4 text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    {mockActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <Avatar className="h-7 w-7 mr-2 mt-0.5">
                          <AvatarFallback className="text-xs">{activity.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.userName}</span> {activity.action} <span className="font-medium">{activity.item}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Dialog open={isTaskDetailModalOpen} onOpenChange={setIsTaskDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              Task details for project {project?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedTask.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={`${getStatusColor(selectedTask.status)} mt-1`}>
                    {getStatusDisplayText(selectedTask.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <div className="flex items-center mt-1">
                    <span className={`mr-2 ${getPriorityColor(selectedTask.priority)}`}>
                      {getPriorityIcon(selectedTask.priority)}
                    </span>
                    <span>{selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Assignee</Label>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">{selectedTaskAssignee?.name.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTaskAssignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="mt-1">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date'}</p>
                </div>
              </div>
              {/* Placeholder for comments, subtasks, etc. */}
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Comments</h4>
                <p className="text-sm text-muted-foreground">Comments section would go here.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeTaskDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewPage;