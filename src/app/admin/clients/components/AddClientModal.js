// components/AddClientModal.js
import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Lock,
  Shield,
  Package,
  Eye,
  Hand,
  CreditCard,
} from 'lucide-react';
import supabase from "@/lib/helper";
import { FormModal } from '@/components/ui/ModalQuickStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const AddClientModal = ({
  isOpen,
  onClose,
  onClientAdded,
  editClient = null
}) => {
  const isEditMode = Boolean(editClient);
  const [formData, setFormData] = useState({
    name: editClient?.name || '',
    location: editClient?.location || '',
    contact_person: editClient?.contact_person || '',
    email: editClient?.email || '',
    phone: editClient?.phone || '',
    notes: editClient?.notes || '',
  });

  const [clientSettingsId, setClientSettingsId] = useState(null); // ID of the settings record
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableLockers, setAvailableLockers] = useState([]);
  const [assignedLockerIds, setAssignedLockerIds] = useState([]);
  const [initialAssignedLockerIds, setInitialAssignedLockerIds] = useState([]);

  // --- Updated State for Auth Methods ---
  const [availableAuthMethods, setAvailableAuthMethods] = useState([]); // Fetched from auth_methods table
  const [selectedAuthMethodIds, setSelectedAuthMethodIds] = useState([]); // Stores IDs from auth_methods
  const [initialSelectedAuthMethodIds, setInitialSelectedAuthMethodIds] = useState([]); // For tracking changes on edit

  // --- Fetch Available Auth Methods and Client Data ---
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isOpen) {
        setLoading(true);
        setErrors({});
        try {
          // 1. Fetch available authentication methods
          const { data: authMethodsData, error: authMethodsError } = await supabase
            .from('auth_methods')
            .select('id, name, technical_name') // Fetch id and name for display/selection
            .eq('is_active', true); // Only fetch active methods
          if (authMethodsError) throw authMethodsError;
          if (isMounted) {
            setAvailableAuthMethods(authMethodsData || []);
          }

          // 2. Fetch available lockers
          const { data: lockersData, error: lockersError } = await supabase
            .from('lockers')
            .select('id, locker_number, client_id');
          if (lockersError) throw lockersError;
          if (isMounted) {
            setAvailableLockers(lockersData || []);
          }

          if (isEditMode && editClient?.id) {
            // --- Fetch Client Settings ID ---
            const { data: settingsData, error: settingsError } = await supabase
              .from('client_locker_settings')
              .select('id') // Only need the ID now
              .eq('client_id', editClient.id)
              .single();
            if (settingsError && settingsError.code !== 'PGRST116') {
              throw settingsError;
            }
            if (settingsData && isMounted) {
              setClientSettingsId(settingsData.id);
            }

            // --- Fetch Assigned Auth Method IDs ---
            // Requires clientSettingsId to be fetched first, or fetch settings ID again here
            let settingsIdForAuth = null;
            if (settingsData) {
                settingsIdForAuth = settingsData.id;
            } else {
                // If no settings record exists yet, there are no auth methods assigned
                if (isMounted) {
                    setSelectedAuthMethodIds([]);
                    setInitialSelectedAuthMethodIds([]);
                }
            }

            if (settingsIdForAuth) {
                const { data: clientAuthMethodsData, error: clientAuthMethodsError } = await supabase
                .from('client_auth_methods')
                .select('auth_method_id')
                .eq('client_setting_id', settingsIdForAuth);

                if (clientAuthMethodsError) throw clientAuthMethodsError;

                const assignedMethodIds = clientAuthMethodsData?.map(item => item.auth_method_id) || [];
                if (isMounted) {
                    setSelectedAuthMethodIds(assignedMethodIds);
                    setInitialSelectedAuthMethodIds(assignedMethodIds);
                }
            }


            // --- Fetch Initially Assigned Lockers ---
            const initiallyAssigned = lockersData
              ?.filter(l => l.client_id === editClient.id)
              .map(l => l.id) || [];
            if (isMounted) {
              setAssignedLockerIds(initiallyAssigned);
              setInitialAssignedLockerIds(initiallyAssigned);
            }
          } else {
            // --- Reset for Add Mode ---
            if (isMounted) {
              setAssignedLockerIds([]);
              setInitialAssignedLockerIds([]);
              setSelectedAuthMethodIds([]); // Reset selected auth method IDs
              setInitialSelectedAuthMethodIds([]);
              setClientSettingsId(null);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          if (isMounted) {
            setErrors({ fetch: 'Failed to load data. Please try again.' });
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [isOpen, isEditMode, editClient?.id]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    // --- Updated Validation for Auth Methods ---
    if (selectedAuthMethodIds.length === 0) {
      newErrors.auth_methods = 'At least one authentication method is required.';
    }
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

  
  const handleAuthMethodToggle = (methodId) => {
    setSelectedAuthMethodIds(prevSelected => {
      if (prevSelected.includes(methodId)) {
        return prevSelected.filter(id => id !== methodId);
      } else {
        return [...prevSelected, methodId];
      }
    });
  
    if (errors.auth_methods) {
       setErrors(prev => ({ ...prev, auth_methods: '' }));
    }
  };

  const handleLockerToggle = (lockerId) => {
    setAssignedLockerIds(prev => {
      if (prev.includes(lockerId)) {
        return prev.filter(id => id !== lockerId);
      } else {
        return [...prev, lockerId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      let clientData;
      let clientId;
      let settingsIdToUse = clientSettingsId; 

      // --- 1. Insert/Update Client ---
      if (isEditMode) {
        const { data, error: clientError } = await supabase
          .from('clients')
          .update({
            name: formData.name.trim(),
            location: formData.location.trim(),
            contact_person: formData.contact_person.trim() || null,
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editClient.id)
          .select()
          .single();
        if (clientError) throw clientError;
        clientData = data;
        clientId = data.id;
      } else {
        const { data, error: clientError } = await supabase
          .from('clients')
          .insert([{
            name: formData.name.trim(),
            location: formData.location.trim(),
            contact_person: formData.contact_person.trim() || null,
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null
          }])
          .select()
          .single();
        if (clientError) throw clientError;
        clientData = data;
        clientId = data.id;
      }

     
      const { data: upsertedSettingsData, error: upsertSettingsError } = await supabase
        .from('client_locker_settings')
        .upsert({ client_id: clientId }, { onConflict: 'client_id' }) 
        .select('id') 
        .single();

      if (upsertSettingsError) throw upsertSettingsError;
      settingsIdToUse = upsertedSettingsData.id; 

     
      const methodsToAdd = selectedAuthMethodIds.filter(id => !initialSelectedAuthMethodIds.includes(id));
      const methodsToRemove = initialSelectedAuthMethodIds.filter(id => !selectedAuthMethodIds.includes(id));

      if (methodsToAdd.length > 0) {
        const recordsToAdd = methodsToAdd.map(methodId => ({
          client_setting_id: settingsIdToUse,
          auth_method_id: methodId
        }));
        const { error: insertAuthError } = await supabase
          .from('client_auth_methods')
          .insert(recordsToAdd);
        if (insertAuthError) throw insertAuthError;
      }

      if (methodsToRemove.length > 0) {
        const { data: recordsToDelete, error: fetchDeleteError } = await supabase
          .from('client_auth_methods')
          .select('id')
          .eq('client_setting_id', settingsIdToUse)
          .in('auth_method_id', methodsToRemove);

        if (fetchDeleteError) throw fetchDeleteError;

        const recordIdsToDelete = recordsToDelete?.map(record => record.id) || [];
        if (recordIdsToDelete.length > 0) {
            const { error: deleteAuthError } = await supabase
              .from('client_auth_methods')
              .delete()
              .in('id', recordIdsToDelete); 
             if (deleteAuthError) throw deleteAuthError;
        }
      }

      const lockersToAssign = assignedLockerIds.filter(id => !initialAssignedLockerIds.includes(id));
      const lockersToUnassign = initialAssignedLockerIds.filter(id => !assignedLockerIds.includes(id));

      if (lockersToAssign.length > 0) {
        const { error: assignError } = await supabase
          .from('lockers')
          .update({ client_id: clientId })
          .in('id', lockersToAssign);
        if (assignError) throw assignError;
      }

      if (lockersToUnassign.length > 0) {
        const { error: unassignError } = await supabase
          .from('lockers')
          .update({ client_id: null })
          .in('id', lockersToUnassign);
        if (unassignError) throw unassignError;
      }

      setFormData({
        name: '',
        location: '',
        contact_person: '',
        email: '',
        phone: '',
        notes: '',
      });
      setAssignedLockerIds([]);
      setInitialAssignedLockerIds([]);
      setSelectedAuthMethodIds([]); 
      setInitialSelectedAuthMethodIds([]);
      setClientSettingsId(null);
      setErrors({});
      onClientAdded?.(clientData);
      onClose();
    } catch (error) {
      console.error('Error saving client/settings/lockers/auth:', error);
      setErrors({ submit: error.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        location: '',
        contact_person: '',
        email: '',
        phone: '',
        notes: '',
      });
      setAssignedLockerIds([]);
      setInitialAssignedLockerIds([]);
      setSelectedAuthMethodIds([]); 
      setInitialSelectedAuthMethodIds([]);
      setClientSettingsId(null);
      setErrors({});
      onClose();
    }
  };


  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Client" : "Add New Client"}
      onSubmit={handleSubmit}
      submitText={isEditMode ? "Update Client" : "Add Client"}
      loading={loading}
      size="lg"
      showLogo={true}
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {(errors.submit || errors.fetch) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700 mt-1">{errors.submit || errors.fetch}</p>
            </div>
          </div>
        )}
        {/* Basic Information Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <span>Basic Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter client name"
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
            <div className="md:col-span-2">
              <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter client location"
                  className={`pl-10 ${errors.location ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  disabled={loading}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.location && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- New Section: Locker Access Settings --- */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span>Locker Access Settings</span>
          </h3>
          <div className="space-y-4">
            {/* --- Multi-Select Authentication Methods --- */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication Methods *
              </Label>
              <p className="text-xs text-gray-500 mb-2">Select one or more methods users can use to access lockers for this client.</p>

              {/* Display Selected Methods Summary */}
              {selectedAuthMethodIds.length > 0 && (
                <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-xs font-medium text-blue-800 flex items-center gap-1 mb-2">
                    <Eye className="w-3.5 h-3.5" /> Selected Methods:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAuthMethodIds.map((methodId) => {
                      const method = availableAuthMethods.find(m => m.id === methodId);
                      if (!method) return null; // Handle case where method ID is not found
                      const methodLabel = method.name || method.technical_name || 'Unknown Method';
                      // Simple icon mapping based on method name/technical_name
                      let IconComponent = Shield; // Default
                      const lowerName = (method.technical_name || method.name || '').toLowerCase();
                      if (lowerName.includes('qr')) IconComponent = Package;
                      if (lowerName.includes('password')) IconComponent = Lock;
                      if (lowerName.includes('face')) IconComponent = User;
                      if (lowerName.includes('palm')) IconComponent = Hand;
                      if (lowerName.includes('card')) IconComponent = CreditCard;
                      return (
                        <span
                          key={methodId}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          {methodLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Checkbox Group for Available Auth Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                {availableAuthMethods.length > 0 ? (
                  availableAuthMethods.map((method) => {
                    const isSelected = selectedAuthMethodIds.includes(method.id);
                    return (
                      <div key={method.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`auth-method-${method.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleAuthMethodToggle(method.id)}
                          disabled={loading}
                        />
                        <Label
                          htmlFor={`auth-method-${method.id}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}
                        >
                          {method.name || method.technical_name}
                        </Label>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 col-span-2">No authentication methods available.</p>
                )}
              </div>

              {/* Validation Error for Auth Methods */}
              {errors.auth_methods && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.auth_methods}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">These settings will determine how users authenticate to access lockers assigned to this client.</p>
            </div>
            {/* --- End Multi-Select Authentication Methods --- */}

            {/* Locker Assignment */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Lockers (Optional)
              </Label>
              <p className="text-xs text-gray-500 mb-2">Select lockers to assign to this client. You can also manage assignments later.</p>
              {loading && availableLockers.length === 0 ? (
                <p className="text-sm text-gray-500">Loading lockers...</p>
              ) : availableLockers.length > 0 ? (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {availableLockers.map((locker) => {
                    // A locker is available if it's unassigned or already assigned to this client
                    const isAvailable = !locker.client_id || locker.client_id === editClient?.id;
                    const isAssigned = assignedLockerIds.includes(locker.id);
                    const wasInitiallyAssigned = initialAssignedLockerIds.includes(locker.id);
                    // Disable checkbox if locker is assigned to another client or if modal is loading
                    const isDisabled = loading || !isAvailable;
                    return (
                      <div
                        key={locker.id}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          id={`locker-${locker.id}`}
                          checked={isAssigned}
                          disabled={isDisabled}
                          onCheckedChange={() => handleLockerToggle(locker.id)}
                        />
                        <Label
                          htmlFor={`locker-${locker.id}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                            isDisabled ? 'text-gray-400' : 'text-gray-700'
                          }`}
                        >
                          Locker #{locker.locker_number}
                          {wasInitiallyAssigned && !isAssigned && (
                            <span className="text-xs text-orange-600 ml-1">(Currently Assigned)</span>
                          )}
                          {!isAvailable && locker.client_id !== editClient?.id && (
                             <span className="text-xs text-red-500 ml-1">(Assigned Elsewhere)</span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No lockers available in the system.</p>
              )}
            </div>
          </div>
        </div>
        {/* --- End New Section --- */}

        {/* Contact Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Contact Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </Label>
              <div className="relative">
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Enter contact person name"
                  className="pl-10"
                  disabled={loading}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  className={`pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  disabled={loading}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span>Additional Information</span>
          </h3>
          <div>
            <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes about this client..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Form Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Information</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Fields marked with * are required</li>
                <li>• Client information can be updated later if needed</li>
                <li>• Select multiple authentication methods for flexible access.</li>
                <li>• Lockers can be assigned to this client now or later.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddClientModal;