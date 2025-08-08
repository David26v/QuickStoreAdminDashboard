"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UserCheck, UserPlus, UserX, Hash, Calendar, AlertCircle, X, MapPin, Search, CheckCircle, Lock } from 'lucide-react';
import supabase from '@/lib/helper';
import { useDialog } from '@/components/providers/DialogProvider';
import { useLoading } from '@/components/providers/LoadingProvider';


const DoorDetailDialog = (props) => {

  const { isOpen, door, onClose, onAssignLocker, onUnassignLocker ,clientId} = props

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentType, setAssignmentType] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const client = props.client || { id: clientId }; 

  // Use your custom dialog and loading hooks
  const { showConfirm, showSuccess, showError } = useDialog();
  const { show: showLoading, hide: hideLoading } = useLoading();

  

  // Fetch users based on client ID and search term
  const fetchUsers = useCallback(async () => {
    if (!client?.id || !showAssignForm) return;

    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('clients_users')
        .select('id, full_name, email, phone')
        .eq('client_id', client.id)
        .ilike('full_name', `%${searchTerm || ''}%`) 
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to load users.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [client?.id, showAssignForm, searchTerm, showError]); 


  useEffect(() => {
    if (isOpen && showAssignForm) {
      fetchUsers();
    }
  }, [isOpen, showAssignForm, fetchUsers]);

  
  const handleConfirmAssignment = async () => {
    let assigneeData = null;
    if (assignmentType === 'user' && selectedUser) {
      assigneeData = { type: 'user', user: selectedUser };
    } else if (assignmentType === 'guest' && guestName.trim() !== '') {
      assigneeData = { type: 'guest', guest_name: guestName, guest_phone: guestPhone || null };
    }

    if (!assigneeData || !door || !door.id) {
      console.error('No valid assignee selected or entered, or door ID missing.');
      showError('Invalid assignment data.');
      return;
    }

    setIsAssigning(true);
    try {
      showLoading("Assigning door...");
      if (onAssignLocker) {
         await onAssignLocker(door.id, assigneeData);
      }
      showSuccess("Door assigned successfully.");
      handleCloseAssignForm();
      onClose(); 
      // ------------------------------------------------------------
    } catch (error) {
      console.error('Assignment failed:', error);
      showError("Failed to assign door: " + (error.message || "Unknown error"));
    } finally {
      setIsAssigning(false);
      hideLoading();
    }
  };
  // --- END MODIFICATION ---

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

  const handleUnassignDoor = () => {
    if (!door || !door.id) return;

    showConfirm({
      title: "Unassign Locker Door",
      description: `Are you sure you want to unassign this locker door (Door #${door.door_number})?`,
      confirmText: "Unassign",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          showLoading("Unassigning door...");
          if (onUnassignLocker) {
            await onUnassignLocker(door.id);
          }
          showSuccess("Door unassigned successfully.");
        } catch (error) {
          console.error('Error unassigning door:', error);
          showError("Failed to unassign door: " + (error.message || "Unknown error"));
        } finally {
          hideLoading();
        }
      }
    });
  };

  // --- MODIFIED: Use data from the new join structure ---
  // Check for assigned user or guest data fetched via useLockerDoors hook
  const assignedAssignee = door?.assigned_user || door?.assigned_guest;
  // -------------------------------------------------------

  const getStatusConfig = (status) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          icon: CheckCircle,
          pulse: '', // Removed pulse for available
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

  const statusConfig = getStatusConfig(door?.status);
  const StatusIcon = statusConfig.icon;

  // --- MODIFIED: Function to render the UI for Available Doors ---
  const renderAvailableDoorView = () => (
    <div className="text-center py-10">
      {/* Door Visualization */}
      <div className="w-24 h-28 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-sm flex flex-col items-center justify-end mx-auto shadow-xl border-4 border-gray-300 relative overflow-hidden mb-6">
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
          <CheckCircle className="w-6 h-6 text-emerald-600 drop-shadow-md" />
        </div>
        {/* Door frame highlight */}
        <div className="absolute -inset-1 rounded-sm bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">Door Available</h3>
      <p className="text-slate-600 text-base leading-relaxed max-w-md mx-auto mb-6">
        This bank-grade locker door is ready for assignment. Click below to assign it to a user or guest.
      </p>
      <Button
        onClick={() => setShowAssignForm(true)} // Opens the assignment form
        disabled={!door?.id}
        className="w-full max-w-xs mx-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <UserPlus className="w-5 h-5" />
        <span>Assign Door</span>
      </Button>
    </div>
  );
  // --- END MODIFICATION ---

  // --- MODIFIED: Function to render the UI for Occupied/Overdue Doors ---
  const renderOccupiedOverdueDoorView = () => (
    <>
      {/* --- MODIFIED: Updated logic to display user or guest info AND removed Duration --- */}
      {assignedAssignee ? ( // Check for either user or guest data from join
        <div className="space-y-6">
          {/* Assignee Card - Updated to handle both users and guests */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                {door.assigned_user ? <User className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                Assigned {door.assigned_user ? 'User' : 'Guest'}
              </h5>
              <div className={`w-3 h-3 ${door.status === 'occupied' ? 'bg-orange-500' : 'bg-red-500'} rounded-full ${door.status === 'occupied' ? '' : 'animate-pulse'}`}></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  {door.assigned_user ? <User className="w-8 h-8 text-white" /> : <UserX className="w-8 h-8 text-white" />}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {/* Display name from either user or guest object */}
                <h4 className="font-bold text-slate-800 text-xl truncate">
                  {door.assigned_user?.full_name || door.assigned_guest?.full_name || 'Unknown Assignee'}
                </h4>
                {/* Display contact info from either user or guest object */}
                <p className="text-slate-600 text-base truncate">
                  {door.assigned_user?.email || door.assigned_guest?.email || door.assigned_guest?.phone || 'No contact info provided'}
                </p>
                {/* Specific indicator for guests */}
                {door.assigned_guest && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                    Guest Access
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Time Information Grid - REMOVED Duration section as requested */}
          <div className="grid grid-cols-1 gap-4"> {/* Changed to 1 column layout */}
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
            {/* --- Duration panel removed here --- */}
          </div>

          {/* Additional Actions */}
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

          {/* Unassign Button */}
          <div className="pt-4">
            <Button
              onClick={handleUnassignDoor}
              variant="destructive"
              className="w-full py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Unassign Door
            </Button>
          </div>
        </div>
      ) : (
        // --- Show "No Assignee Information" ONLY for occupied/overdue doors missing data ---
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-3">No Assignee Information</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            This locker door appears to be assigned, but the associated assignee details are currently unavailable.
          </p>
        </div>
      )}
      {/* ---------------------------------------------------------- */}
    </>
  );
  // --- END MODIFICATION ---

  if (!isOpen || !door) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseMainDialog()}>
      <DialogContent className="sm:max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden border-0 p-0 bg-white">
        {/* Header with QuickStore theme */}
        <DialogHeader className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-500/5"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className={`w-14 h-14 ${statusConfig.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <StatusIcon className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div className="absolute -inset-1 rounded-sm bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1 flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-orange-400" />
                  Door #{door.door_number}
                </DialogTitle>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${statusConfig.statusBg} text-white shadow-md`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig.iconBg}`}></div>
                  {door.status ? door.status.charAt(0).toUpperCase() + door.status.slice(1) : 'Unknown'}
                </div>
              </div>
            </div>
            {/* Removed DialogClose button from header */}
          </div>

          {/* Selected Assignee Preview in Header - New Section */}
          {/* This is visible only when the assignment form is active and a user/guest is selected */}
          {showAssignForm && (
            ((assignmentType === 'user' && selectedUser) || (assignmentType === 'guest' && guestName.trim() !== '')) ? (
              <div className="mt-5 p-3 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow">
                        {assignmentType === 'user' ? <User className="w-5 h-5 text-white" /> : <UserX className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate text-sm">
                        {assignmentType === 'user' ? selectedUser.full_name : guestName}
                      </h4>
                      <p className="text-orange-200 text-xs truncate">
                        {assignmentType === 'user' ? (selectedUser.email || 'No email') : (guestPhone || 'No phone provided')}
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
            ) : null
          )}
        </DialogHeader>

        {/* Content Area - Updated Structure */}
        <div className="px-8 py-6 overflow-y-auto max-h-[60vh]">
          {showAssignForm ? (
            // --- Assignment Form View ---
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
                    className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${assignmentType === 'user' ? 'bg-white shadow-md text-orange-600 border border-orange-200' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Existing User
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentType('guest')}
                    className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${assignmentType === 'guest' ? 'bg-white shadow-md text-orange-600 border border-orange-200' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Guest User
                  </button>
                </div>
              </div>

              {assignmentType === 'user' ? (
                // Existing User Assignment
                <div className="space-y-4">
                  <div>
                    <label htmlFor="user-search" className="block text-sm font-medium text-slate-700 mb-2">
                      Search Users
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="user-search"
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="max-h-64 overflow-y-auto"> {/* Adjusted container for scrolling */}
                      {loadingUsers ? (
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <h4 className="font-bold text-slate-700 mb-2">Loading users...</h4>
                          <p className="text-slate-500 text-sm">Fetching user list</p>
                        </div>
                      ) : users.length > 0 ? (
                        users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center space-x-3 ${selectedUser?.id === user.id ? 'bg-orange-100 border border-orange-300' : 'hover:bg-slate-50'}`}
                          >
                            <div className="relative flex-shrink-0">
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
                                <p className="text-sm text-slate-600 truncate flex-1">{user.email || 'No email provided'}</p>
                                <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{user.department || 'No department'}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                          <UserX className="w-12 h-12 mb-3" />
                          <p className="font-medium">No users found</p>
                          <p className="text-sm">Try adjusting your search</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Guest User Assignment
                <div className="space-y-4">
                  <div>
                    <label htmlFor="guest-name" className="block text-sm font-medium text-slate-700 mb-2">
                      Guest Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="guest-name"
                      type="text"
                      placeholder="Enter guest's full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="py-3 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="guest-phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Guest Phone Number
                    </label>
                    <Input
                      id="guest-phone"
                      type="tel"
                      placeholder="Enter guest's phone number (optional)"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="py-3 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Assign Button */}
              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleConfirmAssignment}
                  disabled={
                    isAssigning ||
                    !door.id ||
                    (assignmentType === 'user' && !selectedUser) ||
                    (assignmentType === 'guest' && !guestName.trim())
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Assign This Locker Door</span>
                </Button>
                <p className="text-xs text-slate-500 text-center">Assign to an existing user or a guest</p>
              </div>
            </div>
          ) : (
            // --- Detail View (when NOT showing the assignment form) ---
            <>
              {/* --- Check Door Status and render appropriate view --- */}
              {door?.status === 'available' ? (
                renderAvailableDoorView()
              ) : door?.status === 'occupied' || door?.status === 'overdue' ? (
                renderOccupiedOverdueDoorView()
              ) : (
                // Fallback for unexpected status
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <AlertCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-3">Unknown Door Status</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    The status of this locker door is unknown. Please try again later.
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