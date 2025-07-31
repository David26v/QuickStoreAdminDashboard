'use client'
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  DollarSign,
  FileText,
  Download,
  MoreHorizontal,
  Users,
  TrendingUp,
  Calculator,
  Briefcase,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Trash2,
  Check,
  X,
  CreditCard,
  Receipt,
  Send,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Wallet,
  PieChart,
  BarChart3,
  RefreshCw,
  Printer,
  Shield,
  Home,
  Car,
  Heart,
  Stethoscope,
  GraduationCap,
  Percent,
  Target,
  Calendar as CalendarIcon
} from 'lucide-react';

const PayrollPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayPeriod, setFilterPayPeriod] = useState('current');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock payroll data
  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employee: {
        id: 1,
        name: 'Juan Cruz',
        position: 'Project Manager',
        department: 'IT Department',
        email: 'juan.cruz@company.com',
        phone: '+1 (555) 123-4567',
        employeeId: 'EMP001',
        hireDate: '2022-01-15',
        address: '123 Main St, Quezon City, Metro Manila',
        avatar: '/api/placeholder/40/40'
      },
      payPeriod: {
        start: '2024-07-01',
        end: '2024-07-15',
        payDate: '2024-07-20'
      },
      salary: {
        baseSalary: 75000,
        hourlyRate: 36.06,
        hoursWorked: 80,
        overtimeHours: 5,
        overtimeRate: 54.09
      },
      earnings: {
        basePay: 2884.62,
        overtime: 270.45,
        bonus: 500,
        commission: 0,
        allowances: {
          meal: 200,
          transportation: 150,
          housing: 300
        },
        total: 4305.07
      },
      deductions: {
        federal: {
          incomeTax: 432.61,
          socialSecurity: 266.71,
          medicare: 62.42
        },
        state: {
          incomeTax: 172.20,
          disability: 43.05
        },
        benefits: {
          healthInsurance: 250,
          dental: 35,
          vision: 15,
          retirement401k: 215.25
        },
        other: {
          unionDues: 25,
          parking: 50
        },
        total: 1567.24
      },
      netPay: 2737.83,
      yearToDate: {
        grossPay: 61621.00,
        deductions: 22463.44,
        netPay: 39157.56
      },
      paymentMethod: 'direct_deposit',
      status: 'paid',
      payslipSent: true,
      lastSent: '2024-07-20'
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
        employeeId: 'EMP002',
        hireDate: '2022-03-01',
        address: '456 Oak Ave, Makati City, Metro Manila',
        avatar: '/api/placeholder/40/40'
      },
      payPeriod: {
        start: '2024-07-01',
        end: '2024-07-15',
        payDate: '2024-07-20'
      },
      salary: {
        baseSalary: 65000,
        hourlyRate: 31.25,
        hoursWorked: 80,
        overtimeHours: 3,
        overtimeRate: 46.88
      },
      earnings: {
        basePay: 2500.00,
        overtime: 140.64,
        bonus: 0,
        commission: 0,
        allowances: {
          meal: 200,
          transportation: 150,
          housing: 250
        },
        total: 3240.64
      },
      deductions: {
        federal: {
          incomeTax: 324.06,
          socialSecurity: 200.72,
          medicare: 46.99
        },
        state: {
          incomeTax: 129.63,
          disability: 32.41
        },
        benefits: {
          healthInsurance: 250,
          dental: 35,
          vision: 15,
          retirement401k: 162.03
        },
        other: {
          unionDues: 0,
          parking: 50
        },
        total: 1245.84
      },
      netPay: 1994.80,
      yearToDate: {
        grossPay: 46483.00,
        deductions: 17864.04,
        netPay: 28618.96
      },
      paymentMethod: 'direct_deposit',
      status: 'pending',
      payslipSent: false,
      lastSent: null
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
        employeeId: 'EMP003',
        hireDate: '2021-11-15',
        address: '789 Pine St, Pasig City, Metro Manila',
        avatar: '/api/placeholder/40/40'
      },
      payPeriod: {
        start: '2024-07-01',
        end: '2024-07-15',
        payDate: '2024-07-20'
      },
      salary: {
        baseSalary: 70000,
        hourlyRate: 33.65,
        hoursWorked: 80,
        overtimeHours: 8,
        overtimeRate: 50.48
      },
      earnings: {
        basePay: 2692.31,
        overtime: 403.84,
        bonus: 250,
        commission: 0,
        allowances: {
          meal: 200,
          transportation: 150,
          housing: 275
        },
        total: 3971.15
      },
      deductions: {
        federal: {
          incomeTax: 397.12,
          socialSecurity: 246.21,
          medicare: 57.58
        },
        state: {
          incomeTax: 158.85,
          disability: 39.71
        },
        benefits: {
          healthInsurance: 250,
          dental: 35,
          vision: 15,
          retirement401k: 198.56
        },
        other: {
          unionDues: 25,
          parking: 50
        },
        total: 1473.03
      },
      netPay: 2498.12,
      yearToDate: {
        grossPay: 56924.00,
        deductions: 21122.63,
        netPay: 35801.37
      },
      paymentMethod: 'check',
      status: 'processing',
      payslipSent: false,
      lastSent: null
    }
  ]);

  const payPeriods = [
    { value: 'current', label: 'Current Pay Period (Jul 1-15, 2024)' },
    { value: 'previous', label: 'Previous Pay Period (Jun 16-30, 2024)' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'IT Department', label: 'IT Department' },
    { value: 'Design', label: 'Design' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-600' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-600' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-600' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-600' }
  ];

  const handleSendPayslip = (employeeId) => {
    setPayrollData(prev => prev.map(payroll => 
      payroll.employee.id === employeeId 
        ? { 
            ...payroll, 
            payslipSent: true,
            lastSent: new Date().toISOString().split('T')[0]
          }
        : payroll
    ));
  };

  const handleBulkSendPayslips = () => {
    setPayrollData(prev => prev.map(payroll => ({
      ...payroll,
      payslipSent: true,
      lastSent: new Date().toISOString().split('T')[0]
    })));
  };

  const handleProcessPayroll = (employeeId) => {
    setPayrollData(prev => prev.map(payroll => 
      payroll.employee.id === employeeId 
        ? { ...payroll, status: 'paid' }
        : payroll
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusConfig = statuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-600';
  };

  const filteredPayroll = payrollData.filter(payroll => {
    const matchesSearch = payroll.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || payroll.employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || payroll.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate statistics
  const totalGrossPay = payrollData.reduce((sum, p) => sum + p.earnings.total, 0);
  const totalNetPay = payrollData.reduce((sum, p) => sum + p.netPay, 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + p.deductions.total, 0);
  const pendingPayments = payrollData.filter(p => p.status === 'pending').length;

  const PayrollCard = ({ payroll }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {payroll.employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{payroll.employee.name}</h3>
            <p className="text-sm text-gray-600">{payroll.employee.position}</p>
            <p className="text-xs text-gray-500">{payroll.employee.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}>
            {payroll.status}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Pay Period */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Pay Period</p>
            <p className="text-sm text-gray-600">
              {new Date(payroll.payPeriod.start).toLocaleDateString()} - {new Date(payroll.payPeriod.end).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Pay Date</p>
            <p className="text-sm text-gray-600">{new Date(payroll.payPeriod.payDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Gross Pay</p>
            <p className="font-bold text-lg text-green-700">{formatCurrency(payroll.earnings.total)}</p>
          </div>
          <div>
            <p className="text-gray-600">Net Pay</p>
            <p className="font-bold text-lg text-blue-700">{formatCurrency(payroll.netPay)}</p>
          </div>
          <div>
            <p className="text-gray-600">Deductions</p>
            <p className="font-medium text-red-600">{formatCurrency(payroll.deductions.total)}</p>
          </div>
          <div>
            <p className="text-gray-600">Hours</p>
            <p className="font-medium text-gray-800">{payroll.salary.hoursWorked}h</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4 p-3 bg-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {payroll.paymentMethod === 'direct_deposit' ? (
              <CreditCard className="w-4 h-4 text-purple-600" />
            ) : (
              <Receipt className="w-4 h-4 text-purple-600" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {payroll.paymentMethod === 'direct_deposit' ? 'Direct Deposit' : 'Check'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {payroll.payslipSent ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">Sent</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">Pending</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button 
          onClick={() => setSelectedEmployee(payroll)}
          className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        
        {!payroll.payslipSent && (
          <button 
            onClick={() => handleSendPayslip(payroll.employee.id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-1" />
            Send Payslip
          </button>
        )}
        
        {payroll.status === 'pending' && (
          <button 
            onClick={() => handleProcessPayroll(payroll.employee.id)}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Process
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Payroll Management System
              </h1>
              <p className="text-gray-600 mt-1">Automated salary calculations, tax deductions, and payslip distribution</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/50 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 flex items-center transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </button>
              <button 
                onClick={handleBulkSendPayslips}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Send All Payslips
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Calculator className="w-5 h-5 mr-2" />
                Run Payroll
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Gross Pay</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalGrossPay)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Net Pay</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalNetPay)}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalDeductions)}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-800">{pendingPayments}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterPayPeriod}
              onChange={(e) => setFilterPayPeriod(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {payPeriods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Payroll Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayroll.map((payroll) => (
            <PayrollCard key={payroll.id} payroll={payroll} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPayroll.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No payroll records found</h3>
            <p className="text-gray-600 mb-6">No records match your current filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('all');
                setFilterStatus('all');
                setFilterPayPeriod('current');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Detailed Payroll Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedEmployee.employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedEmployee.employee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.employee.position} • {selectedEmployee.employee.employeeId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Pay Stub Overview', icon: Eye },
                  { id: 'earnings', label: 'Earnings Details', icon: DollarSign },
                  { id: 'deductions', label: 'Deductions', icon: Receipt },
                  { id: 'taxes', label: 'Tax Information', icon: FileText },
                  { id: 'benefits', label: 'Benefits', icon: Heart },
                  { id: 'payslip', label: 'Send Payslip', icon: Send }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    
                    {/* Pay Period Info */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Pay Period Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Pay Period</p>
                          <p className="font-medium">{new Date(selectedEmployee.payPeriod.start).toLocaleDateString()} - {new Date(selectedEmployee.payPeriod.end).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pay Date</p>
                          <p className="font-medium">{new Date(selectedEmployee.payPeriod.payDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEmployee.status)}`}>
                            {selectedEmployee.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-2">Gross Pay</h4>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(selectedEmployee.earnings.total)}</p>
                        <div className="mt-4 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base Pay:</span>
                            <span>{formatCurrency(selectedEmployee.earnings.basePay)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overtime:</span>
                            <span>{formatCurrency(selectedEmployee.earnings.overtime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Allowances:</span>
                            <span>{formatCurrency(Object.values(selectedEmployee.earnings.allowances).reduce((a, b) => a + b, 0))}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-6">
                        <h4 className="font-semibold text-red-800 mb-2">Total Deductions</h4>
                        <p className="text-3xl font-bold text-red-700">{formatCurrency(selectedEmployee.deductions.total)}</p>
                        <div className="mt-4 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Federal Taxes:</span>
                            <span>{formatCurrency(Object.values(selectedEmployee.deductions.federal).reduce((a, b) => a + b, 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>State Taxes:</span>
                            <span>{formatCurrency(Object.values(selectedEmployee.deductions.state).reduce((a, b) => a + b, 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Benefits:</span>
                            <span>{formatCurrency(Object.values(selectedEmployee.deductions.benefits).reduce((a, b) => a + b, 0))}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-800 mb-2">Net Pay</h4>
                        <p className="text-3xl font-bold text-blue-700">{formatCurrency(selectedEmployee.netPay)}</p>
                        <div className="mt-4 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="capitalize">{selectedEmployee.paymentMethod.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hours Worked:</span>
                            <span>{selectedEmployee.salary.hoursWorked}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overtime Hours:</span>
                            <span>{selectedEmployee.salary.overtimeHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Year to Date */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Year-to-Date Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">YTD Gross Pay</p>
                          <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedEmployee.yearToDate.grossPay)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">YTD Deductions</p>
                          <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedEmployee.yearToDate.deductions)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">YTD Net Pay</p>
                          <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedEmployee.yearToDate.netPay)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Regular Earnings */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Regular Earnings</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Base Salary (Annual):</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.salary.baseSalary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hourly Rate:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.salary.hourlyRate)}/hr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hours Worked:</span>
                            <span className="font-medium">{selectedEmployee.salary.hoursWorked}h</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Base Pay:</span>
                            <span className="font-bold text-green-700">{formatCurrency(selectedEmployee.earnings.basePay)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Overtime Earnings */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Overtime Earnings</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Overtime Rate:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.salary.overtimeRate)}/hr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overtime Hours:</span>
                            <span className="font-medium">{selectedEmployee.salary.overtimeHours}h</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Overtime Pay:</span>
                            <span className="font-bold text-blue-700">{formatCurrency(selectedEmployee.earnings.overtime)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Earnings */}
                      <div className="bg-yellow-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Additional Earnings</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Bonus:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.earnings.bonus)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Commission:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.earnings.commission)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Allowances */}
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Allowances</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Meal Allowance:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.earnings.allowances.meal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transportation:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.earnings.allowances.transportation)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Housing:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.earnings.allowances.housing)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deductions Tab */}
                {activeTab === 'deductions' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Federal Taxes */}
                      <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Federal Taxes</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Income Tax:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.federal.incomeTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Social Security:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.federal.socialSecurity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Medicare:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.federal.medicare)}</span>
                          </div>
                        </div>
                      </div>

                      {/* State Taxes */}
                      <div className="bg-orange-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">State Taxes</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>State Income Tax:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.state.incomeTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>State Disability:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.state.disability)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Benefits Deductions</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Health Insurance:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.benefits.healthInsurance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dental Insurance:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.benefits.dental)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vision Insurance:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.benefits.vision)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>401(k) Contribution:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.benefits.retirement401k)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Other Deductions */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Other Deductions</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Union Dues:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.other.unionDues)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Parking:</span>
                            <span className="font-medium">{formatCurrency(selectedEmployee.deductions.other.parking)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Send Payslip Tab */}
                {activeTab === 'payslip' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Payslip Distribution
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Employee Info */}
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-3">Employee Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Name:</span>
                              <span className="font-medium">{selectedEmployee.employee.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Employee ID:</span>
                              <span className="font-medium">{selectedEmployee.employee.employeeId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email:</span>
                              <span className="font-medium">{selectedEmployee.employee.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Department:</span>
                              <span className="font-medium">{selectedEmployee.employee.department}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payslip Status */}
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-3">Payslip Status</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Status:</span>
                              {selectedEmployee.payslipSent ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span className="text-sm font-medium">Sent</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-orange-600">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  <span className="text-sm font-medium">Not Sent</span>
                                </div>
                              )}
                            </div>
                            
                            {selectedEmployee.payslipSent && (
                              <div className="flex justify-between text-sm">
                                <span>Last Sent:</span>
                                <span className="font-medium">{new Date(selectedEmployee.lastSent).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Send Options */}
                      <div className="mt-6 bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-4">Send Payslip</h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              id="sendEmail"
                              defaultChecked
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="sendEmail" className="text-sm text-gray-700">
                              Send via Email ({selectedEmployee.employee.email})
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              id="generatePDF"
                              defaultChecked
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="generatePDF" className="text-sm text-gray-700">
                              Generate PDF Attachment
                            </label>
                          </div>

                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              id="recordDelivery"
                              defaultChecked
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="recordDelivery" className="text-sm text-gray-700">
                              Record delivery confirmation
                            </label>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                          {!selectedEmployee.payslipSent ? (
                            <button
                              onClick={() => {
                                handleSendPayslip(selectedEmployee.employee.id);
                                setSelectedEmployee({...selectedEmployee, payslipSent: true, lastSent: new Date().toISOString().split('T')[0]});
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
                            >
                              <Send className="w-5 h-5 mr-2" />
                              Send Payslip Now
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleSendPayslip(selectedEmployee.employee.id);
                                setSelectedEmployee({...selectedEmployee, lastSent: new Date().toISOString().split('T')[0]});
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
                            >
                              <Send className="w-5 h-5 mr-2" />
                              Resend Payslip
                            </button>
                          )}
                          
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors">
                            <Download className="w-5 h-5 mr-2" />
                            Download PDF
                          </button>
                          
                          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors">
                            <Printer className="w-5 h-5 mr-2" />
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
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

export default PayrollPage;