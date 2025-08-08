'use client'
import React, { useState, useEffect } from 'react';
import {
  Lock,
  DoorOpen,
  DoorClosed,
  AlertTriangle,
  Activity,
  Bell,
  Building2,
  Zap,
  Users,
  History,
  Settings,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import supabase from '@/lib/helper'; 
import { useUser } from '@/components/providers/UserContext'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);
// --- Data Fetching Hooks ---
// Hook to fetch client information
const useClientInfo = (clientId) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, location')
          .eq('id', clientId)
          .single();
        if (error) throw error;
        if (!data) {
          throw new Error("Client not found.");
        }
        setClientInfo(data);
      } catch (err) {
        console.error("Error fetching client info:", err);
        setError(err.message || "Failed to load client information.");
      } finally {
        setLoading(false);
      }
    };
    fetchClientInfo();
  }, [clientId]);
  return { clientInfo, loading, error };
};
// Hook to fetch client's lockers
const useClientLockers = (clientId) => {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLockers = async () => {
      if (!clientId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('lockers')
          .select('id, name, door_count, client_id')
          .eq('client_id', clientId)
          .order('name', { ascending: true });
        if (error) throw error;
        setLockers(data || []);
      } catch (err) {
        console.error("Error fetching client lockers:", err);
        setError(err.message || "Failed to load lockers.");
      } finally {
        setLoading(false);
      }
    };
    fetchLockers();
  }, [clientId]);
  return { lockers, loading, error };
};
// Hook to fetch aggregated dashboard data (doors, activity, notifications)
const useDashboardData = (clientId) => {
  const [dashboardData, setDashboardData] = useState({
    doors: [],
    recentActivity: [],
    notifications: [],
    loading: true,
    error: null
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!clientId) return;
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // 1. Fetch doors data
        const { data: doorsData, error: doorsError } = await supabase
          .from('locker_doors')
          .select(`
            id,
            door_number,
            status,
            locker_id,
            assigned_at,
            locker:lockers!inner(name, client_id)
          `)
          .eq('locker.client_id', clientId)
          .order('locker_id', { ascending: true })
          .order('door_number', { ascending: true });
        if (doorsError) throw doorsError;

        // 2. Fetch recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('locker_door_events')
          .select(`
            id,
            event_type,
            created_at,
            locker_door_id,
            locker_door:locker_doors!inner(door_number, locker:lockers!inner(name, client_id))
          `)
          .eq('locker_door.locker.client_id', clientId)
          .order('created_at', { ascending: false })
          .limit(10);
        if (activityError) throw activityError;

        // 3. Fetch notifications (example: overdue doors)
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('locker_doors')
          .select(`
            id,
            door_number,
            status,
            assigned_at,
            locker:lockers!inner(name, client_id)
          `)
          .eq('locker.client_id', clientId)
          .eq('status', 'overdue') // Assuming 'overdue' is a valid status
          .order('assigned_at', { ascending: true }) 
          .limit(5);
        if (notificationsError) throw notificationsError;

        // Format activity data
        const formattedActivity = activityData.map(event => {
            let message = `Unknown event for Door ${event.locker_door?.door_number || 'N/A'}`;
            if (event.locker_door?.locker?.name !== undefined) {
                 message = `Door ${event.locker_door.door_number} (Locker ${event.locker_door.locker.name}) was ${event.event_type}`;
            }
            return {
                id: event.id,
                type: event.event_type,
                message: message,
                time: new Date(event.created_at).toLocaleString(),
            };
        });

        // Format notifications data
        const formattedNotifications = notificationsData.map(door => ({
            id: door.id,
            type: 'warning',
            message: `Door ${door.door_number} (Locker ${door.locker.name}) is overdue.`,
            time: door.assigned_at ? new Date(door.assigned_at).toLocaleString() : 'Unknown',
        }));

        setDashboardData({
          doors: doorsData || [],
          recentActivity: formattedActivity,
          notifications: formattedNotifications,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to load dashboard data."
        }));
      }
    };
    fetchData();
  }, [clientId]);
  return dashboardData;
};
// --- Main Component ---
const ClientDashboard = () => {
  const { clientId, loading: userContextLoading } = useUser();
  const { clientInfo, loading: clientInfoLoading, error: clientInfoError } = useClientInfo(clientId);
  const { lockers, loading: lockersLoading } = useClientLockers(clientId);
  const { doors, recentActivity, notifications, loading: dashboardDataLoading, error: dashboardDataError } = useDashboardData(clientId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Determine overall loading state
  useEffect(() => {
    if (!userContextLoading && !clientInfoLoading && !lockersLoading && !dashboardDataLoading) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [userContextLoading, clientInfoLoading, lockersLoading, dashboardDataLoading]);
  // Determine overall error state
  useEffect(() => {
     const errorMessage = clientInfoError || dashboardDataError;
     if (errorMessage) {
        setError(errorMessage);
     } else {
        setError(null);
     }
  }, [clientInfoError, dashboardDataError]);
  // Calculate statistics based on fetched data
  const totalLockers = lockers.length;
  const totalDoors = doors.length;
  const occupiedCount = doors.filter(d => d.status === 'occupied').length; // Assuming 'occupied' is a valid status
  const availableCount = doors.filter(d => d.status === 'available').length;
  const overdueCount = doors.filter(d => d.status === 'overdue').length; // Assuming 'overdue' is a valid status

  // Prepare data for charts
  const statusChartData = {
    labels: ['Occupied', 'Available', 'Overdue'],
    datasets: [
      {
        label: 'Doors',
        data: [occupiedCount, availableCount, overdueCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', 
          'rgba(34, 197, 94, 0.8)',  
          'rgba(239, 68, 68, 0.8)'  
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  const usageChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Usage %',
        data: [70, 80, 60, 90, 95, 85, 75], 
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Handle loading and error states
  if (userContextLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  if (error || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Client ID not found. Please ensure you are logged in correctly."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!clientInfo) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <AlertTitle className="text-lg font-semibold text-gray-800 mb-2">Client Not Found</AlertTitle>
              <AlertDescription className="text-gray-600">
                Unable to find information for your client account.
              </AlertDescription>
            </CardContent>
          </Card>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{clientInfo.name} - Dashboard</h1>
          {clientInfo.location && <p className="text-sm text-gray-500">Location: {clientInfo.location}</p>}
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your locker system.</p>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lockers</p>
                <p className="text-2xl font-bold text-gray-900">{totalLockers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doors</p>
                <p className="text-2xl font-bold text-gray-900">{totalDoors}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <DoorOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PieChartIcon className="w-5 h-5 mr-2 text-blue-500" />
                Door Status
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <Pie data={statusChartData} options={chartOptions} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChartIcon className="w-5 h-5 mr-2 text-orange-500" />
                Placeholder Chart
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {/* You can add another relevant chart here, e.g., doors per locker */}
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Doors per Locker (Example)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Weekly Usage Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <Line data={usageChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
        {/* Activity and Notifications & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0">
                        {activity.type === 'opened' || activity.type === 'unlocked' ? <DoorOpen className="w-4 h-4 text-blue-500" /> :
                         activity.type === 'closed' || activity.type === 'locked' ? <DoorClosed className="w-4 h-4 text-green-500" /> :
                         <Activity className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activity found.</p>
                )}
              </div>
              {/* <Button variant="ghost" className="w-full mt-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
                View all activity
              </Button> */}
            </CardContent>
          </Card>
          <div className="space-y-8">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Bell className="w-5 h-5 mr-2 text-orange-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className="mt-0.5 flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No notifications.</p>
                  )}
                </div>
                {/* <Button variant="ghost" className="w-full mt-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View all notifications
                </Button> */}
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start space-x-3">
                    <History className="w-5 h-5 text-purple-500" />
                    <span>View Overdue Reports</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start space-x-3">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>System Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
// Simple placeholder icons for chart titles
const PieChartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const BarChartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
export default ClientDashboard;