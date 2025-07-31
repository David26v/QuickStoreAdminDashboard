// components/AttendancePage.jsx (or your file path)
'use client'

import React, { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Calendar, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle, User,
  CalendarDays, Grid3X3, Search, Filter, Download,
} from 'lucide-react'
import { getStatusBadgeAttendance, getStatusColor } from '@/lib/utils'
import supabase from '@/lib/helper'
import { ModuleSkeletonLoader } from '@/components/ui/ModuleLoaders'
// Import Supabase Client

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [searchDate, setSearchDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')

  // State for data fetched from Supabase
  const [attendanceTableData, setAttendanceTableData] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          time_in,
          time_out,
          break_start,
          break_end
        `)
        .eq('user_id', user.id) 
        .order('time_in', { ascending: false }); 

      if (error) throw error;


      const transformedData = data.map((record, index) => {
        const dateObj = new Date(record.time_in);
        const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const checkInTime = record.time_in ? new Date(record.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
        const checkOutTime = record.time_out ? new Date(record.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

        let status = 'absent';
        
        if (record.time_in) {
             const checkInHour = dateObj.getHours();
             const checkInMinutes = dateObj.getMinutes();
             if (checkInHour > 9 || (checkInHour === 9 && checkInMinutes > 15)) {
                 status = 'late';
             } else {
                 status = 'present';
             }
        }
       
        let totalHoursStr = '0h 0m';
        let overtimeStr = '0h 0m';
        if (record.time_in && record.time_out) {
            const inTime = new Date(record.time_in);
            const outTime = new Date(record.time_out);
            let breakDurationMs = 0;
            if (record.break_start && record.break_end) {
                breakDurationMs = new Date(record.break_end).getTime() - new Date(record.break_start).getTime();
            }
            const totalWorkMs = outTime.getTime() - inTime.getTime() - breakDurationMs;
            const totalHours = Math.floor(totalWorkMs / (1000 * 60 * 60));
            const totalMinutes = Math.floor((totalWorkMs % (1000 * 60 * 60)) / (1000 * 60));
            totalHoursStr = `${totalHours}h ${totalMinutes}m`;

            const standardWorkMs = 8 * 60 * 60 * 1000;
            const overtimeMs = Math.max(0, totalWorkMs - standardWorkMs);
            const overtimeHours = Math.floor(overtimeMs / (1000 * 60 * 60));
            const overtimeMinutes = Math.floor((overtimeMs % (1000 * 60 * 60)) / (1000 * 60));
            overtimeStr = `${overtimeHours}h ${overtimeMinutes}m`;
        }


        return {
          id: record.id,
          date: dateStr,
          day: dayName,
          status: status, 
          checkIn: checkInTime,
          checkOut: checkOutTime,
          totalHours: totalHoursStr, 
          overtime: overtimeStr,    
        };
      });

      setAttendanceTableData(transformedData);

     
       const totalDays = transformedData.length;
       const presentDays = transformedData.filter(d => d.status === 'present').length;
       const absentDays = transformedData.filter(d => d.status === 'absent').length;
       const lateDays = transformedData.filter(d => d.status === 'late').length;
       const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0; // Example rate calculation

       setAttendanceStats({
         totalDays,
         presentDays,
         absentDays,
         lateDays,
         attendanceRate,
       });

    } 
    catch (error) {
      console.error("Error fetching attendance:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchAttendanceData();
  }, []); 


  const filteredAttendanceData = attendanceTableData.filter(record => {
    const matchesDate = !searchDate || record.date.includes(searchDate);
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const recordMonth = new Date(record.date).getMonth().toString();
    const matchesMonth = monthFilter === 'all' || recordMonth === monthFilter;
    return matchesDate && matchesStatus && matchesMonth;
  });

  const recentAttendance = filteredAttendanceData.slice(0, 5);

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isFuture = date > new Date();

      let status = 'future'; 
      if (isWeekend) {
        status = 'weekend';
      } 
      else if (!isFuture) {
        const dateString = date.toISOString().split('T')[0];
        const dataForDay = attendanceTableData.find(d => d.date === dateString);
        if (dataForDay) {
          status = dataForDay.status;
        } 
        else {
          status = 'absent';
        }
      }

      days.push({ day, status, isWeekend, isFuture });
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  if (loading) return <ModuleSkeletonLoader message="Loading your attendance data..." />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-1">Track your attendance and working hours</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Employee Dashboard</span>
        </div>
      </div>

      {/* Stats Cards - Now using fetched stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.totalDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceStats.presentDays}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absentDays}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Table
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Monthly Attendance
                    </CardTitle>
                    <CardDescription>
                      Your attendance calendar for {monthNames[selectedMonth]} {selectedYear}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11)
                          setSelectedYear(selectedYear - 1)
                        } else {
                          setSelectedMonth(selectedMonth - 1)
                        }
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0)
                          setSelectedYear(selectedYear + 1)
                        } else {
                          setSelectedMonth(selectedMonth + 1)
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day && (
                        <div className={`
                          w-full h-full rounded-lg flex items-center justify-center text-sm font-medium
                          ${getStatusColor(day.status)}
                          ${day.status === 'present' ? 'text-white' : ''}
                          ${day.status === 'absent' ? 'text-white' : ''}
                          ${day.status === 'late' ? 'text-white' : ''}
                          ${day.status === 'weekend' ? 'text-gray-600' : ''}
                          ${day.status === 'future' ? 'text-gray-400 border-2 border-dashed border-gray-300' : ''}
                          transition-all hover:scale-105
                        `}>
                          {day.day}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span className="text-sm">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span className="text-sm">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span className="text-sm">Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-300"></div>
                    <span className="text-sm">Weekend</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance - Now using fetched data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>
                  Your last 5 attendance records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>In: {record.checkIn}</span>
                        {record.checkOut !== '-' && <span>Out: {record.checkOut}</span>}
                      </div>
                    </div>
                    <div>
                      {getStatusBadgeAttendance(record.status)}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 text-xs">
                    Full History
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs">
                    Leave Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search by Date</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {monthNames.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Showing {filteredAttendanceData.length} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{record.day}</TableCell>
                      <TableCell>{getStatusBadgeAttendance(record.status)}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell className={record.overtime !== '0h 0m' ? 'font-medium text-blue-600' : ''}>
                        {record.overtime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAttendanceData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AttendancePage