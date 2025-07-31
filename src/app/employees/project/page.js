// app/users/project/page.js
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
// Import Shadcn UI components
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
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
// Import Lucide React Icons
import {
  Folder,
  Plus,
  Search,
  Filter,
  Star,
  Home,
  TrendingUp,
  Calendar,
  Users,
  Bell,
  Settings,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';

// Mock data for projects (enhanced with task stats)
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
  },
];

const ProjectPage = () => {

  const router = useRouter(); 

  const [projects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: "", description: "", color: "bg-blue-500" });

  const handleCreateProject = () => {
    console.log("Creating project:", newProjectData);
    // In a real app, you would call an API here
    alert(`Project "${newProjectData.name}" created! (Simulated)`);
    setIsNewProjectModalOpen(false);
    setNewProjectData({ name: "", description: "", color: "bg-blue-500" });
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Folder className="h-7 w-7 text-blue-500" />
                Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your projects.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newProjectData.name}
                        onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                        className="col-span-3"
                        placeholder="Project Name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newProjectData.description}
                        onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                        className="col-span-3"
                        placeholder="Project Description"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">
                        Color
                      </Label>
                      <Select value={newProjectData.color} onValueChange={(value) => setNewProjectData({ ...newProjectData, color: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bg-blue-500"><div className="flex items-center"><div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div> Blue</div></SelectItem>
                          <SelectItem value="bg-purple-500"><div className="flex items-center"><div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div> Purple</div></SelectItem>
                          <SelectItem value="bg-amber-500"><div className="flex items-center"><div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div> Amber</div></SelectItem>
                          <SelectItem value="bg-emerald-500"><div className="flex items-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div> Emerald</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleCreateProject} disabled={!newProjectData.name.trim()}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row flex-grow gap-6">
          {/* Sidebar - Filters, Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="w-full pl-8 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Removed Task Status Filter */}
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-500" />
                  Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    Starred Projects
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Recently Updated
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    Due This Week
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    Shared With Me
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          {/* Main Project List Area */}
          <div className="flex-grow">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Folder className="h-5 w-5 text-indigo-500" />
                  All Projects
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {filteredProjects.length} Projects
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* --- MODIFIED THIS PART TO MAKE CARDS CLICKABLE using router.push --- */}
                {filteredProjects.map((project) => (
                  // Wrap the Card in a div with onClick for programmatic navigation
                  <div
                    key={project.id}
                    className="shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/users/project/${project.id}`)} // Use router.push
                  >
                    <Card className="h-full"> {/* Remove default cursor-pointer and shadow from Card */}
                      <CardHeader className="pb-2 relative">
                        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${project.color}`}></div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Folder className="h-4 w-4 text-gray-500" />
                          {project.name}
                          {project.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="font-medium">{project.tasksCompleted}/{project.totalTasks} tasks</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${project.totalTasks > 0 ? (project.tasksCompleted / project.totalTasks) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <span> {/* Placeholder or other info */} </span>
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {/* --------------------------------------------------- */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;