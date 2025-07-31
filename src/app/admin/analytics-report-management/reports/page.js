'use client'
import React, { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  User,
  Building2,
  Briefcase,
  Timer,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';

const ReportPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for reports
  const timeRanges = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'it', label: 'IT Department' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' }
  ];

  // Overview Statistics
  const overviewStats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12',
      changePercent: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Projects',
      value: '36',
      change: '+4',
      changePercent: '+12.5%',
      trend: 'up',
      icon: Target,
      color: 'emerald'
    },
    {
      title: 'Hours Worked',
      value: '9,847',
      change: '-124',
      changePercent: '-1.2%',
      trend: 'down',
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Completion Rate',
      value: '87.3%',
      change: '+2.4%',
      changePercent: '+2.8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  // Attendance Summary
  const attendanceData = [
    { department: 'IT Department', present: 45, absent: 3, late: 2, total: 50, percentage: 90 },
    { department: 'Human Resources', present: 18, absent: 1, late: 1, total: 20, percentage: 90 },
    { department: 'Finance', present: 22, absent: 2, late: 1, total: 25, percentage: 88 },
    { department: 'Marketing', present: 28, absent: 1, late: 3, total: 32, percentage: 87.5 },
    { department: 'Sales', present: 35, absent: 3, late: 2, total: 40, percentage: 87.5 }
  ];

  // Project Performance
  const projectPerformance = [
    { name: 'Employee Management System', progress: 87, status: 'On Track', team: 8, dueDate: '2024-08-15' },
    { name: 'Mobile Time Tracker', progress: 65, status: 'Behind', team: 5, dueDate: '2024-09-20' },
    { name: 'Data Analytics Dashboard', progress: 92, status: 'Ahead', team: 6, dueDate: '2024-10-30' },
    { name: 'API Integration Platform', progress: 45, status: 'On Hold', team: 4, dueDate: '2024-11-15' },
    { name: 'Security Enhancement', progress: 100, status: 'Completed', team: 3, dueDate: '2024-06-30' }
  ];

  // Top Performers
  const topPerformers = [
    { name: 'Juan Cruz', department: 'IT', tasksCompleted: 24, hoursWorked: 168, efficiency: 95 },
    { name: 'Maria Santos', department: 'IT', tasksCompleted: 22, hoursWorked: 162, efficiency: 92 },
    { name: 'Ana Reyes', department: 'Design', tasksCompleted: 18, hoursWorked: 154, efficiency: 89 },
    { name: 'Carlos Lopez', department: 'IT', tasksCompleted: 20, hoursWorked: 160, efficiency: 88 },
    { name: 'Sofia Martinez', department: 'Design', tasksCompleted: 16, hoursWorked: 148, efficiency: 85 }
  ];

  // Department Analytics
  const departmentAnalytics = [
    { department: 'IT Department', employees: 50, productivity: 89, satisfaction: 4.2, budget: 150000, utilization: 92 },
    { department: 'Human Resources', employees: 20, productivity: 85, satisfaction: 4.5, budget: 80000, utilization: 88 },
    { department: 'Finance', employees: 25, productivity: 91, satisfaction: 4.1, budget: 100000, utilization: 94 },
    { department: 'Marketing', employees: 32, productivity: 83, satisfaction: 4.3, budget: 120000, utilization: 86 },
    { department: 'Sales', employees: 40, productivity: 87, satisfaction: 4.0, budget: 110000, utilization: 90 }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on track': return 'text-green-600 bg-green-100';
      case 'ahead': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-orange-600 bg-orange-100';
      case 'on hold': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? ArrowUpRight : ArrowDownRight;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const StatCard = ({ stat }) => {
    const TrendIcon = getTrendIcon(stat.trend);
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center ${getTrendColor(stat.trend)}`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{stat.changePercent}</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.title}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stat.change} from last period
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive insights into your organization's performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/50 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 flex items-center transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'attendance', label: 'Attendance', icon: Users },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'departments', label: 'Departments', icon: Building2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Chart */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Weekly Attendance</h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Attendance Chart</p>
                    <p className="text-sm text-gray-500">Weekly attendance trends</p>
                  </div>
                </div>
              </div>

              {/* Project Progress Chart */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Project Progress</h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="h-64 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Progress Chart</p>
                    <p className="text-sm text-gray-500">Overall project completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Summary */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Attendance by Department</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Today, July 17, 2024</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Department</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Present</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Absent</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Late</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Total</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((dept, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{dept.department}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {dept.present}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {dept.absent}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {dept.late}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-800">{dept.total}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${dept.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-800">{dept.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Project Performance */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Project Performance Overview</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {projectPerformance.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{project.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">{project.team} team members</span>
                          <span className="text-sm text-gray-600">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-gray-800">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Top Performers */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Top Performers This Month</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{performer.name}</h4>
                        <p className="text-sm text-gray-600">{performer.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-800">{performer.tasksCompleted}</p>
                        <p className="text-gray-600">Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-800">{performer.hoursWorked}h</p>
                        <p className="text-gray-600">Hours</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-600">{performer.efficiency}%</p>
                        <p className="text-gray-600">Efficiency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-6">
            {/* Department Analytics */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Department Analytics</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Export Data</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Department</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Employees</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Productivity</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Satisfaction</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentAnalytics.map((dept, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{dept.department}</div>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-800">{dept.employees}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${dept.productivity}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-800">{dept.productivity}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <Award className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold text-gray-800">{dept.satisfaction}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-blue-600">{dept.utilization}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;