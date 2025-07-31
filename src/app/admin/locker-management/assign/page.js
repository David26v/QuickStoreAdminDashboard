// app/admin/locker-management/doors/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Package, // For Occupied
  RefreshCw,
  ChevronDown,
  Wrench, // For Maintenance (if needed as a filter)
  ArrowLeft,
  Zap,
  DoorOpen, // Potentially for Available
  DoorClosed, // Potentially for Occupied
  Clock // For Overdue
} from 'lucide-react';

// --- Import or Define mockLockers (Ensure it matches your data structure) ---
// Option 1: Import from LockerInventory if exported
// import { mockLockers } from '../inventory/page';

// Option 2: Define directly or import from a shared mock file
const mockLockers = [
  {
    id: '1',
    locker_number: 101,
    status: 'received_by_client',
    client_id: 'client-1',
    device_id: 'device-1',
    devices: { id: 'device-1', device_id: 'CTRL_12345', manufacturer: 'LockerTech', model: 'SmartHub Pro', android_version: '12' },
    clients: { id: 'client-1', name: 'TechNova Solutions' }
  },
  {
    id: '2',
    locker_number: 102,
    status: 'available',
    client_id: null,
    device_id: 'device-2',
    devices: { id: 'device-2', device_id: 'CTRL_67890', manufacturer: 'LockerTech', model: 'SmartHub Lite', android_version: '11' },
    clients: null
  },
  {
    id: '3',
    locker_number: 103,
    status: 'under_maintenance',
    client_id: 'client-2',
    device_id: 'device-3',
    devices: { id: 'device-3', device_id: 'CTRL_ABCD1', manufacturer: 'SecureLock', model: 'SL-500', android_version: '13' },
    clients: { id: 'client-2', name: 'Global Logistics Inc.' }
  },
  // Add more lockers as needed
];

// --- Door Status Definitions ---
const DOOR_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'overdue', label: 'Overdue' },
  // { value: 'under_maintenance', label: 'Under Maintenance' } // Optional: if individual doors can be maintained
];

// --- Door Status Helper Functions ---
const getDoorStatusConfig = (status) => {
  switch (status) {
    case 'available':
      return {
        colorClasses: 'bg-green-100 text-green-800 border-green-200',
        icon: <DoorOpen className="w-5 h-5 text-green-600" />,
        text: 'Available'
      };
    case 'occupied':
      return {
        colorClasses: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Package className="w-5 h-5 text-blue-600" />, // Using Package for Occupied
        text: 'Occupied'
      };
    case 'overdue':
      return {
        colorClasses: 'bg-red-100 text-red-800 border-red-200',
        icon: <Clock className="w-5 h-5 text-red-600" />,
        text: 'Overdue'
      };
    // case 'under_maintenance': // Optional
    //   return {
    //     colorClasses: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    //     icon: <Wrench className="w-5 h-5 text-yellow-600" />,
    //     text: 'Maintenance'
    //   };
    default:
      return {
        colorClasses: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <XCircle className="w-5 h-5 text-gray-600" />,
        text: status
      };
  }
};

const getDoorVisual = (status) => {
  switch (status) {
    case 'available':
      return <DoorOpen className="w-8 h-8 text-green-500" />;
    case 'occupied':
      return <DoorClosed className="w-8 h-8 text-blue-500" />; // Or Package
    case 'overdue':
      return <Clock className="w-8 h-8 text-red-500" />;
    // case 'under_maintenance': // Optional
    //   return <Wrench className="w-8 h-8 text-yellow-500" />;
    default:
      return <XCircle className="w-8 h-8 text-gray-500" />;
  }
};

// --- Mock Dynamic Door Data ---
// In a real app, this would be fetched based on the selected locker's ID
// e.g., fetch(`/api/locker-doors?lockerId=${selectedLockerId}`)
const generateMockDoors = (lockerId, numDoors, voltage) => {
  // Simple mock data generation logic
  const statuses = ['available', 'occupied', 'overdue']; // , 'under_maintenance'
  return Array.from({ length: numDoors }, (_, i) => {
    const doorNumber = i + 1;
    // Assign a status, making some overdue/occupied for demo
    let status;
    if (doorNumber % 7 === 0) {
      status = 'overdue';
    } else if (doorNumber % 4 === 0) {
      status = 'occupied';
    } else {
      status = 'available';
    }
    // if (doorNumber === 5) status = 'under_maintenance'; // Example maintenance

    return {
      id: `d${lockerId.split('-').pop()}-${doorNumber}`, // e.g., d1-1, d1-2
      locker_id: lockerId,
      door_number: doorNumber,
      status: status,
      voltage: voltage,
      // client_id, assigned_user_id, etc. could be added based on status
    };
  });
};

const mockDoorsByLockerId = {
  '1': generateMockDoors('1', 24, '24V'), // Locker 101: 24 doors, 24V
  '2': generateMockDoors('2', 12, '12V'), // Locker 102: 12 doors, 12V
  '3': generateMockDoors('3', 18, '24V'), // Locker 103: 18 doors, 24V
  // Add entries for other lockers as needed
};

const LockerDoorsManagement = () => {
  // --- State ---
  const [lockers] = useState(mockLockers);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [lockerDoors, setLockerDoors] = useState([]);
  const [filteredDoors, setFilteredDoors] = useState([]);
  const [doorSearchTerm, setDoorSearchTerm] = useState('');
  const [doorStatusFilter, setDoorStatusFilter] = useState('all');
  const [isDoorFilterOpen, setIsDoorFilterOpen] = useState(false);
  const [selectedDoors, setSelectedDoors] = useState([]); // For potential bulk actions

  // --- Fetch Doors when Locker is Selected ---
  useEffect(() => {
    if (selectedLocker) {
      // In a real app, fetch doors based on selectedLocker.id
      // e.g., fetch(`/api/locker-doors?lockerId=${selectedLocker.id}`)
      const doorsForSelectedLocker = mockDoorsByLockerId[selectedLocker.id] || [];
      setLockerDoors(doorsForSelectedLocker);
      setFilteredDoors(doorsForSelectedLocker);
      setDoorSearchTerm('');
      setDoorStatusFilter('all');
      setSelectedDoors([]);
    } else {
      setLockerDoors([]);
      setFilteredDoors([]);
      setSelectedDoors([]);
    }
  }, [selectedLocker]);

  // --- Apply Filters to Doors ---
  useEffect(() => {
    let result = lockerDoors;
    if (doorSearchTerm) {
      const term = doorSearchTerm.toLowerCase();
      result = result.filter(door =>
        door.door_number.toString().includes(term) ||
        door.voltage?.toLowerCase().includes(term) ||
        door.status.toLowerCase().includes(term)
      );
    }
    if (doorStatusFilter !== 'all') {
      result = result.filter(door => door.status === doorStatusFilter);
    }
    setFilteredDoors(result);
  }, [doorSearchTerm, doorStatusFilter, lockerDoors]);

  // --- Handler Functions ---
  const handleSelectLocker = (locker) => {
    setSelectedLocker(locker);
  };

  const handleBackToLockers = () => {
    setSelectedLocker(null);
  };

  const handleDoorSelect = (doorId) => {
    // Example: Toggle selection for bulk actions (currently just visual)
    setSelectedDoors(prev =>
      prev.includes(doorId)
        ? prev.filter(id => id !== doorId)
        : [...prev, doorId]
    );
  };

  // Placeholder for potential actions
  const handleBulkAction = (actionType) => {
    console.log(`Performing ${actionType} on doors:`, selectedDoors);
    alert(`Bulk action '${actionType}' triggered for ${selectedDoors.length} doors.`);
  };

  // --- Render ---
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {!selectedLocker ? (
        // --- Step 1: Locker Selection View ---
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Locker Doors</h1>
            <p className="text-gray-600">Select a locker to view and manage its individual doors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {lockers.map((locker) => (
              <div
                key={locker.id}
                onClick={() => handleSelectLocker(locker)}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md hover:border-orange-300 cursor-pointer transition-all duration-200 flex items-start"
              >
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">Locker #{locker.locker_number}</h3>
                  <p className="text-sm text-gray-600 truncate">{locker.clients?.name || 'No Client Assigned'}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {locker.devices ? `${locker.devices.manufacturer} ${locker.devices.model}` : 'No Device'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // --- Step 2: Door Grid View for Selected Locker ---
        <>
          {/* Back Button and Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToLockers}
              className="flex items-center text-orange-600 hover:text-orange-800 mb-3 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </button>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Doors for Locker #{selectedLocker.locker_number}</h1>
                  <p className="text-gray-600">
                    Controller: {selectedLocker.devices ? `${selectedLocker.devices.manufacturer} ${selectedLocker.devices.model}` : 'N/A'} |
                    Client: {selectedLocker.clients?.name || 'N/A'}
                  </p>
                </div>
                {/* Optional: Display selected doors count or bulk actions */}
                {selectedDoors.length > 0 && (
                  <div className="bg-orange-50 text-orange-800 px-3 py-1.5 rounded-full text-sm font-medium">
                    {selectedDoors.length} door{selectedDoors.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Door Controls (Search, Filter) */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doors (number, voltage, status)..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  value={doorSearchTerm}
                  onChange={(e) => setDoorSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsDoorFilterOpen(!isDoorFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Filter</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDoorFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDoorFilterOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Door Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                        value={doorStatusFilter}
                        onChange={(e) => setDoorStatusFilter(e.target.value)}
                      >
                        {DOOR_STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Door Grid */}
          {filteredDoors.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3">
              {filteredDoors.map((door) => {
                const statusConfig = getDoorStatusConfig(door.status);
                const isSelected = selectedDoors.includes(door.id);
                return (
                  <div
                    key={door.id}
                    onClick={() => handleDoorSelect(door.id)}
                    className={`
                      relative rounded-lg shadow-sm overflow-hidden transition-all duration-200 cursor-pointer
                      border-2 ${isSelected ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50' : 'border-gray-200 bg-white hover:shadow-md'}
                    `}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-orange-500 border border-orange-500 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    {/* Door Content */}
                    <div className="p-3 flex flex-col items-center">
                      <div className="mb-2">
                        {getDoorVisual(door.status)}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Door {door.door_number}</h3>
                      <div className="flex items-center text-xs">
                        {statusConfig.icon}
                        <span className={`ml-1.5 font-medium ${statusConfig.colorClasses.split(' ')[1]}`}>
                          {statusConfig.text}
                        </span>
                      </div>
                      {door.voltage && (
                        <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-2">
                          <Zap className="w-3 h-3 mr-1 text-orange-500" />
                          <span>{door.voltage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <DoorClosed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doors Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No doors match your current search or filter criteria for Locker #{selectedLocker.locker_number}.
              </p>
              <button
                onClick={() => { setDoorSearchTerm(''); setDoorStatusFilter('all'); }}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LockerDoorsManagement;