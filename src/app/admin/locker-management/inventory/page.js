"use client";
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Smartphone,
  CheckCircle,
  XCircle,
  Package,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  Building2,
  AlertCircle,
  Grid3X3 ,
  Home ,
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import supabase from '@/lib/helper';
import AddLockerModal from './components/AddLockerModal';
import { getStatusColorDevice ,getStatusBgColorDevice ,getStatusLightColorDevice} from '@/lib/utils';
import { statusOptions } from './data/statusOption';


const LockerInventory = () => {
  const router = useRouter();

  const [lockers, setLockers] = useState([]);
  const [filteredLockers, setFilteredLockers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchLockers();
  }, []);

 const fetchLockers = async () => {
  setLoading(true);
  setError(null);
  try {
    const { data: lockersData, error: lockersError } = await supabase
      .from('lockers')
      .select(`
        id,
        name,
        status,
        client_id,
        released_at,
        created_at,
        updated_at,
        door_count,      
        client:clients (
          name,
          location,
          contact_person,
          email,
          phone
        )
      `);

    if (lockersError) throw lockersError;

    const { data: devicesData, error: devicesError } = await supabase
      .from('devices')
      .select(`
        id,
        device_id,
        manufacturer,
        model,
        android_version,
        locker_id 
      `);

    if (devicesError) throw devicesError;


    const formattedLockers = lockersData.map(locker => {
      const device = devicesData.find(dev => dev.locker_id === locker.id); 

      return {
        id: locker.id,
        locker_name: locker.name,
        status: locker.status,
        client_id: locker.client_id,
        assigned_at: locker.assigned_at,
        released_at: locker.released_at,
        created_at: locker.created_at,
        updated_at: locker.updated_at,
        door_count: locker.door_count,
        client_name: locker.client?.name || null,
        client_location: locker.client?.location || null,
        contact_person: locker.client?.contact_person || null, 
        email: locker.client?.email || null,
        phone: locker.client?.phone || null,
        device_id: device?.device_id || null,
        device_manufacturer: device?.manufacturer || null,
        device_model: device?.model || null,
        device_android_version: device?.android_version || null,
      };
    });

    setLockers(formattedLockers);
    console.log("Lockers fetched successfully:", formattedLockers);
    setFilteredLockers(formattedLockers);
  } 
  catch (error) {
    console.error("Error fetching lockers:", error);
    setError(error.message || "An error occurred while fetching locker data. Please try again.");
  } 
  finally {
    setLoading(false);
  }
};


  useEffect(() => {
    let result = lockers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(locker =>
        locker.name.toString().includes(term) ||
        (locker.device_manufacturer && locker.device_manufacturer.toLowerCase().includes(term)) ||
        (locker.device_model && locker.device_model.toLowerCase().includes(term)) ||
        (locker.client_name && locker.client_name.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(locker => locker.status === statusFilter);
    }

    // Apply client filter
    if (clientFilter !== 'all') {
      result = result.filter(locker => locker.client_name === clientFilter);
    }

    setFilteredLockers(result);
  }, [searchTerm, statusFilter, clientFilter, lockers]);



  const getStatusText = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || statusOptions.find(opt => opt.value === 'all');
    return option ? option.label : status;
  };

  

  const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : <Package className="w-5 h-5 text-gray-600" />;
  };



  const getDoorVisual = (status) => {
    switch (status) {
      case 'available':
        return { icon: <CheckCircle className="w-8 h-8 text-green-500" />, text: 'Ready' };
      case 'no_device_yet':
        return { icon: <XCircle className="w-8 h-8 text-purple-500" />, text: 'No Device' };
      case 'under_maintenance':
        return { icon: <Wrench className="w-8 h-8 text-yellow-500" />, text: 'Maintenance' };
      case 'onsite':
        return { icon: <Home className="w-8 h-8 text-indigo-500" />, text: 'Onsite' };
      case 'in_warehouse':
        return { icon: <Archive className="w-8 h-8 text-gray-500" />, text: 'Warehouse' };
      case 'arriving_to_client':
        return { icon: <Truck className="w-8 h-8 text-orange-500" />, text: 'In Transit' };
      case 'received_by_client':
        return { icon: <CheckCircle className="w-8 h-8 text-blue-500" />, text: 'Received' };
      default:
        return { icon: <Package className="w-8 h-8 text-gray-600" />, text: 'Unknown' };
    }
  };

  const isReadyForDispatch = (status) => {
    return status === 'available' || status === 'no_device_yet' || status === 'in_warehouse';
  };



  const handleAssignDevice = async (lockerId) => {

    alert(`Assign device flow for locker ${lockerId} - To be implemented`);
  };

  const handleUnassignDevice = async (lockerId) => {
    try {
      const { error } = await supabase
        .from('lockers') 
        .update({
          device_id: null, 
          status: true
        })
        .eq('id', lockerId);

      if (error) throw error;

      fetchLockers();
    } catch (error) {
      console.error("Error unassigning device:", error);
      alert("Failed to unassign device.");
    }
  };

  const handleViewDetails = (lockerId) => {
    router.push(`/admin/locker-management/inventory/${lockerId}`);
  };

  const handleAddLockerModalOpen = () => {
    setShowModal(true);
  }

  const HandleAddCLose = () => {
    setShowModal(false)
  }

  const handleRefresh = () => {
    fetchLockers();
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-700">Loading lockers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  const uniqueClients = [...new Set(lockers.map(l => l.client_name).filter(Boolean))];

  return (
    <div className="p-6 min-h-screen">


      {/* Modal */}
      <AddLockerModal
        isOpen={showModal}
        onClose={HandleAddCLose}
        onLockerAdded={fetchLockers}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Locker Inventory</h1>
        <p className="text-gray-600">Manage and view all lockers in the system.</p>
      </div>
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search lockers, devices, clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Client</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                      >
                        <option value="all">All Clients</option>
                        {uniqueClients.map(client => (
                          <option key={client} value={client}>{client}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <button
              onClick={handleAddLockerModalOpen} 
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Locker</span>
            </button>
            <button
              onClick={() => alert('Export functionality - To be implemented')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Refresh</span>
            </button>
          </div>
        </div>
      </div>
      {/* Locker Card Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLockers.length > 0 ? (
          filteredLockers.map((locker) => {
            const doorVisual = getDoorVisual(locker.status);
            const statusLightColor = getStatusLightColorDevice(locker.status);
            const readyForDispatch = isReadyForDispatch(locker.status);
            return (
              <div
                key={locker.id}
                className={`
                relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300
                ${getStatusBgColorDevice(locker.status)} hover:shadow-xl
                border-2 ${locker.status === 'available' ? 'border-green-200' :
                    locker.status === 'received_by_client' ? 'border-blue-200' :
                      locker.status === 'under_maintenance' ? 'border-yellow-200' :
                        locker.status === 'onsite' ? 'border-indigo-200' :
                          locker.status === 'in_warehouse' ? 'border-gray-200' :
                            locker.status === 'arriving_to_client' ? 'border-orange-200' :
                              locker.status === 'no_device_yet' ? 'border-purple-200' : 'border-gray-200'}
              `}
              >
                {/* Locker Header */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{locker.locker_name || 'No name'} </h3>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(locker.status)}
                        <span className={`ml-2 text-sm font-medium ${getStatusColorDevice(locker.status).split(' ')[1]}`}>
                          {getStatusText(locker.status)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => console.log(`Open menu for locker ${locker.id}`)}
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                {/* Locker Body - Visual Representation */}
                <div className="px-5 pb-4">
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-40 flex items-center justify-center shadow-inner">
                    <div className="absolute inset-4 flex flex-col">
                      <div className="flex-grow relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg border border-gray-600 shadow-md">
                        {/* Door Handle */}
                        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 w-1.5 h-8 bg-gray-600 rounded-full"></div>
                        {/* Status Indicator Light */}
                        <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${statusLightColor}`}></div>
                        {/* Door Content */}
                        <div className="flex flex-col items-center justify-center h-full p-2">
                          {doorVisual.icon}
                          <span className="mt-2 text-xs font-medium text-gray-300">
                            {doorVisual.text}
                          </span>
                        </div>
                      </div>
                      {/* Locker Base */}
                      <div className="h-3 bg-gradient-to-b from-gray-900 to-black rounded-b-lg mt-1"></div>
                    </div>
                  </div>
                </div>
                {/* Locker Footer - Information */}
                <div className="px-5 py-4 bg-white bg-opacity-70 border-t border-gray-200">
                  {/* Client Info */}
                  <div className="mb-3">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">Client:</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {locker.client_name ? locker.client_name : <span className="italic text-gray-500">None Assigned</span>}
                    </p>
                  </div>
                  
                  {/* --- New Door Count Info --- */}
                  <div className="mb-3">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Grid3X3 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">Doors:</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {locker.door_count || 'N/A'}
                    </p>
                  </div>
                  {/* --- End Door Count Info --- */}

                  {/* Device Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Smartphone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">Device:</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {locker.device_manufacturer && locker.device_model ? (
                        <>
                          {locker.device_manufacturer} {locker.device_model}
                          {locker.device_android_version && (
                            <span className="text-xs text-gray-600 block">Android {locker.device_android_version}</span>
                          )}
                        </>
                      ) : (
                        <span className="italic text-gray-500">No Device Installed</span>
                      )}
                    </p>
                  </div>
                  {/* Dispatch Status */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      {readyForDispatch ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                      )}
                      <span className="font-medium">Dispatch Ready:</span>
                    </div>
                    <p className={`text-sm font-medium ${readyForDispatch ? 'text-green-600' : 'text-red-600'}`}>
                      {readyForDispatch ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {locker.device_id ? (
                      <button
                        onClick={() => handleUnassignDevice(locker.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UnlinkIcon className="w-4 h-4" />
                        Unassign
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignDevice(locker.id)}
                        disabled={!readyForDispatch}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${readyForDispatch
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <LinkIcon className="w-4 h-4" />
                        Assign
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(locker.id)}
                      className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No lockers found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerInventory;
