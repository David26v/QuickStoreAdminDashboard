"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/components/providers/AlertProvider";
import supabase from "@/lib/helper";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datePicker";
import { useUser } from "@/components/providers/UserContext";
import {
  UserPlus,
  Mail,
  User,
  DollarSign,
  Calendar,
  Building2,
  Shield,
  Activity,
  Sparkles,
  Briefcase,
} from "lucide-react";

const AddEmployee = ({ fetchEmployees }) => {
  const { showAlert } = useAlert();
  const { userId } = useUser();
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    roles: "",
    department: "",
    status: "active",
    salary: "",
    date_hired: new Date().toISOString().split("T")[0],
  });

  const fetchDepartment = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        showAlert("Fetching Department failed", "error");
      }
      setDepartments(data);
    } catch (error) {
      console.error(`fetching data error:${error.message}`);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("id , name")
        .order("name", { ascending: true });

      if (error) {
        showAlert(`failed to load roles`, "error");
      }

      setRoles(data);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      role: "",
      department: "",
      status: "active",
      salary: "",
      date_hired: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        email,
        first_name,
        last_name,
        roles,
        department,
        date_hired,
        salary,
        status,
      } = formData;

      const tempPassword = `${first_name.toLowerCase()}${last_name.toLowerCase()}${date_hired.replace(
        /-/g,
        ""
      )}`;

      // Construct payload for the backend API
      const payload = {
        email,
        tempPassword,
        metadata: {
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
          role_id: roles,
          invited_by: userId, // your current admin ID
        },
        employeeData: {
          first_name,
          last_name,
          role_id: roles,
          department_id: department,
          salary: parseFloat(salary),
          date_hired: new Date(date_hired),
          created_by: userId,
          updated_by: userId,
          status: status === "active",
        },
      };

      const response = await fetch("/api/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Something went wrong");
      }

      showAlert("🎉 Employee invited and added successfully", "success");
      setOpen(false);
      fetchEmployees();
      resetForm();
    } catch (err) {
      showAlert(`❌ Failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchRoles();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Add New Employee
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Create a new employee profile for your organization
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 border-b pb-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name
                </Label>
                <Input
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Last Name
                </Label>
                <Input
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Hired
                </Label>
                <DatePicker
                  date={new Date(formData.date_hired)}
                  onChange={(date) =>
                    handleSelectChange(
                      "date_hired",
                      date.toISOString().split("T")[0]
                    )
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 border-b pb-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Employment Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => handleSelectChange("department", val)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </Label>
                <Select
                  value={formData.roles}
                  onValueChange={(val) => {
                    handleSelectChange("roles", val);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Salary
                </Label>
                <Input
                  name="salary"
                  type="number"
                  placeholder="50000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleSelectChange("status", val)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="resigned">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        Resigned
                      </div>
                    </SelectItem>
                    <SelectItem value="terminated">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        Terminated
                      </div>
                    </SelectItem>
                    <SelectItem value="on-leave">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        On Leave
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Temporary Password
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  A temporary password will be generated automatically using:
                  firstname + lastname + hire date
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Creating Employee...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Save Employee
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
