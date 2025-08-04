// components/AddLockerModal.jsx
import React, { useState, useEffect } from 'react';
import {
  PackagePlus,
  Hash,
  Building2,
  Wrench,
  Home,
  Archive,
  Truck,
  XCircle,
  AlertCircle,
  Smartphone,
  HardHat,
  CheckCircle 
} from 'lucide-react';
import supabase from "@/lib/helper";
import { FormModal } from '@/components/ui/ModalQuickStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddLockerModal = ({ isOpen, onClose, onLockerAdded }) => {
  const [formData, setFormData] = useState({
    locker_number: '',
    client_id: '',
    status: 'available', // Default, will likely change based on device assignment
    device_id: '', // Will hold the actual device UUID
  });
  const [clients, setClients] = useState([]);
  // Updated devices state to include locker assignment info
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'available', label: 'Available', icon: <XCircle className="w-4 h-4 text-green-600" /> },
    { value: 'no_device_yet', label: 'No Device Yet', icon: <XCircle className="w-4 h-4 text-purple-600" /> },
    { value: 'under_maintenance', label: 'Under Maintenance', icon: <HardHat className="w-4 h-4 text-yellow-600" /> },
    { value: 'onsite', label: 'Onsite', icon: <Home className="w-4 h-4 text-indigo-600" /> },
    { value: 'in_warehouse', label: 'In Warehouse', icon: <Archive className="w-4 h-4 text-gray-600" /> },
    { value: 'arriving_to_client', label: 'Arriving to Client', icon: <Truck className="w-4 h-4 text-orange-600" /> },
    { value: 'received_by_client', label: 'Received by Client', icon: <CheckCircle className="w-4 h-4 text-blue-600" /> }, // Add this status
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isOpen) {
        setLoading(true);
        setErrors({});
        try {
          // Fetch clients
          const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('id, name')
            .order('name');

          if (clientsError) throw clientsError;

          // Fetch devices that are NOT currently assigned to a locker
          // This assumes the devices table has a locker_id column that is NULL if unassigned.
          const { data: devicesData, error: devicesError } = await supabase
            .from('devices')
            .select('id, manufacturer, model, locker_id') // Select locker_id to check assignment
            .is('locker_id', null) // Only get devices not assigned to any locker
            .order('manufacturer')
            .order('model');

          if (devicesError) throw devicesError;

          if (isMounted) {
            setClients(clientsData || []);
            // Filter devices again on client side just in case, though Supabase query should handle it
            const unassignedDevices = devicesData?.filter(d => d.locker_id === null) || [];
            setDevices(unassignedDevices);
          }
        } catch (err) {
          console.error("Error fetching data for modal:", err);
          if (isMounted) {
            setErrors({ fetch: 'Failed to load data. Please try again.' });
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        // Reset form when modal closes
        setFormData({
          locker_number: '',
          client_id: '',
          status: 'available',
          device_id: '',
        });
        setErrors({});
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.locker_number.trim()) {
      newErrors.locker_number = 'Locker number is required.';
    } else if (isNaN(formData.locker_number) || parseInt(formData.locker_number, 10) <= 0) {
        newErrors.locker_number = 'Please enter a valid positive number.';
    }
    if (!formData.client_id) {
      newErrors.client_id = 'Please select a client.';
    }
    // Device is optional, but if selected, validate it exists in the current list
    if (formData.device_id && !devices.some(d => d.id === formData.device_id)) {
        newErrors.device_id = 'Selected device is invalid or already assigned.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // --- Automatically set status based on device selection ---
    // This logic assumes assigning a device makes it 'onsite' or 'received_by_client'
    // You can adjust the target status as needed.
    if (name === 'device_id' && value) { // If a device is selected
       const targetStatus = 'onsite'; // Or 'received_by_client'
       setFormData(prev => ({
         ...prev,
         status: targetStatus // Update status in form data
       }));
       // Clear status error if it existed
       if (errors.status) {
         setErrors(prev => ({ ...prev, status: '' }));
       }
    } else if (name === 'device_id' && !value) { // If device selection is cleared
       // Optionally revert status if no device is selected
       // setFormData(prev => ({ ...prev, status: 'no_device_yet' })); // Or 'available'
    }
    // --- End Automatic Status Logic ---
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
        const lockerNum = parseInt(formData.locker_number, 10);

        // 1. Check for duplicate locker number
        const { data: existingLockers, error: checkError } = await supabase
            .from('lockers')
            .select('id')
            .eq('locker_number', lockerNum);
        if (checkError) throw checkError;
        if (existingLockers && existingLockers.length > 0) {
            throw new Error("A locker with this number already exists.");
        }

        // 2. Prepare locker data
        // Determine initial status based on device assignment
        let initialLockerStatus = formData.status;
        if (formData.device_id) {
            // If a device is assigned, locker is likely 'onsite' or 'received_by_client'
            initialLockerStatus = 'onsite'; // Or 'received_by_client'
        } else {
            // If no device, status might be 'no_device_yet' or 'available'
            initialLockerStatus = 'no_device_yet'; // Or keep formData.status
        }

        const newLockerData = {
          locker_number: lockerNum,
          client_id: formData.client_id || null,
          status: initialLockerStatus,
        };

        // 3. Insert the new locker
        const { data: lockerData, error: insertLockerError } = await supabase
          .from('lockers')
          .insert([newLockerData])
          .select()
          .single();

        if (insertLockerError) throw insertLockerError;
        const newLockerId = lockerData.id;
        console.log("New locker created:", lockerData);

        // 4. Assign Device to Locker (if selected)
        // Update the *device* record to link it to the new locker
        if (formData.device_id) {
          const { error: updateDeviceError } = await supabase
            .from('devices')
            .update({
                locker_id: newLockerId, // Assign locker to the device
                // Optionally update device status too
                // status: 'assigned_to_locker' // Or similar
             })
            .eq('id', formData.device_id); // Target the specific device selected
          if (updateDeviceError) throw updateDeviceError;
          console.log("Device assigned to locker and device updated.");
        }

        // 5. Create Locker Doors
        // --- IMPORTANT: This part depends on your Supabase Trigger ---
        // If you have a trigger that automatically creates doors based on `door_count`
        // on the `lockers` table, you DO NOT need this section.
        // Just make sure `door_count` is set correctly in `newLockerData` if needed.
        //
        // If you DO need to create doors manually here:
        //
        // const numberOfDoors = 24; // Or get from a form field if variable
        // const doorInserts = [];
        // for (let i = 1; i <= numberOfDoors; i++) {
        //   doorInserts.push({
        //     locker_id: newLockerId,
        //     door_number: i,
        //     status: 'available', // Default door status
        //     client_id: formData.client_id || null,
        //   });
        // }
        // const { error: insertDoorsError } = await supabase
        //   .from('locker_doors')
        //   .insert(doorInserts);
        // if (insertDoorsError) {
        //   console.warn("Could not create locker doors:", insertDoorsError);
        //   // Handle error appropriately, maybe delete the locker?
        // } else {
        //   console.log(`${numberOfDoors} locker doors created.`);
        // }
        // --- END Manual Door Creation ---

        // 6. Notify parent and close
        onLockerAdded?.(lockerData);
        onClose();
    } catch (err) {
        console.error("Error creating locker/device:", err);
        // Differentiate between server errors and client validation errors if needed
        setErrors({ submit: err.message || 'Failed to create locker. Please try again.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Locker"
      onSubmit={handleSubmit}
      submitText="Add Locker"
      loading={loading}
      size="md"
      showLogo={true}
      icon={<PackagePlus className="w-6 h-6 text-orange-600" />}
    >
      <div className="space-y-6">
        {(errors.submit || errors.fetch) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700 mt-1">{errors.submit || errors.fetch}</p>
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="locker_number" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Hash className="w-4 h-4 mr-2 text-gray-500" />
            Locker Number *
          </Label>
          <Input
            id="locker_number"
            name="locker_number"
            type="number"
            value={formData.locker_number}
            onChange={handleChange}
            placeholder="Enter unique locker number"
            className={errors.locker_number ? 'border-red-500 focus:ring-red-500/20' : ''}
            disabled={loading}
          />
          {errors.locker_number && (
            <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.locker_number}</span>
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
            Client *
          </Label>
          <Select
            value={formData.client_id || undefined}
            onValueChange={(value) => handleSelectChange('client_id', value)}
            disabled={loading || clients.length === 0}
          >
            <SelectTrigger className={errors.client_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-clients" disabled>
                  No clients available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.client_id && (
            <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.client_id}</span>
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Initial Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
            disabled={loading || !!formData.device_id} // Disable if device is selected, as status is auto-set
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           {/* Info text about status being auto-set */}
           {formData.device_id && (
             <p className="mt-1 text-xs text-gray-500">
               Status is automatically set when a device is assigned.
             </p>
           )}
        </div>
        <div>
          <Label htmlFor="device_id" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
            Assign Device (Optional but Recommended)
          </Label>
          <Select
            value={formData.device_id || undefined} // Use undefined if empty
            onValueChange={(value) => handleSelectChange('device_id', value)}
            disabled={loading || devices.length === 0} // Disable if no unassigned devices
          >
            <SelectTrigger className={errors.device_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select an unassigned device" />
            </SelectTrigger>
            <SelectContent>
              {devices.length > 0 ? (
                devices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.manufacturer} {device.model}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-devices" disabled>
                  No unassigned devices available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-gray-500">
            Only unassigned devices are listed. Selecting a device will update the locker status.
          </p>
          {errors.device_id && (
            <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.device_id}</span>
            </p>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Information</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Locker Number must be unique.</li>
                <li>• Select the client this locker belongs to.</li>
                <li>• Assigning a device is recommended and will update the locker status.</li>
                <li>• Each device can only be assigned to one locker.</li>
                <li>• Locker doors will be created automatically based on locker configuration.</li> {/* Assuming trigger handles this */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddLockerModal;