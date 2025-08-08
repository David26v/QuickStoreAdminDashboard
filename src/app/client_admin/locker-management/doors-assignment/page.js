// app/client/lockers/page.js
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, ArrowLeft ,Edit3  } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import { useUser } from '@/components/providers/UserContext';
import DoorDetailDialog from './components/DoorDetailDialog';
import DoorGridView from './components/DoorGridView';
import LockerListView from './components/LockerListView';
import supabase from '@/lib/helper';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

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
          .select('id, name')
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
            name, 
            status,
            door_count
          `)
          .eq('client_id', clientId)
          .order('name', { ascending: true }); 
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

const fetchDoors = useCallback(async () => {
  if (!lockerId) {
    setDoors([]);
    setLoading(false);
    setError(null);
    return;
  }
  try {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('locker_doors')
      .select(`
        id,
        door_number,
        status,
        assigned_user_id,
        assigned_at,
        assigned_guest_id,
        assigned_user:clients_users!locker_doors_assigned_user_id_fkey (
          full_name,
          email
        ),
        assigned_guest:clients_guests!locker_doors_assigned_guest_id_fkey (
          full_name,
          email,
          phone
        )
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
}, [lockerId]);

  useEffect(() => {
    fetchDoors();
  }, [fetchDoors]);
  return { doors, loading, error, refetch: fetchDoors };
};

const LockerDoorsClientPage = () => {
  const { clientId, loading: userContextLoading } = useUser();
  const [currentView, setCurrentView] = useState('lockers');
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { clientInfo, loading: clientInfoLoading, error: clientInfoError } = useClientInfo(clientId);
  const { lockers, loading: lockersLoading, error: lockersError } = useClientLockers(clientId);
  const { doors, loading: doorsLoading, error: doorsError, refetch: refetchDoors } = useLockerDoors(selectedLocker?.id);
  const [editname, setEditName] = useState(false); 
  const [newLockerName, setNewLockerName] = useState('');

  if (userContextLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center ">
        <QuickStoreLoadingCompact message="Initializing..." />
      </div>
    );
  }
  if (!clientId) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center ">
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
  const errorMessage = clientInfoError || lockersError || doorsError;
  if (errorMessage) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center ">
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
          (currentView === 'lockers' ? "Loading Door Assign..." : "Loading locker doors...")} />
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

  const handleSelectLocker = (locker) => {
    setSelectedLocker(locker);
    setCurrentView('doors');
    setSearchTerm('');
  };

  const handleBackToLockers = () => {
    setCurrentView('lockers');
    setSelectedLocker(null);
    setSearchTerm('');
  };

  const handleSelectDoorForDetail = (door) => {
    setSelectedDoor(door);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDoorDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedDoor(null);
  };

  const filteredLockers = lockers.filter(locker =>
    locker.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    locker.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
 const handleSaveLockerName = async () => {
    try {
      if (!selectedLocker || !newLockerName.trim() || newLockerName.trim() === selectedLocker.name) {
        setEditName(false);
        return;
      }
      const { data, error } = await supabase
        .from('lockers')
        .update({ name: newLockerName.trim() }) 
        .eq('id', selectedLocker.id);

      if (error) throw error;


      setSelectedLocker(prev => ({ ...prev, name: newLockerName.trim() }));
      

      setEditName(false);
      
      fetchLockers()

    } catch (error) {
      console.error("Error updating locker name:", error);
      alert("Failed to update locker name. Please try again.");
    }
  };

const handleAssignLocker = async (doorId, assigneeData ,clientId) => {
  if (!doorId || !assigneeData || (!assigneeData.user && !assigneeData.guest_name)) {
    throw new Error('Invalid assignment data provided (missing door ID or assignee data).');
  }
  try {
    let updateData = {
      status: 'occupied',
      assigned_at: new Date().toISOString(),
      assigned_user_id: null,
      assigned_guest_id: null,
    };
    if (assigneeData.type === 'user' && assigneeData.user?.id) {
      updateData.assigned_user_id = assigneeData.user.id
    }
    else if (assigneeData.type === 'guest' && assigneeData.guest_name) {
      let guestId = null;
      const { data: existingGuest, error: findError } = await supabase
        .from('clients_guests')
        .select('id')
        .eq('client_id', clientId)
        .eq('full_name', assigneeData.guest_name)
        .maybeSingle();
      if (findError) {
        console.error("Error finding guest:", findError);
        throw new Error(`Error checking for existing guest: ${findError.message}`);
      }
      if (existingGuest) {
        guestId = existingGuest.id;
      }
      else {
        const { data: newGuest, error: guestError } = await supabase
          .from('clients_guests')
          .insert({
            client_id: clientId,
            full_name: assigneeData.guest_name,
            phone: assigneeData.guest_phone || null,
          })
          .select()
          .single();
        if (guestError) throw new Error(`Failed to create guest: ${guestError.message}`);
        guestId = newGuest.id;
      }
      updateData.assigned_guest_id = guestId;
    }
    else {
      throw new Error('Invalid assignee data structure.');
    }
    const { data, error } = await supabase
      .from('locker_doors')
      .update(updateData)
      .eq('id', doorId);
    if (error) throw error;
    await refetchDoors();
  }
  catch (error) {
    console.error('Error assigning locker door:', error);
    throw error;
  }
};

const handleUnassignLocker = async (doorId) => {
  if (!doorId) {
    throw new Error('Door ID is required for unassignment.');
  }
  try {
    const { data, error } = await supabase
      .from('locker_doors')
      .update({
        status: 'available',
        assigned_user_id: null,
        assigned_guest_id: null,
        assigned_at: null,
        guest_name: null,
        guest_phone: null
      })
      .eq('id', doorId);
    if (error) throw error;
    await refetchDoors();
  } catch (error) {
    console.error('Error unassigning locker door:', error);
    throw error;
  }
};

  return (  
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
    <AnimatedBackground/>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
               {currentView === 'lockers' ? '🏢 My Lockers' : 
                editname ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={newLockerName}
                      onChange={(e) => setNewLockerName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveLockerName();
                        } else if (e.key === 'Escape') {
                          setEditName(false);
                          setNewLockerName(selectedLocker?.name || '');
                        }
                      }}
                      onBlur={handleSaveLockerName} 
                      className="text-2xl md:text-3xl font-bold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent pb-1"
                      autoFocus
                    />
                    <Button
                      onClick={handleSaveLockerName}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-auto"
                    >
                      <span className="text-xs text-green-600">Save</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 group">
                    <span>{selectedLocker?.name} - Doors</span>
                    <button
                      onClick={() => {
                        setEditName(true);
                        setNewLockerName(selectedLocker?.name || '');
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-200"
                      aria-label="Edit locker name"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )
              }
            </h1>
            <p className="text-slate-600 text-base md:text-lg mt-2">
              {currentView === 'lockers'
                ? `Secure storage solutions for ${clientInfo.name}`
                : 'Click on any door to view details.'}
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
        {currentView === 'lockers' ? (
          <LockerListView
            lockers={filteredLockers}
            loading={lockersLoading}
            searchTerm={searchTerm}
            onSelectLocker={handleSelectLocker}
            onSearchTermChange={setSearchTerm}
            onRequestNewLocker={() => { alert('Request New Locker clicked'); }}
          />
        ) : (
          <DoorGridView
            locker={selectedLocker}
            doors={doors}
            loading={doorsLoading}
            onSelectDoor={handleSelectDoorForDetail}
            onBack={handleBackToLockers}
          />
        )}
        <DoorDetailDialog
          isOpen={isDetailDialogOpen}
          door={selectedDoor}
          onClose={handleCloseDoorDetailDialog}
          onAssignLocker={handleAssignLocker}
          onUnassignLocker={handleUnassignLocker}
          clientId={clientId}
        />
      </div>
    </div>
  );
};

export default LockerDoorsClientPage;
