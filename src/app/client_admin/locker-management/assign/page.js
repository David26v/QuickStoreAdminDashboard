"use client";
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Lock,
  User,
  Clock,
  Calendar,
  Search,
  X,
  AlertCircle,
  ArrowLeft,
  Key,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import { formatDistanceToNow, format } from 'date-fns';
import supabase from '@/lib/helper';
import { useUser } from '@/components/providers/UserContext';

// --- Data Fetching Hooks ---
const useClientInfo = (clientId) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();
        if (clientError) throw clientError;
        if (!clientData) {
          throw new Error("Client not found.");
        }
        setClientInfo(clientData);
      } catch (err) {
        console.error("Error fetching client info:", err);
        setError(err.message || "Failed to load client information.");
      } finally {
        setLoading(false);
      }
    };
    fetchClientInfo();
  }, [clientId]);
  return { clientInfo, loading, error };
};

const useClientLockers = (clientId) => {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLockers = async () => {
      if (!clientId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('lockers')
          .select(`
            id,
            locker_number,
            status,
            door_count,
            client_id
          `)
          .eq('client_id', clientId)
          .order('locker_number', { ascending: true });
        if (error) throw error;
        setLockers(data || []);
      } catch (err) {
        console.error("Error fetching client lockers:", err);
        setError(err.message || "Failed to load lockers.");
      } finally {
        setLoading(false);
      }
    };
    fetchLockers();
  }, [clientId]);
  return { lockers, loading, error };
};

const useLockerDoors = (lockerId) => {
  const [doors, setDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDoors = async () => {
      if (!lockerId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locker_doors')
          .select(`
            id,
            locker_id,
            door_number,
            status,
            assigned_user_id,
            assigned_at,
            client_id,
            assigned_user:clients_users!locker_doors_assigned_user_id_fkey (full_name, email)
          `)
          .eq('locker_id', lockerId)
          .order('door_number', { ascending: true });
        if (error) throw error;
        setDoors(data || []);
      } catch (err) {
        console.error("Error fetching locker doors:", err);
        setError(err.message || "Failed to load locker doors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoors();
  }, [lockerId]);
  return { doors, loading, error };
};
// --- End Data Fetching Hooks ---

// --- Main Component ---
const LockerDoorsClient = () => {
  // --- ALL HOOKS MUST BE AT THE TOP LEVEL ---
  // 1. useContext
  const { clientId, loading: userContextLoading } = useUser();
  // 2. useState hooks - MOVED HERE to ensure consistent order
  const [currentView, setCurrentView] = useState('lockers');
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  // 3. Custom hooks that use internal useState/useEffect - MOVED HERE
  const { clientInfo, loading: clientInfoLoading, error: clientInfoError } = useClientInfo(clientId);
  const { lockers, loading: lockersLoading, error: lockersError } = useClientLockers(clientId);
  const { doors, loading: doorsLoading, error: doorsError } = useLockerDoors(selectedLocker?.id);
  // --- END OF HOOK DECLARATIONS ---

  // --- CONDITIONAL RENDERING LOGIC CAN NOW SAFELY FOLLOW ---
  // Show loading while UserContext is initializing
  if (userContextLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <QuickStoreLoadingCompact message="Initializing..." />
      </div>
    );
  }
  // Show error if clientId is not available after context is loaded
  if (!clientId) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
            <p className="text-gray-600">Client ID not found. Please ensure you are logged in as a client administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Handle potential errors from data fetching hooks
  const errorMessage = clientInfoError || lockersError || doorsError;
  if (errorMessage) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Determine overall loading state
  let isLoading = clientInfoLoading;
  if (!clientInfoLoading && currentView === 'lockers') {
    isLoading = lockersLoading;
  }
  if (!clientInfoLoading && currentView === 'doors') {
    isLoading = doorsLoading;
  }
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <QuickStoreLoadingCompact message={clientInfoLoading ? "Loading client info..." :
          (currentView === 'lockers' ? "Loading your lockers..." : "Loading locker doors...")} />
      </div>
    );
  }
  if (!clientInfo) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Client Not Found</h3>
            <p className="text-gray-600">Unable to find information for your client account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // --- Event Handlers ---
  const handleSelectLocker = (locker) => {
    setSelectedLocker(locker);
    setCurrentView('doors');
  };
  const handleBackToLockers = () => {
    setCurrentView('lockers');
    setSelectedLocker(null);
  };
  const handleSelectDoor = (door) => {
    if (door.status !== 'available' && door.assigned_user) {
      setSelectedDoor(door);
    }
  };
  const handleCloseDoorDetail = () => {
    setSelectedDoor(null);
  };
  // --- Main Render ---
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {currentView === 'lockers' ? '🏢 Your Lockers' : `🚪 Locker ${selectedLocker?.locker_number} - Doors`}
            </h1>
            <p className="text-slate-600 text-base md:text-lg mt-2">
              {currentView === 'lockers'
                ? `Secure storage solutions for ${clientInfo.name}`
                : 'Click on an occupied door to view details and user information.'}
            </p>
          </div>
          {currentView === 'doors' && (
            <Button
              onClick={handleBackToLockers}
              variant="outline"
              className="flex items-center space-x-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lockers</span>
            </Button>
          )}
        </div>
        {/* Content Area */}
        {currentView === 'lockers' ? (
          <LockerListView
            lockers={lockers}
            onSelectLocker={handleSelectLocker}
            loading={lockersLoading}
          />
        ) : (
          <DoorGridView
            locker={selectedLocker}
            doors={doors}
            onSelectDoor={handleSelectDoor}
            loading={doorsLoading}
          />
        )}
        {/* Door Detail Modal */}
        {selectedDoor && (
          <DoorDetailModal door={selectedDoor} onClose={handleCloseDoorDetail} />
        )}
      </div>
    </div>
  );
};

const LockerListView = ({ lockers, onSelectLocker, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
        <QuickStoreLoadingCompact message="Loading lockers..." />
      </div>
    );
  }
  if (lockers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-3">No Lockers Assigned</h3>
        <p className="text-slate-500">You don't have any lockers assigned to your client account yet.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lockers.map((locker) => (
        <div
          key={locker.id}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden cursor-pointer"
          onClick={() => onSelectLocker(locker)}
        >
          {/* Locker Header with 3D effect */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Locker #{locker.locker_number}</h3>
                  <p className="text-slate-300 text-sm">Secure Storage Unit</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          {/* Locker Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 font-medium">Total Doors</span>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full">
                <span className="text-blue-800 font-bold">{locker.door_count}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-600">Status: </span>
              <span className="text-sm font-semibold text-green-600 capitalize">{locker.status}</span>
            </div>
            <button
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
            >
              <span>View All Doors</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const DoorGridView = ({ locker, doors, onSelectDoor, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
        <QuickStoreLoadingCompact message={`Loading doors for Locker ${locker?.locker_number}...`} />
      </div>
    );
  }
  if (!locker || doors.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-slate-700 mb-3">No Doors Found</h3>
        <p className="text-slate-500">Unable to load doors for this locker.</p>
      </div>
    );
  }
  const gridColsClass = locker.door_count <= 6 ? 'grid-cols-2 md:grid-cols-3' :
    locker.door_count <= 12 ? 'grid-cols-3 md:grid-cols-4' :
      'grid-cols-4 md:grid-cols-6';
  const availableCount = doors.filter(d => d.status === 'available').length;
  const occupiedCount = doors.filter(d => d.status === 'occupied').length;
  const overdueCount = doors.filter(d => d.status === 'overdue').length;
  return (
    <div>
      {/* Stats Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Door Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-700">{availableCount}</div>
            <div className="text-sm text-green-600">Available</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{occupiedCount}</div>
            <div className="text-sm text-blue-600">Occupied</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-red-700">{overdueCount}</div>
            <div className="text-sm text-red-600">Overdue</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
            <div className="w-8 h-8 bg-slate-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-700">{locker.door_count}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
        </div>
      </div>
      {/* Door Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Door Layout</h3>
        <div className={`grid ${gridColsClass} gap-4`}>
          {doors
            .sort((a, b) => a.door_number - b.door_number)
            .map((door) => (
              <DoorCard key={door.id} door={door} onClick={() => onSelectDoor(door)} />
            ))}
        </div>
      </div>
    </div>
  );
};

const DoorCard = ({ door, onClick }) => {
  let doorColor = "from-slate-100 to-slate-200";
  let doorBorder = "border-slate-300";
  let handleColor = "bg-slate-400";
  let statusColor = "text-slate-600";
  let statusBg = "bg-slate-100";
  let cursorClass = "cursor-default";
  let glowEffect = "";
  if (door.status === 'occupied') {
    doorColor = "from-blue-100 to-blue-200";
    doorBorder = "border-blue-300";
    handleColor = "bg-blue-500";
    statusColor = "text-blue-700";
    statusBg = "bg-blue-100";
    cursorClass = "cursor-pointer hover:shadow-lg";
    glowEffect = "hover:shadow-blue-200";
  } else if (door.status === 'overdue') {
    doorColor = "from-red-100 to-red-200";
    doorBorder = "border-red-300";
    handleColor = "bg-red-500";
    statusColor = "text-red-700";
    statusBg = "bg-red-100";
    cursorClass = "cursor-pointer hover:shadow-lg";
    glowEffect = "hover:shadow-red-200";
  } else if (door.status === 'available') {
    doorColor = "from-green-50 to-green-100";
    doorBorder = "border-green-200";
    handleColor = "bg-green-400";
    statusColor = "text-green-700";
    statusBg = "bg-green-100";
  }
  return (
    <div
      onClick={door.status !== 'available' && door.assigned_user ? onClick : undefined}
      className={`relative ${cursorClass} transition-all duration-300 ${glowEffect}`}
    >
      {/* Door Frame */}
      <div className={`relative bg-gradient-to-br ${doorColor} border-2 ${doorBorder} rounded-lg p-4 h-32 flex flex-col justify-between shadow-md transition-all duration-300`}>
        {/* Door Handle */}
        <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 ${handleColor} rounded-full shadow-inner`}>
          <div className="w-1 h-4 bg-white bg-opacity-30 rounded-full ml-1 mt-1"></div>
        </div>
        {/* Door Number */}
        <div className="text-center">
          <div className={`inline-block px-2 py-1 ${statusBg} rounded-md mb-2`}>
            <span className={`text-sm font-bold ${statusColor}`}>#{door.door_number}</span>
          </div>
        </div>
        {/* Door Status */}
        <div className="text-center">
          <div className={`inline-block px-2 py-1 ${statusBg} rounded-full text-xs font-semibold ${statusColor}`}>
            {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
          </div>
          {/* Duration for occupied/overdue doors */}
          {(door.status === 'occupied' || door.status === 'overdue') && door.assigned_at && (
            <div className="mt-1 flex items-center justify-center text-xs text-slate-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDistanceToNow(new Date(door.assigned_at))}</span>
            </div>
          )}
        </div>
        {/* Door Panel Lines for realism */}
        <div className="absolute inset-2 border border-opacity-20 border-slate-400 rounded-md pointer-events-none">
          <div className="absolute top-1/3 left-1 right-3 h-px bg-slate-300 bg-opacity-50"></div>
          <div className="absolute bottom-1/3 left-1 right-3 h-px bg-slate-300 bg-opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

// --- FIXED & COMPLETED DoorDetailModal ---
const DoorDetailModal = ({ door, onClose }) => {
  if (!door) return null;
  const assignedUser = door.assigned_user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                door.status === 'available' ? 'bg-green-500' :
                door.status === 'occupied' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Door #{door.door_number}</h3>
                <p className="text-slate-300 text-sm">Detailed Information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Status Badge */}
          <div className="text-center mb-6">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              door.status === 'available' ? 'bg-green-100 text-green-700' :
              door.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
            }`}>
              {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
            </div>
          </div>

          {door.status === 'available' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-slate-600 text-lg">This door is currently available for use.</p>
            </div>
          ) : (
            <>
              {assignedUser ? (
                <div className="space-y-6">
                  {/* User Information */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-5">
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">ASSIGNED USER</h5>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{assignedUser.full_name}</p>
                        <p className="text-slate-600">{assignedUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5">
                      <h5 className="text-xs font-bold text-blue-600 uppercase mb-3 tracking-wider">ASSIGNED DATE</h5>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-800 font-medium">
                          {door.assigned_at ? format(new Date(door.assigned_at), 'PP') : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-5">
                      <h5 className="text-xs font-bold text-orange-600 uppercase mb-3 tracking-wider">DURATION</h5>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="text-slate-800 font-medium">
                          {door.assigned_at ? formatDistanceToNow(new Date(door.assigned_at)) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg">Assigned user information is not available.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END FIXED & COMPLETED DoorDetailModal ---

export default LockerDoorsClient;