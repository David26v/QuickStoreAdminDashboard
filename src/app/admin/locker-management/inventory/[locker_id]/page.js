'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Pencil, 
  Save, 
  X, 
  MapPin, 
  Palette, 
  Ruler, 
  Image, 
  AlertTriangle,
  Lock,
  Shield,
  Key,
  Package,
  Calendar,
  User,
  Building,
  Loader2,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Smartphone,
  Plus,
  Upload,
  Camera
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import getStatusBadge from '../components/StatusBadge';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/helper';

const DeviceModal = ({ isOpen, onClose, onDeviceCreated, clients, lockerClientId }) => {
  const [formData, setFormData] = useState({
    device_id: '',
    manufacturer: '',
    model: '',
    android_version: '',
    firmware_version: '',
    app_version: '',
    client_id: lockerClientId || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lockerClientId) {
      setFormData(prev => ({ ...prev, client_id: lockerClientId }));
    }
  }, [lockerClientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([formData]);
      if (error) throw error;
      setFormData({
        device_id: '',
        manufacturer: '',
        model: '',
        android_version: '',
        firmware_version: '',
        app_version: '',
        client_id: lockerClientId || '',
        status: true
      });
      onClose();
      onDeviceCreated && onDeviceCreated();
    } catch (err) {
      console.error("Error creating device:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Add New Device</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="device_id">Device ID *</Label>
                <Input
                  id="device_id"
                  value={formData.device_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, device_id: e.target.value }))}
                  placeholder="TAB001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                  placeholder="Samsung"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Galaxy Tab A8"
                />
              </div>
              <div>
                <Label htmlFor="android_version">Android Version</Label>
                <Input
                  id="android_version"
                  value={formData.android_version}
                  onChange={(e) => setFormData(prev => ({ ...prev, android_version: e.target.value }))}
                  placeholder="12.0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmware_version">Firmware Version</Label>
                <Input
                  id="firmware_version"
                  value={formData.firmware_version}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmware_version: e.target.value }))}
                  placeholder="1.0.0"
                />
              </div>
              <div>
                <Label htmlFor="app_version">App Version</Label>
                <Input
                  id="app_version"
                  value={formData.app_version}
                  onChange={(e) => setFormData(prev => ({ ...prev, app_version: e.target.value }))}
                  placeholder="1.0.3"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="client_id">Client</Label>
              <select
                id="client_id"
                value={formData.client_id}
                onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.device_id}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Device
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LockerInformationDetails = () => {
  const [lockerData, setLockerData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [currentAssignedDeviceId, setCurrentAssignedDeviceId] = useState(null);
  const [selectedDeviceIdForSave, setSelectedDeviceIdForSave] = useState(null);
  const router = useRouter();
  const { locker_id } = useParams();


  useEffect(() => {
    let timerId;
    if (saveMessage.text) {
      timerId = setTimeout(() => {
        setSaveMessage({ type: '', text: '' }); 
      }, 5000); 
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [saveMessage.text]);

  const loadLockerData = async () => {
  if (!locker_id) {
    setLoading(false);
    return;
  }

  setLoading(true);
  setFetchError(null);
  setSaveMessage({ type: '', text: '' });

  try {
    // Fetch locker data
    const { data: lockerData, error: lockerError } = await supabase
      .from('lockers')
      .select(`
        id,
        name,
        location,
        status,
        color,
        size,
        picture_url,
        damage_picture_url,
        created_at,
        updated_at,
        client:clients (id, name)
      `)
      .eq('id', locker_id)
      .single();

    if (lockerError) throw lockerError;
    if (!lockerData) throw new Error('Locker not found.');

    setLockerData(lockerData);
    setEditedData({
      name: lockerData.name || '',
      location: lockerData.location || '',
      color: lockerData.color || '',
      size: lockerData.size || '',
      picture_url: lockerData.picture_url || '',
      damage_picture_url: lockerData.damage_picture_url || '',
    });


    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .select(`
        id,
        device_id,
        manufacturer,
        model,
        android_version,
        app_version,
        status,
        clients (name)
      `)
      .eq('locker_id', locker_id)
      .single();


    if (deviceError) throw deviceError;
      
  

    if (deviceData) {
      const device_id = deviceData.id;
      setCurrentAssignedDeviceId(device_id);
      setSelectedDeviceIdForSave(deviceData.id);
      setSelectedDevice(deviceData);
    } 
    else {
      setCurrentAssignedDeviceId(null);
      setSelectedDeviceIdForSave(null);
      setSelectedDevice(null);
    }

  } catch (err) {
    console.error('Error fetching locker information:', err);
    setFetchError(err.message || 'Failed to load locker information.');
  } finally {
    setLoading(false);
  }
};



  const loadDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select(`
          id,
          device_id,
          manufacturer,
          model,
          status,
          clients (name)
        `);
      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name');
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  useEffect(() => {
    loadLockerData();
    loadDevices();
    loadClients();
  }, [locker_id]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData({
        name: lockerData?.name || '',
        location: lockerData?.location || '',
        color: lockerData?.color || '',
        size: lockerData?.size || '',
        picture_url: lockerData?.picture_url || '',
        damage_picture_url: lockerData?.damage_picture_url || '',
      });
      setSaveMessage({ type: '', text: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedData(prev => ({ ...prev, [id]: value }));
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceIdForSave(deviceId);
    if (deviceId) {
      const device = devices.find(d => d.id === deviceId);
      setSelectedDevice(device || null);
    } else {
      setSelectedDevice(null);
    }
  };

  const handleSave = async () => {
    if (!locker_id) return;
    setSaveLoading(true);
    setSaveMessage({ type: '', text: '' });
    try {
      const { error: lockerUpdateError } = await supabase
        .from('lockers')
        .update({
          name: editedData.name,
          location: editedData.location,
          color: editedData.color,
          size: editedData.size,
          picture_url: editedData.picture_url,
          damage_picture_url: editedData.damage_picture_url,
          updated_at: new Date(),
        })
        .eq('id', locker_id);

      if (lockerUpdateError) throw lockerUpdateError;
      
      if (selectedDeviceIdForSave !== currentAssignedDeviceId) {
        if (currentAssignedDeviceId) {
          const { error: clearOldDeviceError } = await supabase
            .from('devices')
            .update({ locker_id: null })
            .eq('id', currentAssignedDeviceId);
          if (clearOldDeviceError) throw clearOldDeviceError;
        }

        if (selectedDeviceIdForSave) {
          const clientIdForDevice = lockerData?.client?.id; 
          const updatePayload = { locker_id: locker_id };
          if (clientIdForDevice) {
             updatePayload.client_id = clientIdForDevice;
          }

          const { error: assignNewDeviceError } = await supabase
            .from('devices')
            .update(updatePayload)
            .eq('id', selectedDeviceIdForSave);
          if (assignNewDeviceError) throw assignNewDeviceError;
        }
      }

      setLockerData(prev => ({
        ...prev,
        ...editedData,
        updated_at: new Date().toISOString(),
      }));
      setCurrentAssignedDeviceId(selectedDeviceIdForSave);
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Locker information updated successfully!' });
      
      loadLockerData(); 
      loadDevices(); 
    } catch (err) {
      console.error('Error saving locker data:', err);
      setSaveMessage({ type: 'error', text: `Failed to save: ${err.message || 'Unknown error'}` });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeviceCreated = () => {
    loadDevices();
    setSaveMessage({ type: 'success', text: 'Device created successfully!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative z-10 text-center space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              <span className="text-lg font-semibold text-gray-800">Loading locker information...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Locker</h2>
            <p className="text-gray-600 mb-6">{fetchError}</p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={loadLockerData}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lockerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Locker Not Found</h3>
            <p className="text-gray-600 mb-6">
              No locker data could be found for ID: <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                {locker_id}
              </span>
            </p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6 relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-gray-600 bg-clip-text text-transparent">
                  Locker Details
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Package className="w-4 h-4 text-orange-500" />
                  Viewing information for locker 
                  <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                    {lockerData?.name || 'Unknown Locker'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    disabled={saveLoading}
                    className="border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Locker
                </Button>
              )}
            </div>
          </div>
        </div>

        {saveMessage.text && (
          <div className={`p-4 rounded-2xl shadow-lg border ${saveMessage.type === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200' : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200'}`}>
            <div className="flex items-center">
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-t-2xl border-b border-white/30">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  Locker Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Package className="w-4 h-4 text-orange-500" />
                          Name *
                        </Label>
                        <Input
                          id="name"
                          value={editedData.name}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl"
                          placeholder="e.g., Premium Locker A1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={editedData.location}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl"
                          placeholder="e.g., Main Lobby - Ground Floor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Palette className="w-4 h-4 text-orange-500" />
                          Door Color
                        </Label>
                        <div className="flex gap-2">
                          {[
                            { label: 'Orange', value: '#FF6B35' },
                            { label: 'Green', value: '#4C8115' },
                          ].map((colorOption) => (
                            <button
                              key={colorOption.value}
                              type="button"
                              onClick={() => handleInputChange({ target: { id: 'color', value: colorOption.value } })}
                              className={`w-10 h-10 rounded-xl border-2 ${
                                editedData.color === colorOption.value ? 'ring-2 ring-offset-2 ring-orange-500' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: colorOption.value }}
                              title={colorOption.label}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-orange-500" />
                          Size
                        </Label>
                        <Input
                          id="size"
                          value={editedData.size}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl"
                          placeholder="e.g., Large (40x30x60cm)"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-orange-500" />
                          Assigned Device
                        </Label>
                        <div className="flex gap-2">
                          <select
                            value={selectedDeviceIdForSave || ''}
                            onChange={(e) => handleDeviceChange(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                          >
                            <option value="">No device assigned</option>
                            {devices
                              .filter(device => device.status === null || device.status === true)
                              .map(device => (
                                <option key={device.id} value={device.id}>
                                   {device.model} 
                                </option>
                              ))
                            }
                          </select>
                          <Button
                            onClick={() => setIsDeviceModalOpen(true)}
                            variant="outline"
                            className="border-orange-300 hover:border-orange-500 text-orange-600 hover:text-orange-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Device
                          </Button>
                        </div>
                        {selectedDevice && (
                          <div className="mt-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Smartphone className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Selected Device Info:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-medium text-gray-600">ID:</span> {selectedDevice.device_id}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Model:</span> {selectedDevice.manufacturer} {selectedDevice.model}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Android:</span> {selectedDevice.android_version || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">App:</span> {selectedDevice.app_version || 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6 pt-4 border-t border-gray-200">
                      <ImageUpload
                        label="Picture URL"
                        value={editedData.picture_url}
                        onChange={(url) => setEditedData(prev => ({ ...prev, picture_url: url }))}
                        icon={Image}
                        placeholder="https://example.com/locker_image.jpg"
                        previewAlt="Locker Preview"
                      />
                      <ImageUpload
                        label="Damage Picture URL"
                        value={editedData.damage_picture_url}
                        onChange={(url) => setEditedData(prev => ({ ...prev, damage_picture_url: url }))}
                        icon={AlertTriangle}
                        placeholder="https://example.com/damage_image.jpg"
                        previewAlt="Damage Preview"
                        borderColor="border-red-300"
                        bgColor="bg-red-50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <dt className="text-sm font-semibold text-gray-500">Name</dt>
                          <dd className="text-base font-bold text-gray-900 mt-1">
                            {lockerData.name || <span className="italic text-gray-400 font-normal">Not specified</span>}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <dt className="text-sm font-semibold text-gray-500">Location</dt>
                          <dd className="text-base text-gray-900 mt-1">
                            {lockerData.location || <span className="italic text-gray-400">Not specified</span>}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Palette className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <dt className="text-sm font-semibold text-gray-500">Door Color</dt>
                          <dd className="text-base text-gray-900 mt-1 flex items-center gap-2">
                            {lockerData.color ? (
                              <>
                                <div 
                                  className="w-6 h-6 rounded-lg border-2 border-gray-300 shadow-sm"
                                  style={{ 
                                    backgroundColor: lockerData.color.startsWith('#') ? lockerData.color : undefined,
                                    background: lockerData.color.startsWith('#') ? lockerData.color : `linear-gradient(45deg, ${lockerData.color}, ${lockerData.color})`
                                  }}
                                />
                                {lockerData.color}
                              </>
                            ) : (
                              <span className="italic text-gray-400">Not specified</span>
                            )}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Ruler className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <dt className="text-sm font-semibold text-gray-500">Size</dt>
                          <dd className="text-base text-gray-900 mt-1">
                            {lockerData.size || <span className="italic text-gray-400">Not specified</span>}
                          </dd>
                        </div>
                      </div>
                    </div>
                    {selectedDevice && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Smartphone className="w-5 h-5 text-orange-500" />
                          <span className="text-lg font-semibold text-gray-800">Assigned Device</span>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-xl p-4 border border-orange-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Device ID:</span>
                              <div className="font-semibold text-gray-800">{selectedDevice.device_id}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Model:</span>
                              <div className="font-semibold text-gray-800">{selectedDevice.manufacturer} {selectedDevice.model}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Android Version:</span>
                              <div className="font-semibold text-gray-800">{selectedDevice.android_version || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">App Version:</span>
                              <div className="font-semibold text-gray-800">{selectedDevice.app_version || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-orange-300">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Status:</span>
                              <Badge className={`${selectedDevice.status === true ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                {selectedDevice.status === true ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Image className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-semibold text-gray-500">Locker Picture</span>
                          </div>
                          {lockerData.picture_url ? (
                            <div className="space-y-3">
                              <img 
                                src={lockerData.picture_url} 
                                alt="Locker" 
                                className="w-full h-48 object-cover border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" 
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Invalid+Image+URL';
                                }} 
                              />
                              <a 
                                href={lockerData.picture_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline"
                              >
                                <Image className="w-4 h-4" />
                                View Full Size
                              </a>
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">No picture provided</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-semibold text-gray-500">Damage Picture</span>
                          </div>
                          {lockerData.damage_picture_url ? (
                            <div className="space-y-3">
                              <img 
                                src={lockerData.damage_picture_url} 
                                alt="Damage" 
                                className="w-full h-48 object-cover border-2 border-red-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" 
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/400x300/fef2f2/ef4444?text=Invalid+Damage+URL';
                                }} 
                              />
                              <a 
                                href={lockerData.damage_picture_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
                              >
                                <AlertTriangle className="w-4 h-4" />
                                View Damage Details
                              </a>
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-dashed border-green-300 flex items-center justify-center">
                              <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <span className="text-sm text-green-600 font-medium">No damage reported</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-t-2xl border-b border-white/30">
                <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <Key className="h-4 w-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 justify-start"
                    onClick={() =>(
                      router.push(`/admin/locker-management/usage-history`)
                    )}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Usage History
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 justify-start"
                    onClick={() => {}}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 justify-start"
                    onClick={() => {}}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Set Maintenance
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 justify-start"
                    onClick={() => setIsDeviceModalOpen(true)}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Manage Device
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-t-2xl border-b border-white/30">
                <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
                  System Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Locker ID</span>
                    <span className="font-mono font-semibold text-gray-800 bg-white px-2 py-1 rounded border">
                      {lockerData.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Database Status</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Last Sync</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  {selectedDevice && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Device ID</span>
                      <span className="font-mono font-semibold text-gray-800 bg-white px-2 py-1 rounded border">
                        {selectedDevice.device_id}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-t-2xl border-b border-white/30">
                <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  Status & Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-600">Current Status</span>
                    {getStatusBadge(lockerData.status)}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</dt>
                        <dd className="text-sm text-gray-900 mt-1 font-medium">
                          {lockerData.client?.name ? (
                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg border border-orange-200">
                              {lockerData.client.name}
                            </span>
                          ) : (
                            <span className="italic text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                              Not assigned
                            </span>
                          )}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          {lockerData.created_at ? (
                            <div>
                              <div className="font-medium">
                                {new Date(lockerData.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(lockerData.created_at).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : 'N/A'}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RefreshCw className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          {lockerData.updated_at ? (
                            <div>
                              <div className="font-medium">
                                {new Date(lockerData.updated_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(lockerData.updated_at).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : 'N/A'}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {selectedDevice && (
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-gray-50 rounded-t-2xl border-b border-white/30">
                  <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    Device Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
                      <span className="text-sm font-semibold text-gray-600">Connection</span>
                      <Badge className={`${selectedDevice.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white border-0 flex items-center gap-1`}>
                        <div className={`w-2 h-2 rounded-full ${selectedDevice.status === 'active' ? 'bg-white' : 'bg-white'}`}></div>
                        {selectedDevice.status === 'active' ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal Strength:</span>
                        <span className="font-medium text-green-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onDeviceCreated={handleDeviceCreated}
        clients={clients}
        lockerClientId={lockerData?.client?.id}
      />
    </div>
  );
};

export default LockerInformationDetails;