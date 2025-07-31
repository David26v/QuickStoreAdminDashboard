"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAlert } from "@/components/providers/AlertProvider";
import supabase, { api } from "@/lib/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeViewPage = () => {
  const { employee_id } = useParams();
  const { showAlert } = useAlert();

  const [employee, setEmployee] = useState(null);
  const [roles, setRoles] = useState([]);
  const [department, setDepartments] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    role: "",
    salary: "",
    status: "active",
    department_head: false,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select(
          `
        id,
        user_id,
        first_name,
        last_name,
        phone,
        date_hired,
        status,
        salary,
        avatar,
        department:department_id (id, name),
        shift:shift_id (id, name),
        role:role_id (id, name)
      `
        )
        .eq("id", employee_id)
        .single();

      if (employeeError) {
        showAlert("❌ Failed to fetch employee", "error");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, avatar")
        .eq("id", employeeData.user_id)
        .single();

      if (profileError) {
        showAlert("❌ Failed to fetch profile", "error");
        return;
      }

      setEmployee({
        ...employeeData,
        profile: profileData,
      });

      setForm({
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: profileData?.email || "",
        department: employeeData.department?.id || "",
        role: employeeData.role?.id || "",
        salary: employeeData.salary,
        status: employeeData.status || "active",
        department_head: employeeData.department_head || false,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      showAlert("❌ Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        showAlert(`Error Fetching Roles: ${error.message}`, "error");
        return;
      }

      setRoles(data || []);
    } catch (error) {
      showAlert(`Error Fetching Roles: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, description")
        .order("name", { ascending: true })
        .limit(10);

      if (error) {
        showAlert(`Error Fetching Departments: ${error.message}`, "error");
        return;
      }

      setDepartments(data || []);
    } catch (err) {
      showAlert(`Error Fetching Departments: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRoles();
    fetchDepartment();
;  }, []);

  useEffect(() => {
    if (employee_id) fetchEmployee();
  }, [employee_id]);

  if (loading)
    return <div className="p-6 text-center">Loading employee...</div>;
  if (!employee)
    return <div className="p-6 text-center">Employee not found.</div>;

  const handleSave = async () => {
    try {
      setLoading(true);

      let avatarUrl = employee?.avatar || "";

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${employee_id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: storageData, error: storageError } =
          await supabase.storage.from("avatars").upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (storageError) {
          showAlert("❌ Failed to upload avatar", "error");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("employees")
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          department_id: form.department,
          role_id: form.role,
          salary: Number(form.salary),
          status: form.status,
          department_head: form.department_head,
          avatar: avatarUrl,
        })
        .eq("id", employee_id);

      if (updateError) {
        showAlert("❌ Failed to update employee", "error");
        return;
      }

      showAlert("✅ Employee updated successfully", "success");
      setIsEdit(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      await fetchEmployee();
    } catch (err) {
      console.error("Unexpected error:", err);
      showAlert("❌ Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showAlert("File size must be less than 5MB", "error");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showAlert("Please select a valid image file", "error");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setForm({ ...form, avatar: "" });
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (employee?.avatar) return employee.avatar;
    return `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=random&color=fff`;
  };

  const TextOrInput = ({ label, value, name, type = "text" }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <Label className="font-semibold text-gray-700 dark:text-gray-300 md:text-right">
        {label}
      </Label>
      <div className="md:col-span-2">
        {isEdit ? (
          <Input
            type={type}
            value={value}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            className="w-full"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md min-h-[40px] flex items-center">
            {value || "-"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="  dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 text-center">
            <div className="mb-6 relative inline-block">
              <img
                src={getAvatarSrc()}
                alt="Avatar"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
              {isEdit && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                    {(employee?.avatar || avatarPreview) && (
                      <button
                        onClick={removeAvatar}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {avatarFile && (
              <div className="mb-4 flex justify-center space-x-2">
                <button
                  onClick={cancelAvatarChange}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  type="button"
                >
                  Cancel Avatar Change
                </button>
              </div>
            )}

            <h1 className="text-3xl font-bold text-white mb-2">
              {form.first_name} {form.last_name}
            </h1>
            <p className="text-blue-100 text-lg">{form.role.name}</p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="space-y-1">
              <TextOrInput
                label="First Name"
                value={form.first_name}
                name="first_name"
              />
              <TextOrInput
                label="Last Name"
                value={form.last_name}
                name="last_name"
              />
              <TextOrInput label="Email" value={form.email} name="email" />
             
              <TextOrInput
                label="Salary"
                value={form.salary}
                name="salary"
                type="number"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 md:text-right">
                  Department
                </Label>
                <div className="md:col-span-2">
                  {isEdit ? (
                    <Select
                      value={form.department}
                      onValueChange={(val) => setForm({ ...form, department: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {department.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md min-h-[40px] flex items-center">
                      {department.find((d) => d.id === form.department)?.name || "—"}
                    </p>
                  )}
                </div>
              </div>
              {/* Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 md:text-right">
                  Role
                </Label>
                <div className="md:col-span-2">
                  {isEdit ? (
                    <Select
                      value={form.role}
                      onValueChange={(val) => setForm({ ...form, role: val })}
                    >
                      <SelectTrigger className="w-full">
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
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md min-h-[40px] flex items-center">
                     {roles.find((r) => r.id === form.role)?.name || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 md:text-right">
                  Status
                </Label>
                <div className="md:col-span-2">
                  {isEdit ? (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={form.status}
                        onCheckedChange={(val) =>
                          setForm({
                            ...form,
                            status: val, // val is boolean
                          })
                        }
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {form.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          form.status
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            form.status ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {form.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 md:text-right">
                  Department Head
                </Label>
                <div className="md:col-span-2">
                  {isEdit ? (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={form.department_head}
                        onCheckedChange={(val) =>
                          setForm({ ...form, department_head: val })
                        }
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {form.department_head ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          form.department_head
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            form.department_head ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {form.department_head ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
              {isEdit ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEdit(false)}
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEdit(true)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewPage;
