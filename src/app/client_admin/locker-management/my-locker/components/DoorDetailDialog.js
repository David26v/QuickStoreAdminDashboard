"use client";
import React, { useState } from 'react';
import {
  Lock,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  UserPlus,
  MapPin,
  Search,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Shield,
  Hash,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const DoorDetailDialog = ({ isOpen, door, onClose, onAssignLocker }) => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentType, setAssignmentType] = useState('user'); // 'user' or 'guest'
  const [selectedUser, setSelectedUser] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Mock users data - replace with your actual users data
  const mockUsers = [
    {
      id: 1,
      full_name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      avatar: null
    },
    {
      id: 2,
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      avatar: null
    },
    {
      id: 3,
      full_name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Design',
      avatar: null
    },
    {
      id: 4,
      full_name: 'Emma Davis',
      email: 'emma.davis@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Operations',
      avatar: null
    },
    {
      id: 5,
      full_name: 'David Wilson',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Finance',
      avatar: null
    }
  ];

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignDoor = () => {
    setShowAssignForm(true);
  };

  const handleConfirmAssignment = async () => {
    let assigneeData = null;

    if (assignmentType === 'user' && selectedUser) {
       assigneeData = { type: 'user', user: selectedUser };
    } else if (assignmentType === 'guest' && guestName.trim() !== '') {
       assigneeData = { type: 'guest', guest_name: guestName, guest_phone: guestPhone || null };
    }

    if (!assigneeData) {
      console.error('No valid assignee selected or entered.');
      return;
    }

    setIsAssigning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (onAssignLocker) {
        onAssignLocker(door.id, assigneeData);
      }
      handleCloseAssignForm();
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCloseAssignForm = () => {
    setShowAssignForm(false);
    setSelectedUser(null);
    setSearchTerm('');
    setAssignmentType('user');
    setGuestName('');
    setGuestPhone('');
  };

  const handleCloseMainDialog = () => {
    onClose();
    if (showAssignForm) {
        handleCloseAssignForm();
    }
  };

  if (!isOpen || !door) return null;

  const assignedUser = door.assigned_user;

  // Enhanced status configuration - Using QuickStore/Orange theme
  const getStatusConfig = (status) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          icon: CheckCircle,
          pulse: 'animate-pulse',
          statusBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        };
      case 'occupied':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
          icon: Lock,
          pulse: '',
          statusBg: 'bg-gradient-to-r from-orange-500 to-orange-600'
        };
      case 'overdue':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
          icon: AlertCircle,
          pulse: 'animate-pulse',
          statusBg: 'bg-gradient-to-r from-red-500 to-red-600'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          iconBg: 'bg-gradient-to-br from-slate-500 to-slate-600',
          icon: Lock,
          pulse: '',
          statusBg: 'bg-gradient-to-r from-slate-500 to-slate-600'
        };
    }
  };

  const statusConfig = getStatusConfig(door.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseMainDialog()}>
      {/* Main Dialog Content - Increased size and using theme colors */}
      <DialogContent className="sm:max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden border-0 p-0 bg-white">
        {/* Header with QuickStore theme */}
        <DialogHeader className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-500/5"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-5">
              {/* Bank Locker Style Door Icon */}
              <div className="relative">
                <div className={`w-20 h-24 ${statusConfig.iconBg} rounded-sm flex items-center justify-center shadow-xl ${statusConfig.pulse} border-4 border-gray-800 relative overflow-hidden`}>
                  {/* Door surface texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff44_1px,transparent_1px)] [background-size:10px_10px] opacity-20"></div>
                  {/* Door handle/knob */}
                  <div className="absolute top-4 left-3 w-3 h-3 bg-yellow-400 rounded-full shadow-inner"></div>
                  {/* Door lock mechanism area */}
                  <div className="absolute bottom-4 w-10 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  {/* Status icon */}
                  <div className="absolute top-2 right-2">
                    <StatusIcon className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                </div>
                {/* Door frame highlight */}
                <div className="absolute -inset-1 rounded-sm bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1 flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-orange-400" />
                  Door #{door.door_number}
                </DialogTitle>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${statusConfig.statusBg} text-white shadow-md`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig.iconBg}`}></div>
                  {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
                </div>
              </div>
            </div>
            {/* Removed DialogClose button from here */}
          </div>
          {/* Selected User/Guest Preview in Header - New Section */}
          {/* This is visible only when the assignment form is active and a user/guest is selected */}
          {showAssignForm && (
            (assignmentType === 'user' && selectedUser) || (assignmentType === 'guest' && guestName.trim() !== '') ? (
              <div className="mt-5 p-3 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow">
                        {assignmentType === 'user' ? <User className="w-5 h-5 text-white" /> : <UserX className="w-5 h-5 text-white" />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate text-sm">
                        {assignmentType === 'user' ? selectedUser.full_name : guestName}
                      </h4>
                      <p className="text-orange-200 text-xs truncate">
                        {assignmentType === 'user' ? selectedUser.email : (guestPhone || 'No phone provided')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-200 hover:text-white hover:bg-white/10 rounded-full w-7 h-7 p-0 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (assignmentType === 'user') {
                        setSelectedUser(null);
                      } else {
                        setGuestName('');
                        setGuestPhone('');
                      }
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : null // Render nothing if form is shown but nothing selected
          )}
        </DialogHeader>

        {/* Content Area */}
        <div className="px-8 py-6 overflow-y-auto max-h-[60vh]">
          {showAssignForm ? (
            // Assignment Form View
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-2 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Assign Door #{door.door_number}
                </h3>
                <p className="text-orange-600">Select user type and provide details</p>
              </div>

              {/* Assignment Type Selector - Using theme colors */}
              <div className="p-2 border-b border-slate-200">
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setAssignmentType('user')}
                    className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${
                      assignmentType === 'user'
                        ? 'bg-white shadow-md text-orange-600 border border-orange-200'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Existing User
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentType('guest')}
                    className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${
                      assignmentType === 'guest'
                        ? 'bg-white shadow-md text-amber-600 border border-amber-200'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Guest
                  </button>
                </div>
              </div>

              {assignmentType === 'user' ? (
                // Existing User Assignment
                <>
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      <div className="p-1">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 m-1 ${
                              selectedUser?.id === user.id
                                ? 'bg-orange-50 border-2 border-orange-300 shadow-md'
                                : 'hover:bg-slate-50 border border-slate-200'
                            }`}
                          >
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              {selectedUser?.id === user.id && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 truncate">{user.full_name}</h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1 text-slate-500 text-sm">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                                  {user.department}
                                </span>
                                <div className="flex items-center space-x-1 text-slate-400 text-xs">
                                  <Phone className="w-3 h-3" />
                                  <span>{user.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="font-bold text-slate-700 mb-2">No users found</h4>
                        <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Guest Assignment Form
                <div className="p-2 space-y-4">
                  <div>
                    <label htmlFor="guestName" className="block text-sm font-bold text-slate-700 mb-1">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      id="guestName"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter guest's full name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="guestPhone" className="block text-sm font-bold text-slate-700 mb-1">
                      Guest Phone Number
                    </label>
                    <input
                      type="tel"
                      id="guestPhone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Enter guest's phone number (optional)"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Assignment Form Actions - Using theme colors */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseAssignForm}
                  className="flex-1 py-3 rounded-xl border-slate-300 hover:bg-slate-100 text-slate-700 font-bold"
                  disabled={isAssigning}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleConfirmAssignment}
                  disabled={(assignmentType === 'user' && !selectedUser) || (assignmentType === 'guest' && guestName.trim() === '') || isAssigning}
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${
                    (assignmentType === 'user' && !selectedUser) || (assignmentType === 'guest' && guestName.trim() === '') || isAssigning
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                  }`}
                >
                  {isAssigning ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Assigning...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Assign Door</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : door.status === 'available' ? (
            // Available State View
            <div className="space-y-8">
              <div className="text-center py-8">
                <div className="relative mb-6 flex justify-center">
                  {/* Bank Locker Style Available Door */}
                  <div className="w-24 h-28 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-sm flex flex-col items-center justify-end mx-auto shadow-xl border-4 border-gray-300 relative overflow-hidden">
                    {/* Door surface texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff44_1px,transparent_1px)] [background-size:10px_10px] opacity-20"></div>
                    {/* Door handle/knob */}
                    <div className="absolute top-4 left-3 w-3 h-3 bg-yellow-400 rounded-full shadow-inner"></div>
                    {/* Door lock mechanism area */}
                    <div className="absolute bottom-4 w-10 h-6 bg-gray-800 rounded-sm flex items-center justify-center mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    {/* Status indicator */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    {/* Door frame highlight */}
                    <div className="absolute -inset-1 rounded-sm bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none"></div>
                  </div>
                  {/* Available badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Door Available</h3>
                <p className="text-slate-600 text-base leading-relaxed max-w-md mx-auto">
                  This bank-grade locker door is ready for assignment. Click below to assign it to a user or guest.
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handleAssignDoor}
                  disabled={!door.id}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Assign This Locker Door</span>
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Assign to an existing user or a guest
                </p>
              </div>
            </div>
          ) : (
            // Occupied/Overdue State View
            <>
              {assignedUser ? (
                <div className="space-y-6">
                  {/* User Card - Updated with theme */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Assigned User
                      </h5>
                      <div className={`w-3 h-3 ${door.status === 'occupied' ? 'bg-orange-500' : 'bg-red-500'} rounded-full ${door.status === 'occupied' ? '' : 'animate-pulse'}`}></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xl truncate">
                          {assignedUser.full_name || assignedUser.guest_name || 'Unknown User'}
                        </h4>
                        <p className="text-slate-600 text-base truncate">
                          {assignedUser.email || assignedUser.guest_phone || 'No contact info provided'}
                        </p>
                        {assignedUser.guest_name && (
                          <span className="inline-flex items-center mt-2 px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                            Guest Access
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Time Information Grid - Updated with theme */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                          Assignment Date
                        </h5>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-slate-800 font-bold text-xl">
                        {door.assigned_at ? new Date(door.assigned_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not available'}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        {door.assigned_at ? new Date(door.assigned_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 border border-orange-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                          Duration
                        </h5>
                        <Clock className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-slate-800 font-bold text-xl">
                        {door.assigned_at ? (() => {
                          const now = new Date();
                          const assigned = new Date(door.assigned_at);
                          const diffTime = Math.abs(now - assigned);
                          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                          if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
                          if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                          return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
                        })() : 'Unknown'}
                      </p>
                      <p className="text-orange-600 text-sm mt-1">
                        Since assignment
                      </p>
                    </div>
                  </div>
                  {/* Additional Actions - Updated with theme */}
                  {door.status === 'overdue' && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-red-800 text-lg">Overdue Assignment</p>
                          <p className="text-red-600 mt-1">This locker door assignment has exceeded the expected duration. Please review and take necessary action.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <AlertCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-3">No User Information</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    This locker door appears to be assigned, but the associated user details are currently unavailable.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Using theme colors */}
        <DialogFooter className="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Locker ID: {door.id || 'N/A'}</span>
            </div>
            <DialogClose asChild>
              <Button
                onClick={handleCloseMainDialog}
                variant="outline"
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoorDetailDialog;