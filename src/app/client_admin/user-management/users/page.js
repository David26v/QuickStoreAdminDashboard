"use client";
import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Lock,
  CreditCard
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import DataTable from '@/components/ui/DataTable';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockClientUsers = [
        {
          id: 'user-1',
          client_id: 'client-1',
          first_name: 'John',
          last_name: 'Doe',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          department: 'IT',
          position: 'Developer',
          is_active: true,
          created_at: '2023-01-15T00:00:00Z',
          assigned_locker_door: 'Locker A - Door 3',
          payment_method: 'Credit Card'
        },
        {
          id: 'user-2',
          client_id: 'client-1',
          first_name: 'Jane',
          last_name: 'Smith',
          full_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          department: 'HR',
          position: 'Manager',
          is_active: true,
          created_at: '2022-11-01T00:00:00Z',
          assigned_locker_door: 'Locker B - Door 12',
          payment_method: 'Invoice'
        },
        {
          id: 'user-3',
          client_id: 'client-2',
          first_name: 'Robert',
          last_name: 'Johnson',
          full_name: 'Robert Johnson',
          email: 'robert.j@example.com',
          phone: '+1 (555) 456-7890',
          department: 'Finance',
          position: 'Analyst',
          is_active: false,
          created_at: '2023-03-22T00:00:00Z',
          assigned_locker_door: null,
          payment_method: 'Credit Card'
        },
        {
          id: 'user-4',
          client_id: 'client-2',
          first_name: 'Emily',
          last_name: 'Davis',
          full_name: 'Emily Davis',
          email: 'emily.d@example.com',
          phone: '+1 (555) 234-5678',
          department: 'Marketing',
          position: 'Specialist',
          is_active: true,
          created_at: '2024-01-10T00:00:00Z',
          assigned_locker_door: 'Locker C - Door 7',
          payment_method: 'Bank Transfer'
        },
      ];
      setUsers(mockClientUsers);
      setLoading(false);
    }, 800);
  }, []);

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
      label: 'User',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center flex-shrink-0"> {/* Use orange gradient */}
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
      key: 'locker_info',
      label: 'Assigned Locker',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          {user.assigned_locker_door ? (
            <>
              <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{user.assigned_locker_door}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm italic">Not Assigned</span>
          )}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm">{value}</span>
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
      key: 'payment_method',
      label: 'Payment Method',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm">{value || 'N/A'}</span>
        </div>
      )
    }
  ];

  // Handle actions from the DataTable
  const handleUserAction = (action, user) => {
    console.log(`Action: ${action}`, user);
    // Implement view, edit, delete logic here
    // e.g., router.push(`/client_admin/users/${user.id}`) for view/edit
    // e.g., open a confirmation modal for delete
  };


  const handleViewUser = () =>{
    
  } 

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Simplified for client users */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage users for your client</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto text-sm flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            <span>Add New User</span>
          </Button>
        </div>

        {/* Controls - Simplified, removed complex tabs for now */}
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
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-200 text-gray-600 hover:bg-gray-50"> {/* Adjusted button style */}
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Table using the new DataTable component */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <QuickStoreLoadingCompact message="Loading client users..." />
            </div>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              onAction={handleUserAction}
              emptyStateMessage="No users found."
              searchTerm={searchTerm}
              showActions={true} 
              className="" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;