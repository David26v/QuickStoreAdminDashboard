'use client'
import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, Briefcase, Save, Loader2 } from 'lucide-react';
import supabase from '@/lib/helper';

const AddUserModal = ({ isOpen, onClose, clientId, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('clients_users')
        .insert([
          {
            client_id: clientId,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null,
            department: formData.department,
            position: formData.position,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        department: '',
        position: ''
      });
      
      // Notify parent component
      onUserAdded();
      onClose();
      
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.message.includes('duplicate key')) {
        setErrors({ email: 'A user with this email already exists' });
      } else {
        alert('Failed to add user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        department: '',
        position: ''
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New User</h2>
              <p className="text-sm text-slate-400">Create a new user account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium text-white flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Full Name *
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className={`w-full px-4 py-2.5 bg-gray-800/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.full_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.full_name && (
              <p className="text-red-400 text-sm">{errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className={`w-full px-4 py-2.5 bg-gray-800/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 bg-gray-800/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              Department *
            </label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
              className={`w-full px-4 py-2.5 bg-gray-800/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.department ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.department && (
              <p className="text-red-400 text-sm">{errors.department}</p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Position *
            </label>
            <input
              id="position"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter position/job title"
              className={`w-full px-4 py-2.5 bg-gray-800/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.position ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.position && (
              <p className="text-red-400 text-sm">{errors.position}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Add User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;