// app/users/payroll/page.js
"use client";

import React, { useState } from 'react';
// Import Shadcn UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // For main navigation tabs
import { Label } from "@/components/ui/label"; // For Payment Method form

// Import Lucide React Icons
import {
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Wallet,
  TrendingUp,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Bot, // For AI Assistant Icon (if used)
  Send, // For Send Message Icon (if used)
  X, // For Closing Drawer/Modals (if used)
  Heart, // For Benefits Icon
  Banknote, // For Payment Methods Icon
  Plus, // For Add Payment Method
  Settings, // For Settings/Preferences
  Receipt, // For Payment History
} from 'lucide-react';

// Mock employee data (would come from auth/context/API in reality)
const mockEmployeeData = {
  id: "emp_12345",
  name: "Juan Dela Cruz",
  position: "Senior Software Engineer",
  department: "Engineering",
  email: "juan.delacruz@company.com",
  phone: "+63 (912) 345-6789",
  address: "123 Main Street, Makati City, Philippines",
  startDate: "2020-05-15",
  payFrequency: "Bi-Weekly", // Could be Monthly, Weekly, etc.
  payRate: "₱850.00", // Hourly or could be annual salary
  annualSalary: "₱1,200,000.00", // If applicable
  primaryPaymentMethod: {
    type: "Direct Deposit",
    bankName: "Banko de Oro",
    accountType: "Checking",
    accountLast4: "5678",
    status: "Active",
  },
  alternativePaymentMethods: [
    { id: 1, type: "Check", status: "Inactive", lastUsed: "2023-12-15" },
    // { id: 2, type: "PayPal", status: "Inactive", details: "user@example.com" }, // Example of another type
  ],
};

// Mock payroll history data (Payslips)
const mockPayslipHistory = [
  { id: 1, period: "Oct 1 - 15, 2024", grossPay: "₱250,000.00", netPay: "₱210,500.00", status: "Paid", datePaid: "2024-10-16", payslipUrl: "#", paymentMethod: "Direct Deposit (****5678)" },
  { id: 2, period: "Sep 16 - 30, 2024", grossPay: "₱245,000.00", netPay: "₱205,750.00", status: "Paid", datePaid: "2024-10-01", payslipUrl: "#", paymentMethod: "Direct Deposit (****5678)" },
  { id: 3, period: "Sep 1 - 15, 2024", grossPay: "₱240,000.00", netPay: "₱201,000.00", status: "Paid", datePaid: "2024-09-16", payslipUrl: "#", paymentMethod: "Direct Deposit (****5678)" },
  { id: 4, period: "Aug 16 - 31, 2024", grossPay: "₱235,000.00", netPay: "₱196,250.00", status: "Paid", datePaid: "2024-09-01", payslipUrl: "#", paymentMethod: "Direct Deposit (****5678)" },
  { id: 5, period: "Aug 1 - 15, 2024", grossPay: "₱230,000.00", netPay: "₱191,500.00", status: "Paid", datePaid: "2024-08-16", payslipUrl: "#", paymentMethod: "Direct Deposit (****5678)" },
];

// Mock benefits data
const mockBenefits = [
  { id: 1, name: "Health Insurance", provider: "MediCare Plus", status: "Active", endDate: "2025-05-15" },
  { id: 2, name: "Retirement Plan (SSS)", contribution: "₱5,000/mo", status: "Active", endDate: "N/A" },
  { id: 3, name: "Paid Time Off (PTO)", balance: "12 days", status: "Active", endDate: "N/A" },
];

// Mock tax documents (Year-end)
const mockTaxDocuments = [
  { id: 1, type: "W-2", year: "2023", status: "Available", downloadUrl: "#" },
  { id: 2, type: "1099-MISC", year: "2023", status: "Not Applicable", downloadUrl: null },
];

const PayrollPage = () => {
  const [employeeData] = useState(mockEmployeeData);
  const [payslipHistory] = useState(mockPayslipHistory);
  const [benefits] = useState(mockBenefits);
  const [taxDocuments] = useState(mockTaxDocuments);
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // State for main tabs

  // --- Payment Method State (Placeholder) ---
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "Direct Deposit",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  // --- Payment Method Functions (Placeholder) ---
  const handleAddPaymentMethod = () => {
    alert("Add Payment Method functionality would be implemented here.");
    // In a real app, you would:
    // 1. Validate the newPaymentMethod state.
    // 2. Call an API to save the new payment method.
    // 3. Update the employeeData state or refetch data.
    // 4. Reset the form.
    console.log("Adding new payment method:", newPaymentMethod);
    // Reset form for demo
    setNewPaymentMethod({
      type: "Direct Deposit",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your payroll information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-blue-500" />
                My Payroll
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View your payslips, benefits, and manage payment methods.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Employee Info Card - Always visible above tabs */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {employeeData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="block font-semibold text-gray-800 dark:text-white">{employeeData.name}</span>
                <span className="block text-sm text-gray-600 dark:text-gray-400">{employeeData.position}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{employeeData.department}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{employeeData.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{employeeData.phone}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="truncate">{employeeData.address}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span><span className="font-medium">Start Date:</span> {new Date(employeeData.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span><span className="font-medium">Pay Frequency:</span> {employeeData.payFrequency}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span><span className="font-medium">Current Rate:</span> {employeeData.payRate}/hr</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Wallet className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span><span className="font-medium">Annual Salary:</span> {employeeData.annualSalary}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="payslips"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg"
            >
              Payslips
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger
              value="tax-docs"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg"
            >
              Tax Docs
            </TabsTrigger>
            <TabsTrigger
              value="payment-methods"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg"
            >
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-indigo-500" />
                    Next Pay Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">Oct 25, 2024</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bi-Weekly</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-blue-500" />
                    YTD Gross Pay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">₱4,850,000.00</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+₱200,000.00 from last year</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-purple-500" />
                    Active Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">3</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Health, Retirement, PTO</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-fuchsia-500" />
                    Pending Docs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All documents up-to-date</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Recent Payslips
                </CardTitle>
                <CardDescription>
                  Your latest 3 pay stubs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslipHistory.slice(0, 3).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.period}</TableCell>
                        <TableCell>{record.netPay}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" asChild>
                            <a href={record.payslipUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-700 p-4">
                <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => setActiveTab("payslips")}>
                  View All Payslips
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Payslips Tab Content */}
          <TabsContent value="payslips" className="mt-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Payslip History
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Last 5 Pay Periods
                </Badge>
              </div>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-[200px]">Pay Period</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslipHistory.map((record) => (
                      <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{record.period}</TableCell>
                        <TableCell>{record.grossPay}</TableCell>
                        <TableCell>{record.netPay}</TableCell>
                        <TableCell className="text-sm">{record.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" asChild>
                            <a href={record.payslipUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300" asChild>
                            <a href={record.payslipUrl} download>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          {/* Benefits Tab Content */}
          <TabsContent value="benefits" className="mt-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" />
                  My Benefits
                </h2>
              </div>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead>Benefit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benefits.map((benefit) => (
                      <TableRow key={benefit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{benefit.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {benefit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {benefit.provider ? `Provider: ${benefit.provider}` : null}
                          {benefit.contribution ? `Contribution: ${benefit.contribution}` : null}
                          {benefit.balance ? `Balance: ${benefit.balance}` : null}
                          {benefit.endDate && benefit.endDate !== "N/A" ? ` (Ends: ${new Date(benefit.endDate).toLocaleDateString()})` : benefit.endDate !== "N/A" ? " (Ongoing)" : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-700 p-4">
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View All Benefits Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Tax Documents Tab Content */}
          <TabsContent value="tax-docs" className="mt-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-fuchsia-500" />
                  Tax Documents
                </h2>
              </div>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxDocuments.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{doc.type}</TableCell>
                        <TableCell>{doc.year}</TableCell>
                        <TableCell>
                          {doc.status === "Available" ? (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {doc.status}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="dark:bg-gray-800">
                              {doc.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {doc.status === "Available" && doc.downloadUrl ? (
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" asChild>
                              <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled className="text-gray-400 dark:text-gray-600">
                              <Download className="w-4 h-4 mr-1" />
                              N/A
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-700 p-4">
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Request Previous Documents
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Methods Tab Content */}
          <TabsContent value="payment-methods" className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-green-500" />
                  Payment Methods
                </h2>
              </div>

              {/* Primary Payment Method */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Primary Payment Method</span>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Active
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    This is where your pay will be deposited.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span><span className="font-medium">Type:</span> {employeeData.primaryPaymentMethod.type}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Banknote className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span><span className="font-medium">Bank:</span> {employeeData.primaryPaymentMethod.bankName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Wallet className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span><span className="font-medium">Account:</span> ****{employeeData.primaryPaymentMethod.accountLast4}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Settings className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span><span className="font-medium">Type:</span> {employeeData.primaryPaymentMethod.accountType}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Update Primary Method
                  </Button>
                </CardFooter>
              </Card>

              {/* Alternative Payment Methods */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Alternative Payment Methods</CardTitle>
                  <CardDescription>
                    Other methods you have used or saved.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeData.alternativePaymentMethods.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Used</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeData.alternativePaymentMethods.map((method) => (
                          <TableRow key={method.id}>
                            <TableCell className="font-medium">{method.type}</TableCell>
                            <TableCell>
                              <Badge variant={method.status === "Active" ? "default" : "secondary"}>
                                {method.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{method.lastUsed ? new Date(method.lastUsed).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                Use
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No alternative payment methods found.</p>
                  )}
                </CardContent>
                <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-700 p-4">
                  <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardFooter>
              </Card>

              {/* Payment Preferences / History */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-amber-500" />
                    Payment Preferences & History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pay-frequency" className="text-sm font-medium">Pay Frequency</Label>
                      <p id="pay-frequency" className="text-sm text-gray-900 dark:text-white">{employeeData.payFrequency}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cannot be changed by employee. Contact HR for modifications.</p>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Payment History</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Show last 3 payments from payslip history as example */}
                          {payslipHistory.slice(0, 3).map((record) => (
                            <TableRow key={`history-${record.id}`}>
                              <TableCell>{new Date(record.datePaid).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">{record.netPay}</TableCell>
                              <TableCell>{record.paymentMethod}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PayrollPage;