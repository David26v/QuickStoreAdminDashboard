import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Building2, 
} from 'lucide-react';
import supabase from "@/lib/helper"; 
import { FormModal } from '@/components/ui/ModalQuickStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AddClientTypeModal = ({
  isOpen,
  onClose,
  onClientTypeAdded, 
  editClientType = null 
}) => {
  const isEditMode = Boolean(editClientType);
  const [formData, setFormData] = useState({
    name: editClientType?.name || '',
    description: editClientType?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editClientType?.name || '',
        description: editClientType?.description || '',
      });
      setErrors({});
    } 
    else {
      
    }
  }, [isOpen, editClientType]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Client type name is required';
    }
    // Optional: Add validation for description if needed
    // e.g., if (formData.description && formData.description.length > 255) { ... }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error if it existed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous submit errors

    try {
      let clientTypeData;

      if (isEditMode) {
        // --- Update Client Type ---
        const { data, error: updateError } = await supabase
          .from('client_types')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editClientType.id)
          .select()
          .single();

        if (updateError) throw updateError;
        clientTypeData = data;
        console.log('Client type updated:', data); // For debugging

      } else {
        // --- Insert New Client Type ---
        const { data, error: insertError } = await supabase
          .from('client_types')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim() || null
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        clientTypeData = data;
        console.log('Client type created:', data); // For debugging
      }

      // Reset form state
      setFormData({ name: '', description: '' });
      setErrors({});

      // Notify parent component
      onClientTypeAdded?.(clientTypeData);

      // Close the modal
      onClose();

    } catch (error) {
      console.error('Error saving client type:', error);
      // Handle specific Supabase errors if needed
      setErrors({ submit: error.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Optionally reset form here too if not done in useEffect
      // setFormData({ name: '', description: '' });
      // setErrors({});
      onClose();
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Client Type" : "Add New Client Type"}
      onSubmit={handleSubmit}
      submitText={isEditMode ? "Update Client Type" : "Add Client Type"}
      loading={loading}
      size="md" // Adjust size if needed, lg was used for AddClient
      showLogo={true}
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {(errors.submit) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Client Type Information Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4"> {/* Using similar gradient */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-orange-600" /> {/* Using Building2 icon */}
            <span>Client Type Details</span>
          </h3>
          <div className="space-y-4"> {/* Changed to space-y-4 for vertical spacing */}
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Client Type Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Gym, Office, School"
                className={errors.name ? 'border-red-500 focus:ring-red-500/20' : ''}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the client type..."
                rows="3" // Adjust rows as needed
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none"
                disabled={loading}
              />
              {/* Optional: Add character limit or validation error display for description */}
            </div>
          </div>
        </div>

        {/* Form Instructions (Optional, similar to AddClientModal) */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Information</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Fields marked with * are required</li>
                <li>• Client type names should be unique</li>
                <li>• Description helps identify the purpose of the client type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddClientTypeModal;