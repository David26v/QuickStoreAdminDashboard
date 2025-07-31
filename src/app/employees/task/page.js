// app/users/my-tasks/page.jsx (or .js)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
// --- Import Tabs ---
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// Import Lucide React Icons
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Flag,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  User,
  Filter,
  ListOrdered,
  ChevronDown,
  ArrowLeft,
  Folder,
  Clock,
  TrendingUp,
  List, // For List Icon
  LayoutGrid, // For Grid/Card Icon
} from 'lucide-react';
import { useDialog } from '@/components/providers/DialogProvider';

// --- Import useDialog ---


// --- Mock Data ---
// ... (mock data remains the same as in the previous HTML5 DnD version)
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
  { id: 101, projectId: 1, title: "Design Homepage Wireframes", status: "done", priority: "high", assigneeId: 1, dueDate: "2024-06-12", description: "Create initial wireframes for the new homepage layout." },
  { id: 102, projectId: 1, title: "Develop Homepage Hero Section", status: "in-progress", priority: "high", assigneeId: 1, dueDate: "2024-06-18", description: "Code the hero section based on approved designs." },
  { id: 103, projectId: 1, title: "Write Homepage Copy", status: "todo", priority: "medium", assigneeId: 1, dueDate: "2024-06-15", description: "Draft compelling copy for the hero section and key features." },
  { id: 104, projectId: 1, title: "Setup Analytics", status: "todo", priority: "low", assigneeId: 2, dueDate: "2024-06-25", description: "Integrate Google Analytics or similar tool." },
  { id: 105, projectId: 1, title: "Review Accessibility", status: "in-progress", priority: "medium", assigneeId: 4, dueDate: "2024-06-20", description: "Ensure the new design meets WCAG standards." },
  { id: 106, projectId: 2, title: "Define App Requirements", status: "todo", priority: "high", assigneeId: 1, dueDate: "2024-06-22", description: "Gather and document all functional requirements." },
  { id: 107, projectId: 2, title: "Create App Mockups", status: "todo", priority: "high", assigneeId: 3, dueDate: "2024-06-30", description: "Design detailed UI mockups for main screens." },
  { id: 108, projectId: 3, title: "Draft Social Media Posts", status: "in-progress", priority: "medium", assigneeId: 1, dueDate: "2024-06-19", description: "Write copy for the upcoming campaign." },
  { id: 109, projectId: 4, title: "Map Current Workflow", status: "todo", priority: "high", assigneeId: 1, dueDate: "2024-06-28", description: "Document the steps in the current process." },
];


