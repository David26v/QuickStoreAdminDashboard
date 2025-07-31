'use client'

import supabase, { api } from "@/lib/helper"
import { useParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import {
  FaUserShield, FaUser, FaUserTag,
  FaCheckCircle, FaTimesCircle
} from "react-icons/fa"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAlert } from "@/components/providers/AlertProvider"
import { Label } from "@/components/ui/label"
import { useDialog } from "@/components/providers/DialogProvider"

const roleOptions = [
  { value: "admin", label: "Admin", icon: <FaUserShield className="inline mr-1 text" /> },
  { value: "user", label: "User", icon: <FaUser className="inline mr-1" /> },
  { value: "viewer", label: "Viewer", icon: <FaUserTag className="inline mr-1" /> }
]

const statusOptions = [
  { value: true, label: "Active", icon: <FaCheckCircle className="inline mr-1 text-green-500" /> },
  { value: false, label: "Inactive", icon: <FaTimesCircle className="inline mr-1 text-red-600" /> }
]

const UserProfile = () => {
  const { user_id } = useParams()
  const fileInputRef = useRef(null)
  const { showAlert } = useAlert()
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const { showProfile } = useDialog();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    username: "", role: "", active: false, 
    avatar: ""
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, username, role, active, avatar, shifts(*)") 
          .eq("id", user_id)
          .single(); 
  
        if (error) {
          console.error("Supabase fetch error:", error.message);
          return;
        }
  
        const u = data;
  
        setUser(u);
        setForm({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          email: u.email || "",
          username: u.username || "",
          role: u.role || "",
          active: u.active ?? false,
          avatar: u.avatar || "",
          shift: u.shift?.name || "", 
        });
      } catch (err) {
        console.error("Unexpected error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (user_id) fetchUser();
  }, [user_id]);
  
  const handleSave = async () => {
    const payload = {
      user_id: user_id,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      role: form.role,
      active: form.active,
      avatar: form.avatar,
    };
  
    showProfile({
      title: "Save Changes?",
      description: "Are you sure you want to save these changes to the user's profile?",
      onConfirm: async () => {
        try {
          // ✅ Upload avatar if selected
          if (selectedAvatar) {
            const avatarForm = new FormData();
            avatarForm.append("avatar", selectedAvatar);
            avatarForm.append("username", payload.username);
  
            const { ok, data } = await api("/api/users/upload-avatar", "POST", avatarForm);
  
            if (!ok) {
              throw new Error(data?.message || "Avatar upload failed");
            }
  
            payload.avatar = data.avatarUrl;
          }
  
          // ✅ Update user info
          const { ok: updateOk, data: updateData } = await api("/api/users/change-info", "PUT", payload);
  
          if (!updateOk) {
            throw new Error(updateData?.message || "Failed to update user");
          }
  
          setUser((prev) => ({ ...prev, ...form }));
          setIsEdit(false);
          setSelectedAvatar(null);
          setAvatarPreview(null);
          showAlert("User profile updated successfully", "success");
        } catch (err) {
          console.error("Save error:", err);
          showAlert(`Error saving profile: ${err.message}`, "error");
        }
      },
      onCancel: () => {
        console.log("User cancelled the save operation.");
      },
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAlert('File size must be less than 5MB', 'error')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file', 'error')
        return
      }

      setSelectedAvatar(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  };

  const removeAvatar = () => {
    setSelectedAvatar(null)
    setAvatarPreview(null)
    setForm({ ...form, avatar: '' })
  }

  const cancelAvatarChange = () => {
    setSelectedAvatar(null)
    setAvatarPreview(null)
  }

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview
    if (user?.avatar) return user.avatar
    return `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=random&color=fff`
  }

  const getRoleLabel = (role) => {
    const roleOption = roleOptions.find(r => r.value === role)
    return roleOption ? roleOption.label : role
  }

  if (loading) return <div className="p-6 text-center">Loading user profile...</div>
  if (!user) return <div className="p-6 text-center">User not found.</div>

  const TextOrInput = ({ label, value, name, type = 'text' }) => (
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
            {value || '-'}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          ← Back
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-12 text-center">
            <div className="mb-6 relative inline-block">
              <img
                src={getAvatarSrc()}
                alt="Avatar"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
              {isEdit && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    {(user?.avatar || avatarPreview) && (
                      <button
                        onClick={removeAvatar}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            
            {selectedAvatar && (
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
            <p className="text-blue-100 text-lg">
              @{form.username} • {getRoleLabel(form.role)}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="space-y-1">
              <TextOrInput label="First Name" value={form.first_name} name="first_name" />
              <TextOrInput label="Last Name" value={form.last_name} name="last_name" />
              <TextOrInput label="Username" value={form.username} name="username" />
              <TextOrInput label="Email" value={form.email} name="email" type="email" />

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
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              {role.icon} {role.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          form.role === "admin" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : form.role === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {roleOptions.find(r => r.value === form.role)?.icon}
                        <span className="ml-1">{getRoleLabel(form.role)}</span>
                      </span>
                    </div>
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
                    <Select
                      value={form.active.toString()}
                      onValueChange={(val) => setForm({ ...form, active: val === "true" })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value.toString()} value={status.value.toString()}>
                            <div className="flex items-center gap-2">
                              {status.icon} {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          form.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            form.active ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        {form.active ? 'Active' : 'Inactive'}
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
                  <Button variant="outline" onClick={() => setIsEdit(false)} size="lg">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEdit(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile