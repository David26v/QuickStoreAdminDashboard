// app/client/lockers/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Make sure you have this
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import { useUser } from '@/components/providers/UserContext';
import DoorDetailDialog from './components/DoorDetailDialog';
import DoorGridView from './components/DoorGridView';
import LockerListView from './components/LockerListView';
import supabase from '@/lib/helper';


// Use the hook definitions exactly as they were in Pasted_Text_1754365141784.txt
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
            locker_number,
            status,
            door_count
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
            door_number,
            status,
            assigned_user_id,
            assigned_at,
            assigned_user:clients_users!locker_doors_assigned_user_id_fkey (
              full_name,
              email
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
    };
    fetchDoors();
  }, [lockerId]);

  return { doors, loading, error };
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
  const { doors, loading: doorsLoading, error: doorsError } = useLockerDoors(selectedLocker?.id);

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
    locker.locker_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    locker.id.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {currentView === 'lockers' ? '🏢 Your Lockers' : `🚪 Locker ${selectedLocker?.locker_number} - Doors`}
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
            // State passed as props
            lockers={filteredLockers}
            loading={lockersLoading}
            searchTerm={searchTerm}
            // Handlers passed as props
            onSelectLocker={handleSelectLocker}
            onSearchTermChange={setSearchTerm}
            onRequestNewLocker={() => { alert('Request New Locker clicked'); /* Implement request logic */ }}
          />
        ) : (
          <DoorGridView
            // State passed as props
            locker={selectedLocker}
            doors={doors}
            loading={doorsLoading}
            // Handlers passed as props
            onSelectDoor={handleSelectDoorForDetail}
            onBack={handleBackToLockers}
          />
        )}

        {/* Door Detail Dialog - Controlled by shadcn Dialog */}
        <DoorDetailDialog 
          isOpen={isDetailDialogOpen}
          door={selectedDoor}
          onClose={handleCloseDoorDetailDialog}
          onAssignLocker={(doorId) => { alert(`Assign Locker for door ${doorId}`); /* Implement assign logic */ }}
        />
      </div>
    </div>
  );
};

export default LockerDoorsClientPage;