const MyTaskPage = () => {

  const currentUserId = 1; 

  const [userTasks, setUserTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all'); 
  const [taskSortBy, setTaskSortBy] = useState('dueDate');
  // --- State for Board View DnD ---
  const [boardTasks, setBoardTasks] = useState({});

  // --- Use the custom dialog hook ---
  const { showConfirm, showSuccess, showError } = useDialog();

  // --- Simulate Data Fetching ---
  useEffect(() => {
    const tasksForUser = mockTasks.filter(task => task.assigneeId === currentUserId);
    setUserTasks(tasksForUser);
    setFilteredTasks(tasksForUser);
  }, [currentUserId]);


  useEffect(() => {
    let result = [...userTasks];

    if (taskFilter !== 'all') {
        result = result.filter(task => task.status === taskFilter);
    }

    result.sort((a, b) => {
        if (taskSortBy === 'dueDate') {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (taskSortBy === 'priority') {
             const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
             return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (taskSortBy === 'project') {
             if (a.projectId !== b.projectId) {
                 return a.projectId - b.projectId;
             }
             const statusOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'done': 4 };
             return statusOrder[a.status] - statusOrder[b.status];
        }
        return 0;
    });

    setFilteredTasks(result);
  }, [userTasks, taskFilter, taskSortBy]);

  // Prepare tasks for Board View (grouped by status)
  useEffect(() => {
    const initialBoardTasks = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
    };

    let tasksToDisplay = [...userTasks];
    if (taskFilter !== 'all') {
        tasksToDisplay = tasksToDisplay.filter(task => task.status === taskFilter);
    }

    tasksToDisplay.forEach(task => {
        if (initialBoardTasks.hasOwnProperty(task.status)) {
            initialBoardTasks[task.status].push(task);
        } else {
            console.warn(`Task ${task.id} has unexpected status: ${task.status}`);
            initialBoardTasks['todo'].push(task);
        }
    });

    setBoardTasks(initialBoardTasks);
  }, [userTasks, taskFilter]);


  // --- Handlers ---
  const openTaskDetail = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  const closeTaskDetail = () => {
    setIsTaskDetailModalOpen(false);
    setSelectedTaskId(null);
  };

  // --- HTML5 Drag and Drop Handlers ---
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
    e.target.classList.add('opacity-50', 'rotate-1');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50', 'rotate-1');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData("text/plain");
    let draggedTask;
    try {
        draggedTask = JSON.parse(taskData);
    } catch (err) {
        console.error("Failed to parse dragged task ", err);
        return;
    }

    if (draggedTask.status === newStatus) {
        return;
    }

    const oldStatusText = getStatusDisplayText(draggedTask.status);
    const newStatusText = getStatusDisplayText(newStatus);

    // Use showConfirm dialog before changing status
    showConfirm({
      title: "Change Task Status",
      description: `Are you sure you want to move the task "${draggedTask.title}" from "${oldStatusText}" to "${newStatusText}"?`,
      confirmText: "Move",
      cancelText: "Cancel",
      onConfirm: () => {
        performStatusChange(draggedTask, newStatus);
        showSuccess(`Task moved to '${newStatusText}'!`); // Optional success feedback
      },
      onCancel: () => {
         // Optionally provide feedback if user cancels
         // console.log("Status change cancelled by user");
      }
    });
  };

  // --- Handler for Status Change in Modal ---
  const handleChangeTaskStatus = (newStatus) => {
    if (!selectedTaskId || !newStatus) return;

    const taskToUpdate = userTasks.find(t => t.id === selectedTaskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return; // No change

    const oldStatusText = getStatusDisplayText(taskToUpdate.status);
    const newStatusText = getStatusDisplayText(newStatus);

    // Use showConfirm dialog before changing status
    showConfirm({
      title: "Change Task Status",
      description: `Are you sure you want to change the status of "${taskToUpdate.title}" from "${oldStatusText}" to "${newStatusText}"?`,
      confirmText: "Change",
      cancelText: "Cancel",
      onConfirm: () => {
        performStatusChange(taskToUpdate, newStatus);
        closeTaskDetail(); // Close modal after successful change
        showSuccess(`Task status updated to '${newStatusText}'!`); // Optional success feedback
      },
      onCancel: () => {
         // Optionally provide feedback if user cancels
         // console.log("Status change cancelled by user");
      }
    });
  };

  // --- Centralized function to perform the actual status update ---
  const performStatusChange = (taskToUpdate, newStatus) => {
    const updatedTask = { ...taskToUpdate, status: newStatus };

    // Update boardTasks state for UI consistency
    setBoardTasks(prev => {
        const newBoardTasks = { ...prev };
        // Remove from old column
        newBoardTasks[taskToUpdate.status] = newBoardTasks[taskToUpdate.status].filter(t => t.id !== taskToUpdate.id);
        // Add to new column
        if (newBoardTasks[newStatus]) {
            newBoardTasks[newStatus].push(updatedTask);
        }
        return newBoardTasks;
    });

    // Update main userTasks list
    setUserTasks(prevTasks =>
        prevTasks.map(task =>
            task.id === taskToUpdate.id ? updatedTask : task
        )
    );
    // Note: The simulated API call alert is removed as the dialog provides feedback
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

  // --- Task Card View Helpers ---
  const statusColumns = [
    { id: 'todo', title: 'To Do', colorClass: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'in-progress', title: 'In Progress', colorClass: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'review', title: 'Review', colorClass: 'bg-amber-100 dark:bg-amber-900/20' },
    { id: 'done', title: 'Done', colorClass: 'bg-green-100 dark:bg-green-900/20' },
  ];

  // Get selected task details for modal
  const selectedTask = userTasks.find(t => t.id === selectedTaskId); // Use userTasks for modal
  const selectedTaskProject = mockProjects.find(p => p.id === selectedTask?.projectId);
  const selectedTaskAssignee = mockMembers.find(m => m.id === selectedTask?.assigneeId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-8xl mx-auto"> {/* Slightly wider max width */}
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-6 h-6 rounded-full mr-3"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   My Tasks
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tasks assigned to you across all projects.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Filter:</span>
                <Select value={taskFilter} onValueChange={setTaskFilter}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">Sort by:</span>
                  <Select value={taskSortBy} onValueChange={setTaskSortBy}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area - Tabs for Task Views */}
          <div className="flex-grow min-w-0"> {/* min-w-0 prevents flex items from overflowing */}
            {/* Tabs for Tasks */}
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center justify-center gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="board" className="flex items-center justify-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Board View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="mt-0">
                 <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Your Tasks ({filteredTasks.length})
                    </CardTitle>
                    <CardDescription>
                      Manage and track your assigned tasks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredTasks.length > 0 ? (
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Due Date</th>
                            <th className="px-4 py-3 text-right">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map((task) => {
                            const project = mockProjects.find(p => p.id === task.projectId);
                            const assignee = mockMembers.find(m => m.id === task.assigneeId);
                            return (
                              <tr key={task.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => openTaskDetail(task.id)}>
                                <td className="px-4 py-3">
                                  <Badge className={`${getStatusColor(task.status)} text-xs`} variant="secondary">
                                    {getStatusDisplayText(task.status)}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 font-medium">{task.title}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    {project && (
                                      <>
                                        <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                                        <span className="text-xs truncate">{project.name}</span>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                </td>
                                <td className="px-4 py-3 text-right">
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
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="mx-auto h-12 w-12 opacity-50 mb-2" />
                        <p>No tasks found matching your criteria.</p>
                        <p className="text-sm mt-1">You're all caught up or filters are too specific.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="board" className="mt-0">
                <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-purple-500" />
                      My Task Board
                    </CardTitle>
                    <CardDescription>
                      Drag and drop tasks to update their status. Filters apply here too.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Board View with HTML5 DnD */}
                    {Object.keys(boardTasks).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2">
                        {statusColumns.map((column) => (
                          <div
                            key={column.id}
                            className={`rounded-lg border ${column.colorClass} border-gray-200 dark:border-gray-700 flex flex-col h-[500px]`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                          >
                            <div className="p-3 font-semibold text-sm flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${column.id === 'todo' ? 'bg-gray-400' : column.id === 'in-progress' ? 'bg-blue-500' : column.id === 'review' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              {column.title} <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">{boardTasks[column.id]?.length || 0}</span>
                            </div>
                            <ScrollArea className="flex-grow p-2">
                              <div
                                className="space-y-3 min-h-[10px] transition-colors duration-200"
                                style={{ minHeight: '50px' }} // Ensure drop zone is visible
                              >
                                {boardTasks[column.id]?.map((task) => {
                                  const project = mockProjects.find(p => p.id === task.projectId);
                                  const assignee = mockMembers.find(m => m.id === task.assigneeId);
                                  return (
                                    <div
                                      key={task.id}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, task)}
                                      onDragEnd={handleDragEnd}
                                      className="cursor-grab active:cursor-grabbing" // Visual cues
                                      onClick={() => openTaskDetail(task.id)} // Open modal on click
                                    >
                                      <Card className="shadow-sm border border-gray-200 dark:border-gray-700 text-xs hover:shadow-md transition-shadow">
                                        <CardHeader className="p-3">
                                          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0">
                                          <div className="flex justify-between items-center mb-2">
                                            <Badge className={`${getStatusColor(task.status)} text-xs`} variant="secondary">
                                              {getStatusDisplayText(task.status)}
                                            </Badge>
                                            <span className={getPriorityColor(task.priority)}>
                                              {getPriorityIcon(task.priority)}
                                            </span>
                                          </div>
                                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            {project && (
                                              <>
                                                <div className={`w-2 h-2 rounded-full ${project.color} mr-1`}></div>
                                                <span className="truncate">{project.name}</span>
                                              </>
                                            )}
                                          </div>
                                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <LayoutGrid className="mx-auto h-12 w-12 opacity-50 mb-2" />
                        <p>Loading board...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Quick Stats / Upcoming */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6"> {/* Increased width slightly */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Task Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</span>
                    <span className="text-sm font-medium">{userTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">To Do</span>
                    <span className="text-sm font-medium">
                      {userTasks.filter(t => t.status === 'todo').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                    <span className="text-sm font-medium">
                      {userTasks.filter(t => t.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Review</span>
                    <span className="text-sm font-medium">
                      {userTasks.filter(t => t.status === 'review').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
                    <span className="text-sm font-medium">
                      {userTasks.filter(t => t.status === 'done').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                  {userTasks
                    .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map(task => {
                      const project = mockProjects.find(p => p.id === task.projectId);
                      return (
                        <div key={task.id} className="mb-3 last:mb-0 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => openTaskDetail(task.id)}>
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <Badge className={`${getStatusColor(task.status)} text-xs ml-2`} variant="secondary">
                              {getStatusDisplayText(task.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project && (
                              <>
                                <div className={`w-2 h-2 rounded-full ${project.color} mr-1`}></div>
                                <span className="truncate mr-2">{project.name}</span>
                              </>
                            )}
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                   {userTasks.filter(task => task.dueDate && new Date(task.dueDate) > new Date()).length === 0 && (
                     <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                       No upcoming deadlines.
                     </p>
                   )}
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
              Task details
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedTask.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  {/* Status Change Dropdown in Modal */}
                  <Select value={selectedTask.status} onValueChange={handleChangeTaskStatus}>
                    <SelectTrigger className="mt-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Project</Label>
                  <div className="flex items-center mt-1">
                    {selectedTaskProject && (
                      <>
                        <div className={`w-3 h-3 rounded-full ${selectedTaskProject.color} mr-2`}></div>
                        <Link href={`/users/projects/${selectedTaskProject.id}`} className="text-sm font-medium hover:underline">
                          {selectedTaskProject.name}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assignee</Label>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">{selectedTaskAssignee?.name.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTaskAssignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <Label className="text-muted-foreground">Due Date</Label>
                   <p className="mt-1">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date'}</p>
                 </div>
                 <div>
                   <Label className="text-muted-foreground">Start Date</Label>
                   <p className="mt-1">N/A</p>
                 </div>
               </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex-grow">
                      <p className="text-xs font-medium">Alex Johnson</p>
                      <p className="text-sm">Looking good so far!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow flex">
                      <Input type="text" placeholder="Add a comment..." className="flex-grow text-sm" />
                      <Button size="sm" className="ml-2">Post</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeTaskDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyTaskPage;