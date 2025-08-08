"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Filter,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Lock,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/ui/DataTable';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/helper';
import { useDialog } from '@/components/providers/DialogProvider';
import { useLoading } from '@/components/providers/LoadingProvider';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const router = useRouter();
  const { showDelete, showSuccess, showError, showConfirm } = useDialog();
  const { show: showLoading, hide: hideLoading } = useLoading();

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('client_id')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          setClient({ id: data.client_id });
        }
      } catch (error) {
        console.error('Error fetching client info:', error);
      }
    };

    fetchClientInfo();
  }, []);

  useEffect(() => {
    if (!client?.id) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients_users')
          .select(`
            id,
            full_name,
            email,
            phone,
            department,
            position,
            is_active,
            created_at,
            locker_doors(
              id,
              door_number,
              locker:lockers(name)
            )
          `)
          .eq('client_id', client.id);
        
        if (error) throw error;
        
        const transformedUsers = data.map(user => {
          let assigned_locker_door = null;
          if (user.locker_doors && user.locker_doors.length > 0) {
            const door = user.locker_doors[0];
            assigned_locker_door = `Locker ${door.locker.locker_number} - Door ${door.door_number}`;
          }
          
          return {
            ...user,
            first_name: user.full_name.split(' ')[0] || '',
            last_name: user.full_name.split(' ').slice(1).join(' ') || '',
            assigned_locker_door
          };
        });
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [client?.id]);

  const filteredUsers = users.filter(user =>
    Object.values(user).some(
      value =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const userColumns = [
    {
      key: 'name_info', 
      label: 'Full Name',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm">{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status_badge',
      label: 'Status',
      render: (_, user) => (
        <Badge variant={user.is_active ? "default" : "destructive"} className="text-xs">
          {user.is_active ? (
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Active</div>
          ) : (
            <div className="flex items-center"><XCircle className="w-3 h-3 mr-1" /> Inactive</div>
          )}
        </Badge>
      )
    },
    {
      key: 'created_info',
      label: 'Created',
      render: (_, user) => {
        const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        return (
         <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{formattedDate}</span>
         </div>
        );
      }
    },
    {
      key: 'assigned_locker_door',
      label: 'Assigned Locker',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm">{value || 'None'}</span>
        </div>
      )
    }
  ];

  const handleViewUser = (user) => {
    router.push(`/client_admin/user-management/users/${user.id}`);
  };

  const handleEditUser = (user) => {
    router.push(`/client_admin/user-management/users/edit/${user.id}`);
  };

  const handleDeleteUser = useCallback(async (user) => {
    showDelete({
      title: "Delete User",
      description: `Are you sure you want to delete ${user.full_name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          showLoading("Deleting user...");
          
          // Check for locker door assignments
          const { data: lockerDoors, error: lockerDoorsError } = await supabase
            .from('locker_doors')
            .select('id')
            .eq('assigned_user_id', user.id);
          
          if (lockerDoorsError) throw lockerDoorsError;
          
          if (lockerDoors && lockerDoors.length > 0) {
            hideLoading();
            showConfirm({
              title: "Cannot Delete User",
              description: `${user.full_name} is currently assigned to locker doors. Please unassign them first before deleting.`,
              confirmText: "Okay",
              variant: "warning"
            });
            return;
          }
          
          // Delete associated user_credentials records
          const { error: credentialsError } = await supabase
            .from('user_credentials')
            .delete()
            .eq('user_id', user.id);
          
          if (credentialsError) throw credentialsError;
          
          // Delete associated locker_door_events records
          const { error: eventsError } = await supabase
            .from('locker_door_events')
            .delete()
            .eq('user_id', user.id);
          
          if (eventsError) throw eventsError;
          
          // Delete the user from clients_users
          const { error: userError } = await supabase
            .from('clients_users')
            .delete()
            .eq('id', user.id);
          
          if (userError) throw userError;
          
          // Remove user from state
          setUsers(users.filter(u => u.id !== user.id));
          showSuccess("User deleted successfully");
        } catch (error) {
          console.error('Error deleting user:', error);
          hideLoading();
          
          if (error.code === '23503') {
            showConfirm({
              title: "Cannot Delete User",
              description: `${user.full_name} has associated data that prevents deletion. Please ensure all locker assignments are removed first.`,
              confirmText: "Okay",
              variant: "warning"
            });
          } else {
            showError("Failed to delete user: " + error.message);
          }
        } finally {
          hideLoading();
        }
      }
    });
  }, [users, showDelete, showSuccess, showError, showConfirm, showLoading, hideLoading]);

  const handleAddUser = () => {
    router.push('/client_admin/user-management/users/AddUserPage');
  };

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'view':
        handleViewUser(user);
        break;
      case 'edit':
        handleEditUser(user);
        break;
      case 'delete':
        handleDeleteUser(user);
        break;
      default:
        console.log(`Unknown action: ${action}`, user);
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage users for your client</p>
          </div>
          <Button 
           className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto text-sm flex items-center justify-center"
           onClick={handleAddUser}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add New User</span>
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {/* Actions */}
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              onAction={handleUserAction}
              emptyStateMessage="No users found."
              searchTerm={searchTerm}
              showActions={true}
              actionButtons={[
                { 
                  label: 'View', 
                  icon: Eye, 
                  action: 'view', 
                  className: "text-blue-600 hover:text-blue-800" 
                },
                { 
                  label: 'Edit', 
                  icon: Edit, 
                  action: 'edit', 
                  className: "text-orange-600 hover:text-orange-800" 
                },
                { 
                  label: 'Delete', 
                  icon: Trash2, 
                  action: 'delete', 
                  className: "text-red-600 hover:text-red-800" 
                }
              ]}
              className="" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;