"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Plane,
  Stethoscope,
  GraduationCap,
  Baby,
  Home,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  FilterIcon,
  FilterXIcon,
  LayoutGrid,
  Table as TableIcon,
  Mail,
  Phone,
  Info,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/components/providers/UserContext";
import NewRequestModalContent from "./components/NewRequestModal";
import supabase from "@/lib/helper";

const LeaveRequestPage = () => {
  // State for main search bar
  const [searchTerm, setSearchTerm] = useState("");
  // State for filter dialog
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  // State for "My Requests" list filter
  const [myRequestsFilterStatus, setMyRequestsFilterStatus] = useState("all");
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState({ employee: true, requests: true, types: true, statuses: true });
  const [pendingStatusId, setPendingStatusId] = useState(null);
  const [error, setError] = useState(null);
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveStatuses, setLeaveStatuses] = useState([]);
  const { userId } = useUser();



  const statusConfigMap = {
    "pending": { icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
    "approved": { icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-200", label: "Approved" },
    "rejected": { icon: XCircle, color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
    "default": { icon: Clock, color: "bg-gray-100 text-gray-800 border-gray-200", label: "Unknown" }
  };
  

  const iconMap = {
    Home: Home,
    AlertCircle: AlertCircle,
    Baby: Baby,
    User: User,
    Stethoscope: Stethoscope,
    GraduationCap: GraduationCap,
    Plane: Plane,
    Clock: Clock,
    CheckCircle: CheckCircle,
    XCircle: XCircle,
    FileText: FileText,
  };


  useEffect(()=>{
    const fetchLeaveTypes = async () =>{
      try {
        setLoading(prev => ({ ...prev, types: true }));
        // Fetch leave types from Supabase
        const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('name');
     

        if (error) throw error;
        setLeaveTypes(data);

      } catch (err) {
        console.error("Error fetching leave types:", err);
        setError(err.message || "Failed to load leave types.");
      } finally {
        setLoading(prev => ({ ...prev, types: false }));
      }
    }
    fetchLeaveTypes();
  },[])

  useEffect(() => {
    const fetchPendingStatusId = async () => {
      try {
        setLoading(prev => ({ ...prev, pendingStatus: true })); 
        const { data: statusData, error: statusError } = await supabase
          .from('leave_request_statuses')
          .select('id')
          .eq('name', 'Pending')
          .single(); 
  
        if (statusError) {
          console.error("Error fetching Pending status ID:", statusError);
          setPendingStatusId(null); 
          return;
        }
  
        if (!statusData || !statusData.id) {
          console.warn("Warning: 'Pending' status not found or missing ID.");
          setPendingStatusId(null);
          return;
        }
  
        setPendingStatusId(statusData.id);
        console.log("Fetched Pending Status ID:", statusData.id); 
      } catch (err) {
        console.error("Unexpected error fetching Pending status ID:", err);
        setPendingStatusId(null);
      } finally {
        setLoading(prev => ({ ...prev, pendingStatus: false })); 
      }
    };
  
    fetchPendingStatusId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Fetch Employee Info
        setLoading(prev => ({ ...prev, employee: true }));
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            date_hired,
            status,
            avatar,
            department_id,
            role_id,
            available_leave_days,
            departments (id, name),
            roles (id, name)
          `)
          .eq("user_id", userId)
          .single();

        if (employeeError) throw employeeError;
        if (!employeeData) throw new Error("Employee record not found.");

        setCurrentEmployee({
          id: employeeData.id,
          name: `${employeeData.first_name} ${employeeData.last_name}`,
          role: employeeData.roles?.name || employeeData.role_id || "N/A",
          department: employeeData.departments?.name || employeeData.department_id || "N/A",
          email: employeeData.email,
          phone: employeeData.phone,
          avatar: employeeData.avatar,
          availableLeaveDays: employeeData.available_leave_days || 0,
          dateHired: employeeData.date_hired,
        });
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(err.message || "An error occurred while fetching employee data.");
      } finally {
        setLoading(prev => ({ ...prev, employee: false }));
      }

      try {
        // Fetch Leave Types
        setLoading(prev => ({ ...prev, types: true }));
        const { data: typesData, error: typesError } = await supabase
          .from("leave_types")
          .select("id, name, icon, color_class")
          .order("name", { ascending: true });

        if (typesError) throw typesError;
        setLeaveTypes(typesData);
      } catch (err) {
        console.error("Error fetching leave types:", err);
        setError(err.message || "Failed to load leave types.");
      } finally {
        setLoading(prev => ({ ...prev, types: false }));
      }

      try {
        setLoading(prev => ({ ...prev, statuses: true }));
        const { data: statusesData, error: statusesError } = await supabase
          .from("leave_request_statuses")
          .select("id, name, icon, color_class, display_order")
          .order("display_order", { ascending: true });

        if (statusesError) throw statusesError;
        setLeaveStatuses(statusesData);
      } catch (err) {
        console.error("Error fetching leave statuses:", err);
        setError(err.message || "Failed to load leave statuses.");
      } finally {
        setLoading(prev => ({ ...prev, statuses: false }));
      }
    };

    fetchData();
  }, [userId]);


  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!userId) return; 

      try {
        setLoading(prev => ({ ...prev, requests: true }));
        setError(null);


        const { data: requestsData, error: requestsError } = await supabase
          .from("leave_requests")
          .select("*") 
          .eq("user_id", userId)
          .order("submitted_at", { ascending: false });

        if (requestsError) throw requestsError;

        if (!requestsData || requestsData.length === 0) {
          setAllLeaveRequests([]);
          console.log("No leave requests found for user:", userId);
          return;
        }


        const leaveTypeIds = [...new Set(requestsData.map(req => req.leave_type_id).filter(id => id))]; 
        const statusIds = [...new Set(requestsData.map(req => req.status_id).filter(id => id))];

  
        let leaveTypesMap = {};
        if (leaveTypeIds.length > 0) {
          const { data: typesData, error: typesError } = await supabase
            .from("leave_types")
            .select("id, name, icon, color_class")
            .in("id", leaveTypeIds); // Fetch only the types we need

          if (typesError) {
              console.error("Error fetching leave types for requests:", typesError);
            
          } else {
              // Create a map for quick lookup: { id: typeObject }
              leaveTypesMap = typesData.reduce((acc, type) => {
                acc[type.id] = type;
                return acc;
              }, {});
          }
        }

      
        let statusesMap = {};
        if (statusIds.length > 0) {
          const { data: statusesData, error: statusesError } = await supabase
            .from("leave_request_statuses")
            .select("id, name, icon, color_class, display_order")
            .in("id", statusIds); // Fetch only the statuses we need

          if (statusesError) {
              console.error("Error fetching leave statuses for requests:", statusesError);
              // Optionally, handle error
          } else {
              // Create a map for quick lookup: { id: statusObject }
              statusesMap = statusesData.reduce((acc, status) => {
                acc[status.id] = status;
                return acc;
              }, {});
          }
        }


        const processedRequests = requestsData.map(req => {
          const relatedLeaveType = leaveTypesMap[req.leave_type_id];
          const relatedStatus = statusesMap[req.status_id];

          return {
            ...req,
            type: relatedLeaveType?.name || "Unknown Type",
            status: relatedStatus?.name?.toLowerCase() || "unknown", 
            startDate: req.start_date,
            endDate: req.end_date,
            totalDays: req.total_days,
            submittedDate: req.submitted_at,
            approvedBy: req.reviewed_by,
            approvedDate: req.reviewed_at,
            comments: req.reviewer_comments,
            rejectionReason: req.rejection_reason,
            emergencyContact: {
              name: req.emergency_contact_name,
              relationship: req.emergency_contact_relationship,
              phone: req.emergency_contact_phone,
            }
          };
        });

        setAllLeaveRequests(processedRequests);
        console.log('Fetched and processed leave requests (separate fetches):', processedRequests);

      } catch (err) {
        console.error("Error in fetchLeaveRequests (separate approach):", err);
        setError("Failed to load your leave requests.");
      } finally {
        setLoading(prev => ({ ...prev, requests: false }));
      }
    };

    fetchLeaveRequests();
  }, [userId]); 

  const filteredUserRequests = allLeaveRequests.filter(
    (req) =>
      myRequestsFilterStatus === "all" || req.status === myRequestsFilterStatus
  );

  const filteredRequests = allLeaveRequests.filter((request) => {
    const matchesSearch =
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    let matchesDate = true;
    const requestStartDate = new Date(request.startDate);
    const requestEndDate = new Date(request.endDate);
    if (filterStartDate) {
      const filterStart = new Date(filterStartDate);
      matchesDate = matchesDate && requestEndDate >= filterStart;
    }
    if (filterEndDate) {
      const filterEnd = new Date(filterEndDate);
      matchesDate = matchesDate && requestStartDate <= filterEnd;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getLeaveTypeConfig = (typeName) => {
    const dbType = leaveTypes?.find(type => type?.name === typeName) || null;
    const IconComponent = (dbType?.icon && iconMap[dbType.icon]) || FileText;
  
    return {
      icon: IconComponent,
      color: dbType?.color_class || "bg-gray-100 text-gray-800 border-gray-200",
      label: dbType?.name || typeName || "Unknown Type"
    };
  };


const getStatusConfig = (statusName) => {
 
  const normalizedName = typeof statusName === 'string' ? statusName.toLowerCase() : '';
  const config = statusConfigMap[normalizedName];
  return config || statusConfigMap.default || { icon: Clock, color: "bg-gray-100 text-gray-800 border-gray-200", label: "Unknown Status" };
};

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) {
      return format(start, "MMM d, yyyy");
    }
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };


  const LeaveRequestCard = ({ request }) => {

    const typeConfig = getLeaveTypeConfig(request.type);
    const statusConfig = getStatusConfig(request.status);
    const TypeIcon = typeConfig.icon;
    const StatusIcon = statusConfig.icon;


    console.log('typeConfig',typeConfig)
    return (
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${typeConfig.color}`}
            >
              <TypeIcon className="w-3 h-3 mr-1.5" />
              {typeConfig.label || request.type}
            </div>
            <Badge
              variant="outline"
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label || request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3 flex-grow">
          <p className="text-base font-medium text-gray-800 line-clamp-2 mb-3">
            {request.reason}
          </p>
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>{formatDateRange(request.startDate, request.endDate)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <div className="flex items-center justify-between w-full text-xs text-gray-500">
            <span>
              Submitted: {request.submittedDate ? format(new Date(request.submittedDate), "MMM d") : "N/A"}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <RequestDetailsDialogContent request={request} />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    );
  };

  // Table View for My Requests (colored types)
  const LeaveRequestTable = () => (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-center">Days</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const typeConfig = getLeaveTypeConfig(request.type);
              const statusConfig = getStatusConfig(request.status);
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;
              return (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {typeConfig.label || request.type}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDateRange(request.startDate, request.endDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    {request.totalDays}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label || request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <RequestDetailsDialogContent request={request} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No requests found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Separate component for the Dialog content for better structure
  const RequestDetailsDialogContent = ({ request }) => {
    const typeConfig = getLeaveTypeConfig(request.type);
    const statusConfig = getStatusConfig(request.status);
    const TypeIcon = typeConfig.icon;
    const StatusIcon = statusConfig.icon;
    return (
      <>
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            {typeConfig.label || request.type} Request
          </DialogTitle>
          <DialogDescription>
            Submitted on{" "}
            {request.submittedDate ? format(new Date(request.submittedDate), "MMMM d, yyyy") : "N/A"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`px-3 py-1.5 rounded-full text-base font-medium border ${statusConfig.color}`}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label || request.status}
            </Badge>
          </div>
          {/* Dates & Duration */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-base">
              Leave Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Start Date</p>
                <p className="font-medium">
                  {request.startDate ? format(new Date(request.startDate), "MMMM d, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">End Date</p>
                <p className="font-medium">
                  {request.endDate ? format(new Date(request.endDate), "MMMM d, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Duration</p>
                <p className="font-medium">
                  {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
          {/* Reason */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Reason</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
              {request.reason}
            </p>
          </div>
          {/* Comments (if any) */}
          {request.comments && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Comments
              </p>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-200">
                {request.comments}
              </p>
            </div>
          )}
          {/* Attachments (if any) - Display logic needed */}
          {/* {request.attachments.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Attachments
              </p>
              <ul className="space-y-1.5">
                {request.attachments.map((attachment, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200"
                  >
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate hover:underline cursor-pointer">
                      {attachment}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {/* Approval/Rejection Info */}
          {request.status !== "pending" && (
            <div
              className={`p-4 rounded-lg border ${
                request.status === "approved"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-semibold">
                {request.status === "approved" ? "Approved" : "Rejected"} by{" "}
                {request.approvedBy || "Unknown"}
              </p>
              {request.approvedDate && (
                <p className="text-xs text-gray-600 mt-1">
                  on {format(new Date(request.approvedDate), "MMMM d, yyyy")}
                </p>
              )}
              {request.rejectionReason && (
                <p className="text-sm text-red-700 mt-3 p-2 bg-white rounded border border-red-300">
                  {request.rejectionReason}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  };

  // --- Filter Drawer Content Component ---
  const FilterDrawerContent = () => (
    <>
      <DrawerHeader className="text-left">
        <DrawerTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <FilterIcon className="w-5 h-5" />
          </div>
          Advanced Filters
        </DrawerTitle>
        <DrawerDescription>
          Refine your search for filtered requests.
        </DrawerDescription>
      </DrawerHeader>
      <div className="space-y-5 py-2 px-4">
        <div className="space-y-2">
          <Label htmlFor="filterStatus" className="text-sm font-medium">
            Status
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {leaveStatuses.map((status) => {
                const config = getStatusConfig(status.name);
                 return (
                   <SelectItem
                     key={status.id}
                     value={status.name?.toLowerCase()} // Ensure case match
                     className="flex items-center"
                   >
                     <div className="flex items-center">
                       {config.icon &&
                         React.createElement(config.icon, {
                           className: "w-4 h-4 mr-2",
                         })}
                       {config.label || status.name}
                     </div>
                   </SelectItem>
                 );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterStartDate" className="text-sm font-medium">
              Start Date
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                id="filterStartDate"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterEndDate" className="text-sm font-medium">
              End Date
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                id="filterEndDate"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min={filterStartDate || undefined}
              />
            </div>
          </div>
        </div>
      </div>
      <DrawerFooter className="px-4">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFilterStatus("all");
                setFilterStartDate("");
                setFilterEndDate("");
              }}
            >
              <FilterXIcon className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button type="button">Apply Filters</Button>
          </DrawerClose>
        </div>
      </DrawerFooter>
    </>
  );

  if (loading.employee && !currentEmployee) {
    return <div className="flex justify-center items-center h-screen">Loading employee info...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!currentEmployee) {
    return <div className="flex justify-center items-center h-screen">Employee not found.</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Leave Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Submit new requests and track the status of your existing ones.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Info & My Requests List (Cards) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(currentEmployee.name || '')[0]}
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-800">
                      {currentEmployee.name}
                    </span>
                    <span className="block text-sm text-gray-600">
                      {currentEmployee.role}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {currentEmployee.department}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {currentEmployee.availableLeaveDays} days
                    </span>{" "}
                    available
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {currentEmployee.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {currentEmployee.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* My Requests Header & List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    My Requests
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Showing your latest requests.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {filteredUserRequests.length} request
                    {filteredUserRequests.length !== 1 ? "s" : ""}
                  </span>
                  {/* Status Filter for My Requests List */}
                  <Select
                    value={myRequestsFilterStatus}
                    onValueChange={setMyRequestsFilterStatus}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {leaveStatuses.map((status) => {
                        const config = getStatusConfig(status.name);
                        return (
                          <SelectItem
                            key={status.id}
                            value={status.name?.toLowerCase()}
                            className="text-xs"
                          >
                            {config.label || status.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* My Requests Cards List */}
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {loading.requests ? (
                  <div className="text-center py-4">Loading requests...</div>
                ) : filteredUserRequests.length > 0 ? (
                  filteredUserRequests.map((request) => (
                    <LeaveRequestCard key={request.id} request={request} />
                  ))
                ) : (
                  <Card className="shadow-sm border border-gray-200 text-center py-6">
                    <CardContent className="pb-0">
                      <CalendarDaysIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No requests found with the selected status.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          {/* Right Column - New Request Button, Filters, My Requests (Tabs) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters - Main Search and New Request Button */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                {/* Grid for Search, Filter Button, and New Request Button */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search reasons or types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {/* Filter Drawer Trigger Button */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center text-sm"
                        >
                          <FilterIcon className="w-4 h-4 mr-2" />
                          Filters
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[100vh] overflow-y-auto">
                        <FilterDrawerContent />
                      </DrawerContent>
                    </Drawer>
                  </div>
                  <div className="flex items-center justify-end">
                    {/* New Request Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={loading.types} 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-200 shadow hover:shadow-md"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New Leave Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
                        <NewRequestModalContent  
                          availableLeaveTypes ={leaveTypes}
                          pendingStatusId={pendingStatusId}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* My Requests Header with Tabs (for Card/Table view of filtered results) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Overall Requests
                </h2>
                <span className="text-sm text-gray-600">
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? "s" : ""}
                </span>
              </div>
              {/* Tabs for Card/Table View */}
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="cards"
                    className="flex items-center justify-center"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Card View
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="flex items-center justify-center"
                  >
                    <TableIcon className="w-4 h-4 mr-2" />
                    Table View
                  </TabsTrigger>
                </TabsList>
                {/* Cards View Content (Filtered) - Updated with type colors */}
                <TabsContent value="cards" className="mt-0">
                  <div className="grid grid-cols-1 gap-5">
                    {loading.requests ? (
                      <div className="col-span-full text-center py-10">Loading requests...</div>
                    ) : filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <LeaveRequestCard
                          key={`filtered-${request.id}`}
                          request={request}
                        />
                      ))
                    ) : (
                      <div className="col-span-full">
                        <Card className="shadow-sm border border-gray-200 text-center py-10">
                          <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-800">
                              No requests found
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <p className="text-gray-600 mb-4 text-sm">
                              No leave requests match your current filters.
                            </p>
                          </CardContent>
                          <CardFooter className="justify-center">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchTerm("");
                                setFilterStatus("all");
                                setFilterStartDate("");
                                setFilterEndDate("");
                              }}
                              className="text-sm"
                            >
                              Clear Filters
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
                {/* Table View Content (Filtered) - Updated with type colors */}
                <TabsContent value="table" className="mt-0">
                  {loading.requests ? (
                    <div className="text-center py-10">Loading requests...</div>
                  ) : (
                    <LeaveRequestTable />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;