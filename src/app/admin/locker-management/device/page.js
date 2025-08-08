
'use client';

import React, { useState, useEffect } from 'react';


import { Button } from '@/components/ui/button';
import { AlertCircle, Smartphone, RefreshCw, Search, Filter, Plus } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import supabase from '@/lib/helper';
import DeviceList from './components/DeviceList';
import DeviceModal from './components/DeviceModal';


const DevicesManagement = () => {
  const [devices, setDevices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAPK, setIsFetchingAPK] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    manufacturer: '',
    model: '',
    android_version: '',
    firmware_version: '',
    app_version: '',
  });

  useEffect(() => {
    fetchDevices();
    fetchClients();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('devices')
        .select(`
          id,
          device_id,
          manufacturer,
          model,
          android_version,
          firmware_version,
          app_version,
          created_at,
          status
        `);
      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name');
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleImageUpload = (event, setFormData) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const { data: { text } } = await Tesseract.recognize(reader.result, 'eng');
      console.log('Extracted text:', text);

      const manufacturer = text.match(/Samsung|Huawei|Xiaomi|Realme|Oppo/i)?.[0] || '';
      const model = text.match(/Tab A8|A10|Note\s?\d+|Pixel\s?\w*/i)?.[0] || '';
      const android_version = text.match(/Android\s?(\d+(\.\d+)?)/i)?.[1] || '';
      const app_version = text.match(/App\s?Version[:\s]?(\d+\.\d+(\.\d+)?)/i)?.[1] || '';

      setFormData(prev => ({
        ...prev,
        manufacturer,
        model,
        android_version,
        app_version
      }));
    } catch (error) {
      console.error('OCR failed:', error);
    }
  };
  reader.readAsDataURL(file);
};

  const fetchAPKData = async () => {
    setIsFetchingAPK(true);
    try {
      // Simulate fetching APK data
      await new Promise(resolve => setTimeout(resolve, 2000));
      const apkData = {
        manufacturer: 'Samsung',
        model: 'Galaxy Tab A8',
        android_version: '12.0',
        app_version: '1.0.3'
      };
      setFormData(prev => ({
        ...prev,
        ...apkData
      }));
    } catch (err) {
      console.error("Error fetching APK data:", err);
    } finally {
      setIsFetchingAPK(false);
    }
  };

  const handleSubmit = async () => {
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
        status: true
      });
      setIsModalOpen(false);
      // Refresh devices list
      fetchDevices();
    } catch (err) {
      console.error("Error creating device:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.clients?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error && !isModalOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6">
        <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Devices</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-gray-600 bg-clip-text text-transparent">
                Device Management
              </h1>
              <p className="text-gray-600">Manage your QuickStore locker devices and installations.</p>
            </div>
          </div>
          {/* Controls */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={fetchDevices}
                  variant="outline"
                  className="border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Grid/List - Using the new DeviceList component */}
        <DeviceList
          devices={devices}
          loading={loading}
          filteredDevices={filteredDevices}
          onDetailsClick={(device) => console.log("Details clicked for:", device)} // Implement logic
          onActionsClick={(device) => console.log("Actions clicked for:", device)} // Implement logic
        />

        {/* Modal - Using the new DeviceModal component */}
        <DeviceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          clients={clients}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          isFetchingAPK={isFetchingAPK}
          fetchAPKData={fetchAPKData}
          handleImageUpload={handleImageUpload}           
          setIsFetchingAPK={setIsFetchingAPK}             
        />

      </div>
    </div>
  );
};

export default DevicesManagement;