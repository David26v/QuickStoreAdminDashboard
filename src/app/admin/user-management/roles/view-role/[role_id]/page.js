'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAlert } from '@/components/providers/AlertProvider'
import { useDialog } from '@/components/providers/DialogProvider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/helper'
import { 
  FaUserShield, 
  FaCamera, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

const RoleViewPage = () => {
  const { role_id } = useParams()
  const { showAlert } = useAlert()
  const { showProfile } = useDialog()
  const fileInputRef = useRef(null)

  const [role, setRole] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', active: false, avatar: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { ok, data } = await api(`/api/role/get-role/${role_id}`, 'GET')
        if (ok && data.role) {
          setRole(data.role)
          setForm({
            name: data.role.name || '',
            description: data.role.description || '',
            active: data.role.active ?? false,
            avatar: data.role.avatar || ''
          })
        } else {
          showAlert('Failed to load role', 'error')
        }
      } catch (err) {
        console.error(err)
        showAlert('Error loading role', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (role_id) fetchRole()
  }, [role_id])

  const handleSave = async () => {
    showProfile({
      title: 'Update Role',
      description: 'Are you sure you want to update this role?',
      onConfirm: async () => {
        try {
          let avatarUrl = form.avatar

          if (selectedAvatar) {
            const formData = new FormData()
            formData.append('avatar', selectedAvatar)
            formData.append('role_id', role_id)

            const { ok, data } = await api('/api/role/upload-avatar', 'POST', formData)
            if (!ok) throw new Error(data.message || 'Avatar upload failed')

            avatarUrl = data.avatarUrl
          }

          const { ok, data } = await api(`/api/role/update-role/${role_id}`, 'PUT', {
            name: form.name,
            description: form.description,
            active: form.active,
            avatar: avatarUrl
          })

          if (ok) {
            setIsEdit(false)
            setSelectedAvatar(null)
            setAvatarPreview(null)
            showAlert('Role updated successfully', 'success')
            fetchRole();
          } else {
            showAlert(data.message || 'Update failed', 'error')
          }
        } catch (err) {
          console.error(err)
          showAlert('Something went wrong', 'error')
        }
      },
      onCancel: () => showAlert('Update cancelled', 'info'),
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
  }

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
    if (form.avatar) return form.avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=4f46e5&color=fff&size=256`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading role...</p>
        </div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaUserShield className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Role not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 group">
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="ml-2">Back</span>
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Header Section with Beautiful Gradient */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 px-8 py-16 text-center relative overflow-hidden">

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </div>

            {/* Avatar Section */}
            <div className="mb-8 relative inline-block">
              <div className="relative">
                <img
                  src={getAvatarSrc()}
                  alt="Role Avatar"
                  className="w-40 h-40 rounded-full mx-auto object-cover border-6 border-white shadow-2xl transition-all duration-300 hover:scale-105"
                />
                
                {/* Edit Overlay */}
                {isEdit && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer group">
                    <div className="flex space-x-3">
                      <label htmlFor="avatar-upload" className="cursor-pointer bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg group-hover:scale-110 transform duration-200">
                        <FaCamera className="w-5 h-5" />
                      </label>
                      {(form.avatar || avatarPreview) && (
                        <button
                          onClick={removeAvatar}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg group-hover:scale-110 transform duration-200"
                          type="button"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-white shadow-lg ${
                  form.active 
                    ? 'bg-gray-500 text-white' 
                    : 'bg-green-500 text-white'

                }`}>
                  {form.active ? <FaCheckCircle className="w-3 h-3 mr-1" /> : <FaTimesCircle className="w-3 h-3 mr-1" />}
                  {form.active ? 'Inactive' : 'Active'}
                </div>
              </div>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Avatar Change Actions */}
            {selectedAvatar && (
              <div className="mb-6 flex justify-center space-x-3">
                <button
                  onClick={cancelAvatarChange}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 backdrop-blur-sm border border-white/30"
                  type="button"
                >
                  Cancel Change
                </button>
              </div>
            )}

            {/* Role Name */}
            <div className="relative z-10">
              {isEdit ? (
                <Input
                  className="text-3xl font-bold text-center bg-white/20 border-white/30 text-white placeholder-white/70 backdrop-blur-sm mb-4 max-w-md mx-auto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Role Name"
                />
              ) : (
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {form.name}
                </h1>
              )}
              <div className="flex items-center justify-center text-white/90 text-lg">
                <FaUserShield className="mr-2" />
                <span>System Role</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Status Control */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Role Status
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Control whether this role is active and can be assigned to users
                      </p>
                    </div>
                    <div className="ml-6">
                      <Switch
                        checked={form.active}
                        disabled={!isEdit}
                        onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Description
                  </h3>
                  {isEdit ? (
                    <Textarea
                      className="min-h-[120px] resize-none"
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the purpose and responsibilities of this role..."
                    />
                  ) : (
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {form.description || (
                        <span className="text-gray-500 italic">No description provided</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Role Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Role Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Role ID</span>
                      <span className="font-mono text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded">
                        {role_id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.active 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'

                      }`}>
                        {form.active ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Card */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    {isEdit ? (
                      <>
                        <Button 
                          onClick={handleSave} 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="lg"
                        >
                          <FaSave className="mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEdit(false)} 
                          className="w-full"
                          size="lg"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEdit(true)} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="lg"
                      >
                        <FaEdit className="mr-2" />
                        Edit Role
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleViewPage