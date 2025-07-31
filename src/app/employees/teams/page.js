// app/users/my-team/page.jsx
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import { Checkbox } from "@/components/ui/checkbox"; // For multi-select

// --- Import useDialog ---

// Import Lucide React Icons
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  User,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import { useDialog } from '@/components/providers/DialogProvider';

// --- Mock Data ---
const mockTeamMembers = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice.j@company.com",
    role: "Frontend Developer",
    avatar: null,
    status: "active",
    tasksAssigned: 5,
    tasksCompleted: 3,
    projects: ["Website Redesign", "Mobile App"],
    lastActive: "2024-06-10T14:30:00Z",
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob.s@company.com",
    role: "Backend Developer",
    avatar: null,
    status: "on-leave",
    tasksAssigned: 3,
    tasksCompleted: 2,
    projects: ["API v2", "Mobile App"],
    lastActive: "2024-06-09T11:15:00Z",
  },
  {
    id: 103,
    name: "Charlie Brown",
    email: "charlie.b@company.com",
    role: "UI/UX Designer",
    avatar: null,
    status: "busy",
    tasksAssigned: 4,
    tasksCompleted: 1,
    projects: ["Website Redesign", "Dashboard"],
    lastActive: "2024-06-10T16:45:00Z",
  },
  {
    id: 104,
    name: "Diana Prince",
    email: "diana.p@company.com",
    role: "QA Engineer",
    avatar: null,
    status: "active",
    tasksAssigned: 6,
    tasksCompleted: 5,
    projects: ["Website Redesign", "API v2", "Mobile App"],
    lastActive: "2024-06-10T13:20:00Z",
  },
  {
    id: 105,
    name: "Ethan Hunt",
    email: "ethan.h@company.com",
    role: "DevOps Engineer",
    avatar: null,
    status: "active",
    tasksAssigned: 2,
    tasksCompleted: 2,
    projects: ["Infrastructure"],
    lastActive: "2024-06-10T10:00:00Z",
  },
];

// --- Mock Potential Users (Those not already on the team) ---
const mockPotentialUsers = [
  { id: 201, name: "Fiona Gallagher", email: "fiona.g@company.com", role: "Developer", avatar: null },
  { id: 202, name: "George Orwell", email: "george.o@company.com", role: "Content Writer", avatar: null },
  { id: 203, name: "Hannah Montana", email: "hannah.m@company.com", role: "Marketing Specialist", avatar: null },
  { id: 204, name: "Ian Malcolm", email: "ian.m@company.com", role: "Data Scientist", avatar: null },
  { id: 205, name: "Jane Doe", email: "jane.d@company.com", role: "Product Manager", avatar: null },
  { id: 206, name: "Kyle Reese", email: "kyle.r@company.com", role: "Security Analyst", avatar: null },
];

