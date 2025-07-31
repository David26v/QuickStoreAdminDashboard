"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  MoreVertical,
  Copy,
  Eye,
} from "lucide-react";
import SearchFilter from "@/components/ui/searchFilter";
import supabase from "@/lib/helper";
import CreateShiftModal from "./components/createShift";
import { useUser } from "@/components/providers/UserContext";

const ShiftPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [departments, setDepartment] = useState([]);
  const [shifts, setShifts] = useState([]);
  const {showAlert} =useUser();

  const handleFetchShifts = async () => {
    try {
      const { data: shiftsData, error: shiftError } = await supabase
        .from("shifts")
        .select(`
          *,
          shift_work_days (
            week_day_id
          )
        `);
  
      if (shiftError) throw shiftError;
  
      const weekDayMap = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
      };
  
      const formattedShifts = shiftsData.map((shift) => ({
        id: shift.id,
        name: shift.name,
        description: shift.description || "", 
        startTime: shift.start_time,
        endTime: shift.end_time,
        breakDuration: shift.break_duration,
        employees: 0,
        status: shift.status,
        workDays:
          shift.shift_work_days?.map((w) => weekDayMap[w.week_day_id]) || [],
        overtime: shift.overtime,
        createdDate: shift.created_date,
      }));
  
      setShifts(formattedShifts);
      console.log('formattedShifts', formattedShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error.message);
    }
  };
  
  

  const defaultShift = {
    name: "",
    startTime: "",
    endTime: "",
    breakDuration: 60,
    department: "",
    workDays: [],
    overtime: false,
  };

  const [newShift, setNewShift] = useState(defaultShift);

  const handleDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id,name");
      setDepartment(data);
    } catch (error) {
      console.error(`error fetching deparment:${error.message}`);
    }
  };

  useEffect(() => {
    handleDepartments();
    handleFetchShifts();
  }, [supabase]);


  const handleCreateShift = async () => {
    try {
      // Step 1: Insert shift (remove department)
      const { data: insertedShift, error: shiftError } = await supabase
        .from("shifts")
        .insert({
          name: newShift.name,
          start_time: newShift.startTime,
          end_time: newShift.endTime,
          break_duration: newShift.breakDuration,
          overtime: newShift.overtime,
          status: "active",
          created_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();
  
      if (shiftError) throw shiftError;
  
      const shiftId = insertedShift.id;
  
      // Step 2: Convert weekday names to IDs
      const dayToNumber = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };
  
      const weekDayIds = newShift.workDays.map((day) => dayToNumber[day]);
  
      // Step 3: Insert work days for the shift
      for (const dayId of weekDayIds) {
        const { error: workDayError } = await supabase
          .from("shift_work_days")
          .insert({
            shift_id: shiftId,
            week_day_id: dayId,
          });
  
        if (workDayError) throw workDayError;
      }
  
      // Step 4: Update local state
      const createdShift = {
        id: shiftId,
        name: newShift.name,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        breakDuration: newShift.breakDuration,
        workDays: newShift.workDays,
        overtime: newShift.overtime,
        employees: 0,
        status: "active",
        createdDate: new Date().toISOString().split("T")[0],
      };
  
      setShifts([...shifts, createdShift]);
      setShowCreateModal(false);
  
      // Step 5: Reset form
      setNewShift({
        name: "",
        startTime: "",
        endTime: "",
        breakDuration: 60,
        workDays: [],
        overtime: false,
      });
  
      showAlert(`Successfully created shift`, "success");
    } 
    catch (error) {
      console.error("Error creating shift:", error.message);
    }
  };
  
  
  const handleDeleteShift = async (shift_id) => {
    try {
      const { error: workDayError } = await supabase
        .from("shift_work_days")
        .delete()
        .eq("shift_id", shift_id);
  
      if (workDayError) throw workDayError;

      const { error: shiftError } = await supabase
        .from("shifts")
        .delete()
        .eq("id", shift_id);
  
      if (shiftError) throw shiftError;
  
      const updatedShifts = shifts.filter((shift) => shift.id !== shift_id);
      setShifts(updatedShifts);
      setSelectedShift(null);
    } catch (error) {
      console.error("Error deleting shift:", error.message);
    }
  };
  


  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || shift.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatWorkDays = (days) => {
    if (days.length === 7) return "All Days";
    if (
      days.length === 5 &&
      !days.includes("Saturday") &&
      !days.includes("Sunday")
    )
      return "Weekdays";
    if (
      days.length === 2 &&
      days.includes("Saturday") &&
      days.includes("Sunday")
    )
      return "Weekends";
    return (
      days
        .slice(0, 3)
        .map((day) => day.slice(0, 3))
        .join(", ") + (days.length > 3 ? "..." : "")
    );
  };

  const filters = [
    {
      label: "Status",
      value: "status",
      selectedValue: filterStatus,
      onChange: setFilterStatus,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shift Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage work shifts and schedules for your organization
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Shift
            </button>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Search employees or shifts..."
          filters={filters}
        />

        {/* Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {shift.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shift.status === "active"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {shift.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Time Info */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                  {shift.overtime && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs rounded-full font-medium">
                      OT Enabled
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Break: {shift.breakDuration} minutes
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Employees:</span>
                  <span className="font-semibold text-gray-800">
                    {shift.employees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Work Days:</span>
                  <span className="font-semibold text-gray-800">
                    {formatWorkDays(shift.workDays)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Created:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(shift.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 bg-white/50 hover:bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-white/50 hover:bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => handleDeleteShift(shift.id)}
                  className="bg-white/50 hover:bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredShifts.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No shifts found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first shift to get started with schedule management.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create First Shift
            </button>
          </div>
        )}

        {/* Create Shift Modal */}
        <CreateShiftModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateShift}
          newShift={newShift}
          setNewShift={setNewShift}
          departments={departments}
        />
      </div>
    </div>
  );
};

export default ShiftPage;
