'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAlert } from '@/components/providers/AlertProvider'
import { useDialog } from '@/components/providers/DialogProvider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import supabase, { api } from '@/lib/helper'
import { 
  FaBuilding, 
  FaUsers,
  FaCamera, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaUserTie,
  FaEnvelope 
} from 'react-icons/fa'
import Image from 'next/image'

const DepartmentView = () => {
  const { department_id } = useParams()
  const { showAlert } = useAlert()
  const { showProfile } = useDialog()
  const fileInputRef = useRef(null)
  const selectedLogoRef = useRef(null)

  const [department, setDepartment] = useState(null)
  
  const [form, setForm] = useState({ 
    name: '', 
    description: '',
    active: true,
    logo: '',
    location: '',
    phone: '',
    email: '',
    head_of_department: '',
    budget: '',
    employee_count: 0
  })


  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedLogo, setSelectedLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)


  const fetchDepartment = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("id", department_id)
        .single();
  
      if (error) throw error;
  
      setDepartment(data); 
    } 
    catch (error) {
      showAlert(`Failed to fetch department: ${error.message}`, "error");
      setDepartment(null); 
    } finally{
      setLoading(false)
    }
  }, [department_id, showAlert]);



  const handleSave = async () => {
    showProfile({
      title: 'Update Department',
      description: 'Are you sure you want to update this department?',
      onConfirm: async () => {
        try {
          let logoUrl = form.logo || ''
  
          const file = selectedLogoRef.current
          if (file) {
            const formData = new FormData()
            formData.append('logo', file)
            formData.append('department_id', department_id)
  
            const { ok, data } = await api('/api/departments/upload-logo', 'POST', formData)
            if (!ok) throw new Error(data.message || 'Logo upload failed')
  
            logoUrl = data.data.logoUrl


            console.log('logoUrl',logoUrl)
          }
  
          const payload = {
            id: department_id,
            name: form.name || '',
            description: form.description || '',
            active: Boolean(form.active),
            logo: logoUrl,
            location: form.location || '',
            phone: form.phone || '',
            email: form.email || '',
            head_of_department: form.head_of_department || '',
            budget: form.budget || '',
            employee_count: Number(form.employee_count) || 0,
          }
  
          const { ok, data } = await api(`/api/departments/update-department/${department_id}`, 'PUT', payload)
  
          if (ok) {
            setIsEdit(false)
            setSelectedLogo(null)
            selectedLogoRef.current = null // clear ref
            setLogoPreview(null)
            showAlert('Department updated successfully', 'success')
            fetchDepartment()
          } else {
            showAlert(data.message || 'Update failed', 'error')
          }
        } catch (err) {
          console.error('Error saving department:', err)
          showAlert('Something went wrong', 'error')
        }
      },
      onCancel: () => showAlert('Update cancelled', 'info'),
    })
  };
  

  const handleLogoChange = (e) => {
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
  
      selectedLogoRef.current = file 
      setSelectedLogo(file) 
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }
  

  const removeLogo = () => {
    setSelectedLogo(null)
    setLogoPreview(null)
    setForm({ ...form, logo: '' })
  };

  const cancelLogoChange = () => {
    setSelectedLogo(null)
    setLogoPreview(null)
  };

  const getLogoSrc = () => {
    if (logoPreview) return logoPreview
    if (form.logo) return form.logo
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Department')}&background=059669&color=fff&size=256&format=svg`
  };

  // Properly reset form with null checks
  const cancelEdit = () => {
    setIsEdit(false)
    setSelectedLogo(null)
    setLogoPreview(null)
    
    if (department) {
      console.log('department in form:', department)
      setForm({
        name: department.name || '',
        description: department.description || '',
        active: department.active !== undefined ? department.active : true,
        logo: department.logo || '',
        location: department.location || '',
        phone: department.phone || '',
        email: department.email || '',
        head_of_department: department.head_of_department || '',
        budget: department.budget || '',
        employee_count: department.employee_count || 0
      })
    }
  };

  // Safe form field handlers with proper type conversion
  const handleFormChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  };

  
  useEffect(() => {
    if (department_id) fetchDepartment();
  }, [department_id, fetchDepartment]);

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name || '',
        description: department.description || '',
        active: department.active !== undefined ? department.active : true,
        logo: department.logo || '',
        location: department.location || '',
        phone: department.phone || '',
        email: department.email || '',
        head_of_department: department.head_of_department || '',
        budget: department.budget || '',
        employee_count: department.employee_count || 0
      });
    }
  }, [department]);
  

  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? 0 : Number(value)
    setForm(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading department...</p>
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaBuilding className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Department not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 group">
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="ml-2">Back to Departments</span>
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Header Section with Emerald Gradient */}
          <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 px-8 py-16 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </div>

            {/* Department Logo */}
            <div className="mb-8 relative inline-block">
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl mx-auto bg-white/10 backdrop-blur-sm border-4 border-white shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-hidden">
                <Image
                  src={getLogoSrc()}
                  alt="Department Logo"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Department')}&background=059669&color=fff&size=256&format=svg`;
                  }}
                />
                </div>
                
                {/* Edit Overlay */}
                {isEdit && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer group">
                    <div className="flex space-x-3">
                      <label htmlFor="logo-upload" className="cursor-pointer bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg group-hover:scale-110 transform duration-200">
                        <FaCamera className="w-5 h-5" />
                      </label>
                      {(form.logo || logoPreview) && (
                        <button
                          onClick={removeLogo}
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
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {form.active ? <FaCheckCircle className="w-3 h-3 mr-1" /> : <FaTimesCircle className="w-3 h-3 mr-1" />}
                  {form.active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>

            {/* Logo Change Actions */}
            {selectedLogo && (
              <div className="mb-6 flex justify-center space-x-3">
                <button
                  onClick={cancelLogoChange}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 backdrop-blur-sm border border-white/30"
                  type="button"
                >
                  Cancel Change
                </button>
              </div>
            )}

            {/* Department Name */}
            <div className="relative z-10">
              {isEdit ? (
                <Input
                  className="text-3xl font-bold text-center bg-white/20 border-white/30 text-white placeholder-white/70 backdrop-blur-sm mb-4 max-w-md mx-auto"
                  value={form.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Department Name"
                />
              ) : (
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {form.name || 'Unnamed Department'}
                </h1>
              )}
              <div className="flex items-center justify-center text-white/90 text-lg">
                <FaBuilding className="mr-2" />
                <span>Department</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Department Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <FaMapMarkerAlt className="text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
                    </div>
                    {isEdit ? (
                      <Input
                        value={form.location || ''}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        placeholder="Building, Floor, Room"
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {form.location || <span className="text-gray-500 italic">No location specified</span>}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <FaEnvelope className="text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                    </div>
                    {isEdit ? (
                      <Input
                        type="email"
                        value={form.email || ''}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        placeholder="department@company.com"
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {form.email || <span className="text-gray-500 italic">No email specified</span>}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <FaPhone className="text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                    </div>
                    {isEdit ? (
                      <Input
                        value={form.phone || ''}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {form.phone || <span className="text-gray-500 italic">No phone specified</span>}
                      </p>
                    )}
                  </div>

                  {/* Head of Department */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <FaUserTie className="text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Head</h3>
                    </div>
                    {isEdit ? (
                      <Input
                        value={form.head_of_department || ''}
                        onChange={(e) => handleFormChange('head_of_department', e.target.value)}
                        placeholder="John Doe"
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {form.head_of_department || <span className="text-gray-500 italic">No head assigned</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Control */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Department Status
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Control whether this department is active and operational
                      </p>
                    </div>
                    <div className="ml-6">
                      <Switch
                        checked={Boolean(form.active)}
                        disabled={!isEdit}
                        onCheckedChange={(checked) => handleFormChange('active', checked)}
                        className="data-[state=checked]:bg-emerald-500"
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
                      value={form.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe the purpose, objectives, and responsibilities of this department..."
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
                {/* Department Info Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-emerald-100 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Department Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Department ID</span>
                      <span className="font-mono text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded">
                        {department_id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Employees</span>
                      <div className="flex items-center">
                        <FaUsers className="w-3 h-3 mr-1 text-emerald-600" />
                        {isEdit ? (
                          <Input
                            type="number"
                            value={form.employee_count || 0}
                            onChange={(e) => handleNumberChange('employee_count', e.target.value)}
                            className="w-16 h-6 text-xs"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium">{form.employee_count || 0}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Info */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Budget Information
                  </h3>
                  {isEdit ? (
                    <Input
                      value={form.budget || ''}
                      onChange={(e) => handleFormChange('budget', e.target.value)}
                      placeholder="$100,000"
                      className="w-full"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {form.budget || <span className="text-gray-500 text-base font-normal italic">No budget set</span>}
                    </p>
                  )}
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
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          size="lg"
                        >
                          <FaSave className="mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={cancelEdit}
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="lg"
                      >
                        <FaEdit className="mr-2" />
                        Edit Department
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

export default DepartmentView