const MyTeamPage = () => {
  // --- Simulate fetching current user ID ---
  const currentUserId = 1; // Assuming 'You' is user ID 1

  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [isMemberDetailModalOpen, setIsMemberDetailModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  // --- State for Multi-Select Add Member ---
  const [potentialUsers, setPotentialUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // --- Use the custom dialog hook ---
  const { showConfirm, showSuccess, showError } = useDialog();

  // Simulate fetching team data
  useEffect(() => {
    setTeamMembers(mockTeamMembers);
    setFilteredMembers(mockTeamMembers);
    // In a real app, fetch potential users who are not already on the team
    setPotentialUsers(mockPotentialUsers);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...teamMembers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(member =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(member => member.status === statusFilter);
    }

    setFilteredMembers(result);
  }, [teamMembers, searchTerm, statusFilter]);

  // --- Handlers ---
  const openMemberDetail = (memberId) => {
    setSelectedMemberId(memberId);
    setIsMemberDetailModalOpen(true);
  };

  const closeMemberDetail = () => {
    setIsMemberDetailModalOpen(false);
    setSelectedMemberId(null);
  };

  const openEditRole = (memberId, currentRole) => {
    setEditingMemberId(memberId);
    setNewRole(currentRole);
    setIsEditRoleModalOpen(true);
  };

  const closeEditRole = () => {
    setIsEditRoleModalOpen(false);
    setEditingMemberId(null);
    setNewRole('');
  };

  const handleEditRole = () => {
    if (!editingMemberId || !newRole.trim()) return;

    const memberToEdit = teamMembers.find(m => m.id === editingMemberId);
    if (!memberToEdit) return;

    console.log(`Updating role for member ${editingMemberId} to: ${newRole}`);
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === editingMemberId ? { ...member, role: newRole } : member
      )
    );
    closeEditRole();
    showSuccess(`Role for ${memberToEdit.name} updated to ${newRole}!`);
  };

  const handleRemoveMember = (memberId) => {
    const memberToRemove = teamMembers.find(m => m.id === memberId);
    if (!memberToRemove) return;

    showConfirm({
      title: "Remove Team Member",
      description: `Are you sure you want to remove ${memberToRemove.name} (${memberToRemove.email}) from your team?`,
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        console.log(`Removing member with ID: ${memberId}`);
        setTeamMembers(prev => prev.filter(member => member.id !== memberId));
        showSuccess(`${memberToRemove.name} has been removed from the team.`);
      },
    });
  };

  const openAddMember = () => {
    setIsAddMemberModalOpen(true);
    setSelectedUserIds([]); // Reset selection when opening
  };

  const closeAddMember = () => {
    setIsAddMemberModalOpen(false);
    setSelectedUserIds([]); // Reset selection when closing
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAddSelectedMembers = () => {
    if (selectedUserIds.length === 0) {
        showError("Please select at least one user to add.");
        return;
    }

    const usersToAdd = potentialUsers.filter(user => selectedUserIds.includes(user.id));
    const newMembers = usersToAdd.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: "active", // Default status
        tasksAssigned: 0,
        tasksCompleted: 0,
        projects: [],
        lastActive: new Date().toISOString(),
    }));

    console.log("Adding new members:", newMembers);
    setTeamMembers(prev => [...prev, ...newMembers]);
    
    // Remove added users from potential users list
    setPotentialUsers(prev => prev.filter(user => !selectedUserIds.includes(user.id)));
    
    closeAddMember();
    showSuccess(`${newMembers.length} member(s) added to your team!`);
  };

  // --- Helper Functions ---
  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'on-leave': return 'On Leave';
      case 'busy': return 'Busy';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'on-leave': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'busy': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get selected member details for modal
  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-6 h-6 rounded-full mr-3 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  My Team
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage and oversee your team members.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Add Member Button */}
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" onClick={openAddMember}>
                <Plus className="h-4 w-4" />
                Add Member(s)
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area - Team Members List */}
          <div className="flex-grow">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Team Members
                    </span> ({filteredMembers.length})
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
                <CardDescription>
                  View and manage your direct reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredMembers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[100px]">Tasks</TableHead>
                        <TableHead className="w-[150px]">Last Active</TableHead>
                        <TableHead className="w-[50px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar || undefined} alt={member.name} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{member.role}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(member.status)} text-xs`} variant="secondary">
                              {getStatusDisplayText(member.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="font-medium">{member.tasksCompleted}</span>
                              <span className="text-gray-500 dark:text-gray-400"> / {member.tasksAssigned}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">completed</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(member.lastActive).toLocaleDateString()}{' '}
                            {new Date(member.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openMemberDetail(member.id)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditRole(member.id, member.role)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No team members found.</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Team Stats / Quick Actions */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Team Stats Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Team Overview
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
                    <p className="text-2xl font-bold">{teamMembers.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
                    <p className="text-xl font-semibold">
                      {teamMembers.filter(m => m.status === 'active').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Task Completion</p>
                    <p className="text-xl font-semibold">
                      {teamMembers.length > 0
                        ? Math.round(
                            (teamMembers.reduce((sum, m) => sum + (m.tasksAssigned > 0 ? (m.tasksCompleted / m.tasksAssigned) : 0), 0) /
                              teamMembers.length) *
                              100
                          ) || 0
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Actions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800">
                    <Mail className="mr-2 h-4 w-4 text-blue-500" /> Send Team Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" /> Schedule Team Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800">
                    <Pencil className="mr-2 h-4 w-4 text-indigo-500" /> Create Team Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      <Dialog open={isMemberDetailModalOpen} onOpenChange={setIsMemberDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>
              Details for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage src={selectedMember.avatar || undefined} alt={selectedMember.name} />
                  <AvatarFallback className="text-xl">{selectedMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                <Badge className={`${getStatusColor(selectedMember.status)} mt-2`} variant="secondary">
                  {getStatusDisplayText(selectedMember.status)}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium">{selectedMember.role}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tasks Completed</Label>
                  <p className="font-medium">{selectedMember.tasksCompleted} / {selectedMember.tasksAssigned}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Projects</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMember.projects.length > 0 ? (
                    selectedMember.projects.map((project, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">No projects assigned</span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Active</Label>
                <p className="text-sm">
                  {new Date(selectedMember.lastActive).toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeMemberDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditRoleModalOpen} onOpenChange={setIsEditRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
            <DialogDescription>
              Change the role for {teamMembers.find(m => m.id === editingMemberId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="col-span-3"
                placeholder="Enter new role"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditRole}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleEditRole}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member(s) Modal - Multi-Select List */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={(open) => {
        if (!open) closeAddMember();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Team Members</DialogTitle>
            <DialogDescription>
              Select users from the list below to add them to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {potentialUsers.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {potentialUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUserIds.includes(user.id)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)} // For accessibility
                        className="mr-3"
                      />
                      <label htmlFor={`user-${user.id}`} className="flex-grow cursor-pointer">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar || undefined} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <User className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No more users available to add.</p>
                <p className="text-sm mt-1">All potential members might already be on your team.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddMember}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleAddSelectedMembers}
              disabled={selectedUserIds.length === 0}
            >
              Add Selected ({selectedUserIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTeamPage;