'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, Calendar, MapPin, Filter, Download, Eye, Activity } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import supabase from '@/lib/helper'; 
import { useRouter } from 'next/navigation';

const mockDoorLogs = [
  {
    id: 1,
    user_id: 'user1',
    door_id: 1,
    session_start: '2024-01-15T10:30:00Z',
    session_end: '2024-01-15T11:45:00Z',
    duration_minutes: 75,
    status: 'completed',
    locker_doors: {
      id: 1,
      door_number: 1,
      client_id: 'client1',
      assigned_user_id: 'user1',
      lockers: {
        id: 1,
        locker_number: 101
      }
    },
    clients_users: {
      id: 1,
      full_name: 'John Smith',
      email: 'john.smith@example.com'
    }
  },
  {
    id: 2,
    user_id: 'user2',
    door_id: 2,
    session_start: '2024-01-15T09:15:00Z',
    session_end: '2024-01-15T10:30:00Z',
    duration_minutes: 75,
    status: 'completed',
    locker_doors: {
      id: 2,
      door_number: 2,
      client_id: 'client1',
      assigned_user_id: 'user2',
      lockers: {
        id: 1,
        locker_number: 101
      }
    },
    clients_users: {
      id: 2,
      full_name: 'Jane Doe',
      email: 'jane.doe@example.com'
    }
  },
  {
    id: 3,
    user_id: 'user1',
    door_id: 1,
    session_start: '2024-01-15T14:00:00Z',
    session_end: null, 
    duration_minutes: null,
    status: 'active',
    locker_doors: {
      id: 1,
      door_number: 1,
      client_id: 'client1',
      assigned_user_id: 'user1',
      lockers: {
        id: 1,
        locker_number: 101
      }
    },
    clients_users: {
      id: 1,
      full_name: 'John Smith',
      email: 'john.smith@example.com'
    }
  },
  {
    id: 4,
    user_id: 'user3',
    door_id: 3,
    session_start: '2024-01-15T13:30:00Z',
    session_end: '2024-01-15T14:15:00Z',
    duration_minutes: 45,
    status: 'completed',
    locker_doors: {
      id: 3,
      door_number: 1,
      client_id: 'client1',
      assigned_user_id: null,
      lockers: {
        id: 2,
        locker_number: 102
      }
    },
    clients_users: {
      id: 3,
      full_name: 'Mike Wilson',
      email: 'mike.wilson@example.com'
    }
  },
  {
    id: 5,
    user_id: 'user2',
    door_id: 2,
    session_start: '2024-01-14T16:20:00Z',
    session_end: '2024-01-14T17:45:00Z',
    duration_minutes: 85,
    status: 'completed',
    locker_doors: {
      id: 2,
      door_number: 2,
      client_id: 'client1',
      assigned_user_id: 'user2',
      lockers: {
        id: 1,
        locker_number: 101
      }
    },
    clients_users: {
      id: 2,
      full_name: 'Jane Doe',
      email: 'jane.doe@example.com'
    }
  }
];

const DoorUsageLogsPage = () => {
  const [doorLogs, setDoorLogs] = useState(mockDoorLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [userRole, setUserRole] = useState('client_admin'); 
  const router = useRouter()

  const calculateCurrentDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - start) / (1000 * 60));
    return diffInMinutes;
  };

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const columns = useMemo(() => [
    {
      key: 'locker_door_info',
      label: 'Location',
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">
            Locker #{item.locker_doors?.lockers?.locker_number || 'N/A'}
          </div>
          <div className="text-sm text-blue-600">
            Door #{item.locker_doors?.door_number || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {item.locker_doors?.assigned_user_id ? (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Assigned</span>
            ) : (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Available</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'user_info',
      label: 'User',
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.clients_users?.full_name || 'Unknown User'}
          </div>
          {userRole === 'admin' && (
            <div className="text-sm text-gray-500">
              {item.clients_users?.email || 'No email'}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'session_times',
      label: 'Session Time',
      render: (_, item) => {
        const startTime = formatDateTime(item.session_start);
        const endTime = item.session_end ? formatDateTime(item.session_end) : null;
        
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="font-medium">Start:</span>
            </div>
            <div className="text-gray-700 mb-2">
              <div>{startTime.date}</div>
              <div className="text-xs text-gray-500">{startTime.time}</div>
            </div>
            
            {item.status === 'completed' && endTime && (
              <>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="font-medium">End:</span>
                </div>
                <div className="text-gray-700">
                  <div>{endTime.date}</div>
                  <div className="text-xs text-gray-500">{endTime.time}</div>
                </div>
              </>
            )}
          </div>
        );
      }
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, item) => {
        let duration;
        let durationClass = "font-medium";
        
        if (item.status === 'active') {
          duration = formatDuration(calculateCurrentDuration(item.session_start));
          durationClass += " text-green-600";
        } else {
          duration = formatDuration(item.duration_minutes);
          durationClass += " text-blue-600";
        }
        
        return (
          <div className="text-center">
            <div className={`text-lg ${durationClass}`}>
              {duration}
            </div>
            <div className="text-xs text-gray-500">
              {item.status === 'active' ? 'In progress' : 'Completed'}
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, item) => {
        if (item.status === 'active') {
          return (
            <div className="flex flex-col items-center gap-1">
              <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800 animate-pulse">
                <Activity className="w-3 h-3 inline mr-1" />
                Active
              </span>
              <div className="text-xs text-gray-500">
                Live session
              </div>
            </div>
          );
        }
        
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
              <Clock className="w-3 h-3 inline mr-1" />
              Completed
            </span>
            <div className="text-xs text-gray-500">
              Session ended
            </div>
          </div>
        );
      }
    }
  ], [userRole]);

  const filteredLogs = useMemo(() => {
    let filtered = doorLogs;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.clients_users?.full_name?.toLowerCase().includes(term) ||
        log.clients_users?.email?.toLowerCase().includes(term) ||
        log.locker_doors?.lockers?.locker_number?.toString().includes(term) ||
        log.locker_doors?.door_number?.toString().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(log => 
        new Date(log.session_start) >= filterDate
      );
    }

    return filtered.sort((a, b) => new Date(b.session_start) - new Date(a.session_start));
  }, [doorLogs, searchTerm, statusFilter, dateFilter]);


  const handleView = (id) =>{
    router.push(`/client_admin/locker-management/history/${id}`)
  }

  const summaryStats = useMemo(() => {
    const activeSessions = doorLogs.filter(log => log.status === 'active').length;
    const todaySessions = doorLogs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.session_start);
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    const completedSessions = doorLogs.filter(log => log.duration_minutes);
    const avgDuration = completedSessions.length > 0 
      ? Math.round(completedSessions.reduce((sum, log) => sum + log.duration_minutes, 0) / completedSessions.length)
      : 0;
      
    const uniqueDoors = new Set(doorLogs.map(log => `${log.locker_doors?.lockers?.locker_number}-${log.locker_doors?.door_number}`)).size;
    const doorsInUse = doorLogs.filter(log => log.status === 'active').length;

    return { activeSessions, todaySessions, avgDuration, uniqueDoors, doorsInUse };
  }, [doorLogs]);


  /*
  useEffect(() => {
    const fetchDoorLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          setError("User not authenticated.");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, client_id, role')
          .eq('id', authUser.id)
          .single();

        if (profileError || !profile?.client_id) {
          setError("Error fetching user profile.");
          return;
        }

        setUserRole(profile.role || 'user');

        // Modify this query based on your actual schema
        const { data: doorLogsData, error: logsError } = await supabase
          .from('door_usage_sessions') // Your table name
          .select(`
            id,
            user_id,
            door_id,
            session_start,
            session_end,
            duration_minutes,
            status,
            locker_doors (
              id,
              door_number,
              client_id,
              assigned_user_id,
              lockers (
                id,
                locker_number
              )
            ),
            clients_users (
              id,
              full_name,
              email
            )
          `)
          .eq('locker_doors.client_id', profile.client_id)
          .order('session_start', { ascending: false });

        if (logsError) {
          setError(`Error fetching door usage logs: ${logsError.message}`);
          return;
        }

        setDoorLogs(doorLogsData || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoorLogs();
  }, []);
  */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading door usage logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Door Usage Logs</h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'admin' 
              ? 'Monitor door usage sessions and user activity' 
              : 'View your door usage history'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.activeSessions}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions Today</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryStats.todaySessions}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-purple-600">{formatDuration(summaryStats.avgDuration)}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doors in Use</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {summaryStats.doorsInUse} / {summaryStats.uniqueDoors}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Usage Sessions ({filteredLogs.length})
            </CardTitle>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by user, locker, or door number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active Sessions</option>
              <option value="completed">Completed Sessions</option>
            </select>
            
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </CardHeader>
        
        <CardContent>
          <DataTable
            data={filteredLogs}
            columns={columns}
            onAction={handleView}
            getRowKey={(item) => item.id}
            emptyStateMessage={
              searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? "No matching door usage sessions found."
                : "No door usage sessions recorded yet."
            }
            searchTerm={searchTerm}
            allowedActions={['view']}
            className="border border-gray-200 rounded-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DoorUsageLogsPage;