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
import { api } from "@/lib/helper";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datePicker";
import { useUser } from "@/components/providers/UserContext";

const AddEmployee = ({ fetchEmployees }) => {


  const { showAlert } = useAlert();
  const {userId} = useUser();
  const [open, setOpen] = useState(false);


  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    position: "",
    department: "",
    status: "active",
    salary: "",
    date_hired: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const { ok, data } = await api("/api/role/get-all-role", "GET");
      if (ok) setRoles(data.roles);
    };
    fetchRoles();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tempPassword = `${formData.first_name.toLowerCase()}${formData.last_name.toLowerCase()}${formData.date_hired}`;
  
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
        date_hired: new Date(formData.date_hired),
        password: tempPassword,
        created_by: userId,
        update_by: userId,
        user_id: userId,
      };
  
      const { ok, data } = await api("/api/employee/create-employee", "POST", payload);
  
      if (!ok) {
        showAlert(`Create Employee Not Successful: ${data.message}`, "error");
      } else {
        showAlert("Employee created successfully", "success");
        setOpen(false);
        fetchEmployees();
        setFormData({
          email: "",
          first_name: "",
          last_name: "",
          role: "",
          position: "",
          department: "",
          status: "active",
          salary: "",
          date_hired: new Date().toISOString().split("T")[0],
          created_by:userId,
          update_by:userId,
        });
      }
    } catch (error) {
      showAlert(`Employee creation failed: ${error.message}`, "error");
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="rose">+ Add New Employee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>First Name</Label>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Date Hired</Label>
              <DatePicker
                date={new Date(formData.date_hired)}
                onChange={(date) => handleSelectChange("date_hired", date.toISOString().split("T")[0])}
              />
            </div>
          </div>

          {/* Department + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(val) => handleSelectChange("department", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => {
                  const selectedRole = roles.find((r) => r._id === val);
                  handleSelectChange("role", val);
                  handleSelectChange("position", selectedRole?.name || "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleSelectChange("status", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resigned">Resigned</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="rose">
              Save Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
