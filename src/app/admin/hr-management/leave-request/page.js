'use client'
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MoreHorizontal,
  FileText,
  Users,
  TrendingUp,
  CalendarDays,
  Briefcase,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Trash2,
  Check,
  X,
  Coffee,
  Plane,
  Heart,
  Stethoscope,
  GraduationCap,
  Baby,
  Home,
  RefreshCw
} from 'lucide-react';

const LeaveRequestPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock leave request data
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: {
        id: 1,
        name: 'Juan Cruz',
        position: 'Project Manager',
        department: 'IT Department',
        email: 'juan.cruz@company.com',
        phone: '+1 (555) 123-4567',
        avatar: '/api/placeholder/40/40'
      },
      type: 'vacation',
      startDate: '2024-07-25',
      endDate: '2024-07-29',
      totalDays: 5,
      reason: 'Family vacation to the Philippines',
      status: 'pending',
      submittedDate: '2024-07-16',
      approvedBy: null,
      approvedDate: null,
      comments: 'Planning a family trip to visit relatives',
      attachments: ['vacation-itinerary.pdf'],
      emergencyContact: {
        name: 'Maria Cruz',
        relationship: 'Wife',
        phone: '+1 (555) 987-6543'
      }
    },
    {
      id: 2,
      employee: {
        id: 2,
        name: 'Maria Santos',
        position: 'Frontend Developer',
        department: 'IT Department',
        email: 'maria.santos@company.com',
        phone: '+1 (555) 234-5678',
        avatar: '/api/placeholder/40/40'
      },
      type: 'sick',
      startDate: '2024-07-18',
      endDate: '2024-07-19',
      totalDays: 2,
      reason: 'Flu symptoms and doctor consultation',
      status: 'approved',
      submittedDate: '2024-07-17',
      approvedBy: 'Juan Cruz',
      approvedDate: '2024-07-17',
      comments: 'Medical certificate attached',
      attachments: ['medical-certificate.pdf'],
      emergencyContact: {
        name: 'Jose Santos',
        relationship: 'Husband',
        phone: '+1 (555) 876-5432'
      }
    },
    {
      id: 3,
      employee: {
        id: 3,
        name: 'Carlos Lopez',
        position: 'Mobile Developer',
        department: 'IT Department',
        email: 'carlos.lopez@company.com',
        phone: '+1 (555) 345-6789',
        avatar: '/api/placeholder/40/40'
      },
      type: 'personal',
      startDate: '2024-08-01',
      endDate: '2024-08-01',
      totalDays: 1,
      reason: 'Moving to new apartment',
      status: 'rejected',
      submittedDate: '2024-07-15',
      approvedBy: 'Juan Cruz',
      approvedDate: '2024-07-16',
      comments: 'Need to reschedule due to project deadline',
      attachments: [],
      rejectionReason: 'Critical project milestone deadline conflicts with requested date',
      emergencyContact: {
        name: 'Ana Lopez',
        relationship: 'Sister',
        phone: '+1 (555) 765-4321'
      }
    },
    {
      id: 4,
      employee: {
        id: 4,
        name: 'Ana Reyes',
        position: 'UI/UX Designer',
        department: 'Design',
        email: 'ana.reyes@company.com',
        phone: '+1 (555) 456-7890',
        avatar: '/api/placeholder/40/40'
      },
      type: 'maternity',
      startDate: '2024-09-01',
      endDate: '2024-11-01',
      totalDays: 60,
      reason: 'Maternity leave for newborn care',
      status: 'approved',
      submittedDate: '2024-07-10',
      approvedBy: 'HR Manager',
      approvedDate: '2024-07-11',
      comments: 'Congratulations! All documentation has been processed.',
      attachments: ['maternity-documents.pdf', 'doctor-clearance.pdf'],
      emergencyContact: {
        name: 'Miguel Reyes',
        relationship: 'Husband',
        phone: '+1 (555) 654-3210'
      }
    },
    {
      id: 5,
      employee: {
        id: 5,
        name: 'Sofia Martinez',
        position: 'UI Designer',
        department: 'Design',
        email: 'sofia.martinez@company.com',
        phone: '+1 (555) 567-8901',
        avatar: '/api/placeholder/40/40'
      },
      type: 'study',
      startDate: '2024-08-15',
      endDate: '2024-08-16',
      totalDays: 2,
      reason: 'Attending UX Design Conference',
      status: 'pending',
      submittedDate: '2024-07-14',
      approvedBy: null,
      approvedDate: null,
      comments: 'Professional development opportunity to learn latest design trends',
      attachments: ['conference-details.pdf'],
      emergencyContact: {
        name: 'Diego Martinez',
        relationship: 'Brother',
        phone: '+1 (555) 543-2109'
      }
    }
  ]);

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation', icon: Plane, color: 'bg-blue-100 text-blue-600' },
    { value: 'sick', label: 'Sick Leave', icon: Stethoscope, color: 'bg-red-100 text-red-600' },
    { value: 'personal', label: 'Personal', icon: User, color: 'bg-purple-100 text-purple-600' },
    { value: 'maternity', label: 'Maternity', icon: Baby, color: 'bg-pink-100 text-pink-600' },
    { value: 'paternity', label: 'Paternity', icon: Heart, color: 'bg-green-100 text-green-600' },
    { value: 'study', label: 'Study Leave', icon: GraduationCap, color: 'bg-indigo-100 text-indigo-600' },
    { value: 'emergency', label: 'Emergency', icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
    { value: 'bereavement', label: 'Bereavement', icon: Home, color: 'bg-gray-100 text-gray-600' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-600', icon: Clock },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-600', icon: XCircle }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'IT Department', label: 'IT Department' },
    { value: 'Design', label: 'Design' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' }
  ];

  const handleApprove = (requestId) => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'approved', 
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
  };

  const handleReject = (requestId, reason = 'Not specified') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'rejected', 
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason
          }
        : request
    ));
  };

  const getLeaveTypeConfig = (type) => {
    return leaveTypes.find(t => t.value === type) || leaveTypes[0];
  };

  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString();
    }
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const calculateDaysUntil = (date) => {
    const targetDate = new Date(date);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesDepartment = filterDepartment === 'all' || request.employee.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  // Statistics
  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length;
  const totalDaysRequested = leaveRequests.reduce((sum, r) => sum + r.totalDays, 0);

  const LeaveRequestCard = ({ request }) => {
    const typeConfig = getLeaveTypeConfig(request.type);
    const statusConfig = getStatusConfig(request.status);
    const TypeIcon = typeConfig.icon;
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {request.employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{request.employee.name}</h3>
              <p className="text-sm text-gray-600">{request.employee.position}</p>
              <p className="text-xs text-gray-500">{request.employee.department}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Leave Type */}
        <div className="mb-4">
          <div className={`inline-flex items-center px-3 py-2 rounded-lg ${typeConfig.color}`}>
            <TypeIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{typeConfig.label}</span>
          </div>
        </div>

        {/* Dates and Duration */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Dates</p>
              <p className="font-medium">{formatDateRange(request.startDate, request.endDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-medium">{request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}</p>
            </div>
            <div>
              <p className="text-gray-600">Starts in</p>
              <p className="font-medium">{calculateDaysUntil(request.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">Submitted</p>
              <p className="font-medium">{new Date(request.submittedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Reason</p>
          <p className="text-sm text-gray-800">{request.reason}</p>
        </div>

        {/* Emergency Contact */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Emergency Contact</p>
          <p className="text-sm text-gray-600">
            {request.emergencyContact.name} ({request.emergencyContact.relationship})
          </p>
          <p className="text-xs text-gray-500">{request.emergencyContact.phone}</p>
        </div>

        {/* Attachments */}
        {request.attachments.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Attachments</p>
            <div className="space-y-1">
              {request.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 hover:underline cursor-pointer">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval Info */}
        {request.status !== 'pending' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedBy}
            </p>
            <p className="text-xs text-gray-500">on {new Date(request.approvedDate).toLocaleDateString()}</p>
            {request.rejectionReason && (
              <p className="text-sm text-red-600 mt-2">{request.rejectionReason}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setSelectedRequest(request)}
            className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>
          
          {request.status === 'pending' && (
            <>
              <button 
                onClick={() => handleApprove(request.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </button>
              <button 
                onClick={() => handleReject(request.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </button>
            </>
          )}
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
                Leave Request Management
              </h1>
              <p className="text-gray-600 mt-1">Manage employee leave requests and maintain attendance records</p>
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-gray-800">{totalRequests}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{pendingRequests}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-3xl font-bold text-gray-800">{approvedRequests}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Days</p>
                <p className="text-3xl font-bold text-gray-800">{totalDaysRequested}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees or reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {leaveTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Leave Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <LeaveRequestCard key={request.id} request={request} />
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No leave requests found</h3>
            <p className="text-gray-600 mb-6">No requests match your current filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterType('all');
                setFilterDepartment('all');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Leave Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedRequest.employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.employee.name}</h2>
                    <p className="text-gray-600">{selectedRequest.employee.position} • {selectedRequest.employee.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Leave Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Leave Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {React.createElement(getLeaveTypeConfig(selectedRequest.type).icon, { className: "w-5 h-5 text-blue-600" })}
                          <div>
                            <p className="font-medium">{getLeaveTypeConfig(selectedRequest.type).label}</p>
                            <p className="text-sm text-gray-600">Leave Type</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">{formatDateRange(selectedRequest.startDate, selectedRequest.endDate)}</p>
                            <p className="text-sm text-gray-600">Duration: {selectedRequest.totalDays} days</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {React.createElement(getStatusConfig(selectedRequest.status).icon, { className: "w-5 h-5" })}
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedRequest.status).color}`}>
                              {getStatusConfig(selectedRequest.status).label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">Status</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employee Contact */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Employee Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{selectedRequest.employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{selectedRequest.employee.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{selectedRequest.employee.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Emergency Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">{selectedRequest.emergencyContact.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">{selectedRequest.emergencyContact.relationship}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">{selectedRequest.emergencyContact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    
                    {/* Reason & Comments */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Reason for Leave</h3>
                      <p className="text-gray-700 mb-4">{selectedRequest.reason}</p>
                      
                      {selectedRequest.comments && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Additional Comments</h4>
                          <p className="text-gray-600 text-sm">{selectedRequest.comments}</p>
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    {selectedRequest.attachments.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Attachments</h3>
                        <div className="space-y-2">
                          {selectedRequest.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="text-sm">{attachment}</span>
                              </div>
                              <button className="text-purple-600 hover:text-purple-800 text-sm">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approval History */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Request Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Request Submitted</p>
                            <p className="text-xs text-gray-600">{new Date(selectedRequest.submittedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {selectedRequest.status !== 'pending' && (
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedRequest.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium">
                                {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'} by {selectedRequest.approvedBy}
                              </p>
                              <p className="text-xs text-gray-600">{new Date(selectedRequest.approvedDate).toLocaleDateString()}</p>
                              {selectedRequest.rejectionReason && (
                                <p className="text-xs text-red-600 mt-1">{selectedRequest.rejectionReason}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) {
                          handleReject(selectedRequest.id, reason);
                          setSelectedRequest(null);
                        }
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestPage;