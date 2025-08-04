'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Users, Calendar, Clock, Activity, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, AlertCircle, Eye, Target, Zap, Award } from 'lucide-react';
import React from 'react';

const AdminDashboard = () => {
  // Custom color palette based on #1c69ff
  const colors = {
    primary: '#1c69ff',
    primaryLight: '#4d85ff',
    primaryDark: '#0052e6',
    success: '#00d25b',
    warning: '#ffb800',
    danger: '#ff4757',
    info: '#00d4ff',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gradient1: 'linear-gradient(135deg, #1c69ff 0%, #4d85ff 100%)',
    gradient2: 'linear-gradient(135deg, #1c69ff 0%, #8b5cf6 100%)',
    gradient3: 'linear-gradient(135deg, #00d25b 0%, #1c69ff 100%)',
  };

  const summaryMetrics = [
    {
      title: 'Total Employees',
      value: '125',
      change: '+2%',
      trend: 'up',
      description: 'vs last month',
      icon: Users,
      color: colors.primary,
      bgGradient: 'from-blue-500/10 to-blue-600/20',
    },
    {
      title: 'Attendance Today',
      value: '98',
      change: '+5%',
      trend: 'up',
      description: 'vs yesterday',
      icon: Activity,
      color: colors.success,
      bgGradient: 'from-green-500/10 to-green-600/20',
    },
    {
      title: 'Active Projects',
      value: '8',
      change: '+1%',
      trend: 'up',
      description: 'vs last week',
      icon: Target,
      color: colors.purple,
      bgGradient: 'from-purple-500/10 to-purple-600/20',
    },
    {
      title: 'Pending Requests',
      value: '4',
      change: '-10%',
      trend: 'down',
      description: 'vs last week',
      icon: Clock,
      color: colors.warning,
      bgGradient: 'from-yellow-500/10 to-yellow-600/20',
    },
  ];

  const attendanceData = [
    { day: 'Mon', present: 120, absent: 5, rate: 96 },
    { day: 'Tue', present: 118, absent: 7, rate: 94 },
    { day: 'Wed', present: 122, absent: 3, rate: 98 },
    { day: 'Thu', present: 125, absent: 0, rate: 100 },
    { day: 'Fri', present: 119, absent: 6, rate: 95 },
    { day: 'Sat', present: 95, absent: 30, rate: 76 },
    { day: 'Sun', present: 85, absent: 40, rate: 68 },
  ];

  const projectProgressData = [
    { project: 'Website Redesign', progress: 85, status: 'on-track', dueDate: '2025-07-15', team: 5 },
    { project: 'Mobile App', progress: 65, status: 'at-risk', dueDate: '2025-07-20', team: 3 },
    { project: 'API Integration', progress: 95, status: 'on-track', dueDate: '2025-07-10', team: 4 },
    { project: 'Database Migration', progress: 40, status: 'on-track', dueDate: '2025-08-01', team: 2 },
    { project: 'Security Audit', progress: 25, status: 'delayed', dueDate: '2025-07-25', team: 6 },
  ];

  const leaveRequestData = [
    { name: 'Approved', value: 24, color: colors.success },
    { name: 'Pending', value: 4, color: colors.warning },
    { name: 'Rejected', value: 3, color: colors.danger },
  ];

  const monthlyTrendsData = [
    { month: 'Jan', employees: 115, attendance: 92, projects: 6 },
    { month: 'Feb', employees: 118, attendance: 94, projects: 7 },
    { month: 'Mar', employees: 120, attendance: 91, projects: 8 },
    { month: 'Apr', employees: 123, attendance: 95, projects: 8 },
    { month: 'May', employees: 125, attendance: 98, projects: 8 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 45, color: colors.primary },
    { name: 'Marketing', value: 25, color: colors.info },
    { name: 'Sales', value: 20, color: colors.success },
    { name: 'HR', value: 15, color: colors.purple },
    { name: 'Finance', value: 12, color: colors.pink },
    { name: 'Operations', value: 8, color: colors.warning },
  ];

  const performanceData = [
    { metric: 'Productivity', value: 85, max: 100 },
    { metric: 'Team Satisfaction', value: 92, max: 100 },
    { metric: 'Goal Achievement', value: 78, max: 100 },
    { metric: 'Innovation Index', value: 88, max: 100 },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'submitted leave request', time: '2 minutes ago', type: 'leave' },
    { user: 'Sarah Smith', action: 'completed project milestone', time: '15 minutes ago', type: 'project' },
    { user: 'Mike Johnson', action: 'checked in', time: '1 hour ago', type: 'attendance' },
    { user: 'Emily Brown', action: 'updated project status', time: '2 hours ago', type: 'project' },
    { user: 'Alex Wilson', action: 'requested overtime approval', time: '3 hours ago', type: 'request' },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'on-track': { variant: 'default', icon: CheckCircle, text: 'On Track', color: colors.success },
      'at-risk': { variant: 'secondary', icon: AlertCircle, text: 'At Risk', color: colors.warning },
      'delayed': { variant: 'destructive', icon: XCircle, text: 'Delayed', color: colors.danger },
    };
    
    const config = statusConfig[status] || statusConfig['on-track'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getActivityIcon = (type) => {
    const icons = {
      leave: Calendar,
      project: Target,
      attendance: Activity,
      request: Clock,
    };
    return icons[type] || Activity;
  };

  return (
    <div className="min-h-screen ">
      <div className="flex-1 space-y-8 p-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="relative p-8 rounded-3xl border border-blue-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ background: colors.gradient1 }}></div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Monitor and manage your organization&apos;s performance
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50">
                  <Eye className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="font-semibold" style={{ color: colors.primary }}>Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {summaryMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                <div className={`h-1 bg-gradient-to-r ${metric.bgGradient}`}></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </CardTitle>
                    <div 
                      className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${metric.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: metric.color }} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                    <div className="flex items-center gap-2">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                      <span className="text-sm text-gray-500">{metric.description}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Charts Grid */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Attendance Trends */}
          <Card className="md:col-span-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
                  <TrendingUp className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <CardTitle className="text-xl">Weekly Attendance Analytics</CardTitle>
                  <CardDescription>Real-time attendance tracking and trends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                            <p className="font-semibold text-gray-800">{label}</p>
                            <p style={{ color: colors.primary }}>
                              Present: {payload[0]?.value}
                            </p>
                            <p className="text-gray-500">
                              Attendance Rate: {payload[0]?.payload?.rate}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke={colors.primary}
                    strokeWidth={3}
                    fill="url(#attendanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="md:col-span-4 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.success}15` }}>
                  <Award className="h-5 w-5" style={{ color: colors.success }} />
                </div>
                <div>
                  <CardTitle>Performance KPIs</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                      <span className="text-sm font-bold" style={{ color: colors.primary }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${item.value}%`,
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Progress & Department Distribution */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Enhanced Project Progress */}
          <Card className="md:col-span-7 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.purple}15` }}>
                  <Target className="h-5 w-5" style={{ color: colors.purple }} />
                </div>
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Current project status and progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectProgressData.map((project, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{project.project}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                          <span>Team: {project.team} members</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: colors.primary }}>
                          {project.progress}%
                        </span>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="md:col-span-5 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.info}15` }}>
                  <Users className="h-5 w-5" style={{ color: colors.info }} />
                </div>
                <div>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee allocation by department</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-semibold">{payload[0].payload.name}</p>
                            <p style={{ color: payload[0].payload.color }}>
                              {payload[0].value} employees
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                    <span className="text-xs text-gray-600">{dept.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Recent Activity & Leave Requests */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Enhanced Recent Activity */}
          <Card className="md:col-span-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.success}15` }}>
                  <Activity className="h-5 w-5" style={{ color: colors.success }} />
                </div>
                <div>
                  <CardTitle>Recent Activity Feed</CardTitle>
                  <CardDescription>Latest updates and actions from your team</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
                      <div 
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        {activity.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card className="md:col-span-4 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.warning}15` }}>
                  <Calendar className="h-5 w-5" style={{ color: colors.warning }} />
                </div>
                <div>
                  <CardTitle>Leave Overview</CardTitle>
                  <CardDescription>Current month summary</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={leaveRequestData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leaveRequestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-4">
                {leaveRequestData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;