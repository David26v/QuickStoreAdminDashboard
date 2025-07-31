// app/admin/locker-management/inventory/page.jsx
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
  Calendar,
  Clock,
  Eye,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  Edit3,
  Building2,
  Wrench,
  User,
  DoorOpen,
  DoorClosed,
  Truck,
  Home,
  Archive,
  HardHat // For Under Maintenance
} from 'lucide-react';

// --- Mock Data ---
// Assuming this data structure reflects the JOINs you'd get from the database
// e.g., SELECT l.*, c.name as client_name, d.manufacturer, d.model, d.android_version
// FROM lockers l LEFT JOIN clients c ON l.client_id = c.id LEFT JOIN devices d ON l.device_id = d.id;
const mockLockers = [
  {
    id: '1',
    locker_number: 101,
    status: 'received_by_client',
    client_id: 'client-1',
    device_id: 'device-1',
    assigned_at: '2023-10-27T10:00:00Z',
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-27T10:00:00Z',
    client_name: 'TechNova Solutions', // Derived from JOIN
    device_manufacturer: 'Samsung',    // Derived from JOIN
    device_model: 'Galaxy S22',       // Derived from JOIN
    device_android_version: '13',     // Derived from JOIN
    // Potentially add color here if it's a locker property
    // locker_color: '#4ade80' // Example
  },
  {
    id: '2',
    locker_number: 102,
    status: 'available',
    client_id: null,
    device_id: null,
    assigned_at: null,
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-26T09:00:00Z',
    client_name: null,
    device_manufacturer: null,
    device_model: null,
    device_android_version: null,
  },
  {
    id: '3',
    locker_number: 103,
    status: 'under_maintenance',
    client_id: 'client-2',
    device_id: null,
    assigned_at: null,
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-27T10:00:00Z',
    client_name: 'Global Logistics Inc.',
    device_manufacturer: null,
    device_model: null,
    device_android_version: null,
  },
  {
    id: '4',
    locker_number: 104,
    status: 'onsite',
    client_id: 'client-1',
    device_id: 'device-2',
    assigned_at: '2023-10-28T10:00:00Z',
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-28T10:00:00Z',
    client_name: 'TechNova Solutions',
    device_manufacturer: 'Google',
    device_model: 'Pixel 7',
    device_android_version: '14',
  },
  {
    id: '5',
    locker_number: 105,
    status: 'in_warehouse',
    client_id: 'client-3',
    device_id: null,
    assigned_at: null,
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-26T09:00:00Z',
    client_name: 'City Bank',
    device_manufacturer: null,
    device_model: null,
    device_android_version: null,
  },
  {
    id: '6',
    locker_number: 106,
    status: 'arriving_to_client',
    client_id: 'client-2',
    device_id: null,
    assigned_at: null,
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-26T09:00:00Z',
    client_name: 'Global Logistics Inc.',
    device_manufacturer: null,
    device_model: null,
    device_android_version: null,
  },
  {
    id: '7',
    locker_number: 107,
    status: 'no_device_yet',
    client_id: 'client-1',
    device_id: null,
    assigned_at: null,
    released_at: null,
    created_at: '2023-10-26T09:00:00Z',
    updated_at: '2023-10-26T09:00:00Z',
    client_name: 'TechNova Solutions',
    device_manufacturer: null,
    device_model: null,
    device_android_version: null,
  },
];

// --- Status Options ---
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'under_maintenance', label: 'Under Maintenance' },
  { value: 'no_device_yet', label: 'No Device Yet' },
  { value: 'available', label: 'Available' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'in_warehouse', label: 'In Warehouse' },
  { value: 'arriving_to_client', label: 'Arriving to Client' },
  { value: 'received_by_client', label: 'Received by Client' },
];

const LockerInventory = () => {
  const [lockers, setLockers] = useState(mockLockers);
  const [filteredLockers, setFilteredLockers] = useState(mockLockers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique clients for filter dropdown
  const uniqueClients = [...new Set(mockLockers.map(l => l.client_name).filter(Boolean))];

  useEffect(() => {
    let result = lockers;
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(locker =>
        locker.locker_number.toString().includes(term) ||
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

  // --- Status Helper Functions ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'received_by_client': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'onsite': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'in_warehouse': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'arriving_to_client': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_device_yet': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-50';
      case 'received_by_client': return 'bg-blue-50';
      case 'under_maintenance': return 'bg-yellow-50';
      case 'onsite': return 'bg-indigo-50';
      case 'in_warehouse': return 'bg-gray-50';
      case 'arriving_to_client': return 'bg-orange-50';
      case 'no_device_yet': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'received_by_client': return <Package className="w-5 h-5 text-blue-600" />;
      case 'under_maintenance': return <HardHat className="w-5 h-5 text-yellow-600" />;
      case 'onsite': return <Home className="w-5 h-5 text-indigo-600" />;
      case 'in_warehouse': return <Archive className="w-5 h-5 text-gray-600" />;
      case 'arriving_to_client': return <Truck className="w-5 h-5 text-orange-600" />;
      case 'no_device_yet': return <XCircle className="w-5 h-5 text-purple-600" />;
      default: return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'received_by_client': return 'Received by Client';
      case 'under_maintenance': return 'Under Maintenance';
      case 'onsite': return 'Onsite';
      case 'in_warehouse': return 'In Warehouse';
      case 'arriving_to_client': return 'Arriving to Client';
      case 'no_device_yet': return 'No Device Yet';
      default: return status;
    }
  };

  // Determine icon and text for the locker door visualization
  const getDoorVisual = (status) => {
    switch (status) {
      case 'available':
        return { icon: <DoorOpen className="w-10 h-10 text-green-400" />, text: 'OPEN' };
      case 'received_by_client':
        return { icon: <Package className="w-10 h-10 text-blue-400" />, text: 'IN USE' };
      case 'under_maintenance':
        return { icon: <Wrench className="w-10 h-10 text-yellow-400" />, text: 'REPAIR' };
      case 'onsite':
        return { icon: <Home className="w-10 h-10 text-indigo-400" />, text: 'ONSITE' };
      case 'in_warehouse':
        return { icon: <Archive className="w-10 h-10 text-gray-400" />, text: 'STOCK' };
      case 'arriving_to_client':
        return { icon: <Truck className="w-10 h-10 text-orange-400" />, text: 'TRANSIT' };
      case 'no_device_yet':
        return { icon: <XCircle className="w-10 h-10 text-purple-400" />, text: 'EMPTY' };
      default:
        return { icon: <XCircle className="w-10 h-10 text-gray-400" />, text: 'UNKNOWN' };
    }
  };

  // Determine status light color
  const getStatusLightColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500 animate-pulse';
      case 'received_by_client': return 'bg-blue-500';
      case 'under_maintenance': return 'bg-yellow-500';
      case 'onsite': return 'bg-indigo-500';
      case 'in_warehouse': return 'bg-gray-500';
      case 'arriving_to_client': return 'bg-orange-500';
      case 'no_device_yet': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Determine if locker is ready for dispatch based on status
  const isReadyForDispatch = (status) => {
    return status === 'available' || status === 'no_device_yet';
  };

  const handleAssignDevice = (lockerId) => {
    console.log(`Assign device to locker ${lockerId}`);
    // Implement device assignment logic here
  };

  const handleUnassignDevice = (lockerId) => {
    console.log(`Unassign device from locker ${lockerId}`);
    // Implement device unassignment logic here
  };

  const handleViewDetails = (lockerId) => {
    console.log(`View details for locker ${lockerId}`);
    // Implement view details logic here
  };

  return (
    <div className="p-6 min-h-screen">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Locker</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
            const statusLightColor = getStatusLightColor(locker.status);
            const readyForDispatch = isReadyForDispatch(locker.status);
            return (
              <div
                key={locker.id}
                className={`
                relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300
                ${getStatusBgColor(locker.status)} hover:shadow-xl
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
                      <h3 className="text-2xl font-bold text-gray-800">#{locker.locker_number}</h3>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(locker.status)}
                        <span className={`ml-2 text-sm font-medium ${getStatusColor(locker.status).split(' ')[1]}`}>
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
                       {/* Use a simple icon based on readiness */}
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
                    {locker.device_id ? ( // Use device_id to check if device is assigned
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
                        disabled={!readyForDispatch} // Disable if not ready
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          readyForDispatch
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
