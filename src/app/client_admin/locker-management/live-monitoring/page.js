// app/components/ClientLockerDashboardData.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLockerDashboardUI from './components/ClientLockerDashboardUi';

// --- Mock Supabase functions (same as in your original file) ---
const mockSupabase = {
  from: (table) => ({
    select: (fields) => ({
      eq: (column, value) => {
        if (table === 'lockers') {
          return Promise.resolve({
            data: [
              { id: 1, locker_number: 'LOC001', status: 'active', door_count: 12, location: 'Ground Floor - East Wing', created_at: '2024-01-15T10:00:00Z' },
              { id: 2, locker_number: 'LOC002', status: 'active', door_count: 24, location: 'Second Floor - Central', created_at: '2024-01-20T14:30:00Z' },
              { id: 3, locker_number: 'LOC003', status: 'maintenance', door_count: 16, location: 'Ground Floor - West Wing', created_at: '2024-02-01T09:15:00Z' }
            ],
            error: null
          });
        } else if (table === 'locker_doors') {
          const doorCount = value === 1 ? 12 : value === 2 ? 24 : 16;
          const doors = [];
          for (let i = 1; i <= doorCount; i++) {
            doors.push({
              id: `${value}-${i}`, door_number: i, status: Math.random() > 0.7 ? 'occupied' : 'available',
              assigned_user_id: Math.random() > 0.6 ? Math.floor(Math.random() * 1000) + 100 : null,
              access_code: Math.random() > 0.5 ? Math.floor(Math.random() * 9000) + 1000 : null,
              last_opened_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              locker_id: value,
              clients_users: Math.random() > 0.6 ? { full_name: ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Davis', 'David Brown'][Math.floor(Math.random() * 5)] } : null,
              locker_sessions: Math.random() > 0.7 ? [{ status: 'active', start_time: new Date(Date.now() - Math.random() * 7200000).toISOString() }] : []
            });
          }
          return { order: () => Promise.resolve({ data: doors, error: null }) };
        }
        return Promise.resolve({ data: [], error: null });
      }
    })
  }),
  channel: (name) => ({
    on: (event, config, callback) => ({
      subscribe: () => {
        const interval = setInterval(() => {
          const doorId = Math.floor(Math.random() * 12) + 1;
          callback({ new: { id: `${Math.floor(Math.random() * 3) + 1}-${doorId}`, door_number: doorId, status: Math.random() > 0.4 ? 'occupied' : 'available', assigned_user_id: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 100 : null, access_code: Math.random() > 0.5 ? Math.floor(Math.random() * 9000) + 1000 : null, last_opened_at: new Date().toISOString() } });
        }, 4000 + Math.random() * 4000);
        return { unsubscribe: () => clearInterval(interval) };
      }
    })
  }),
  removeChannel: () => {}
};

const ClientLockerDashboardData = ({ clientId = 'demo-client' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lockers, setLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [doors, setDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoors, setLoadingDoors] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [particles, setParticles] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [view, setView] = useState('lockers'); // 'lockers', 'doors', 'fullscreen'
  const [selectedDoor, setSelectedDoor] = useState(null); // For door details modal
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- Data Fetching Logic ---
  const fetchLockers = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      const { data, error } = await mockSupabase
        .from('lockers')
        .select(`id, locker_number, status, door_count, location, created_at`)
        .eq('client_id', clientId);
      if (error) throw error;
      setLockers(data || []);
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Error fetching lockers:', err);
      setError(err.message || 'Failed to load lockers');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const fetchDoors = useCallback(async (lockerId) => {
    if (!lockerId) return;
    try {
      setLoadingDoors(true);
      const { data, error } = await mockSupabase
        .from('locker_doors')
        .select(`id, door_number, status, assigned_user_id, clients_users!assigned_user_id(full_name), access_code, last_opened_at, locker_id, locker_sessions(status, start_time)`)
        .eq('locker_id', lockerId)
        .order('door_number');
      if (error) throw error;
      const processedDoors = data.map(door => ({
        ...door,
        isOccupied: door.status === 'occupied',
        currentUser: door.clients_users,
        currentSession: door.locker_sessions?.find(session => session.status === 'active')
      }));
      setDoors(processedDoors);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching doors:', err);
      setError(err.message || 'Failed to load doors');
    } finally {
      setLoadingDoors(false);
    }
  }, []);

  // --- View and Selection Logic ---
  const handleLockerSelect = (locker) => {
    setSelectedLocker(locker);
    setView('doors');
    fetchDoors(locker.id);
  };

  const handleBackToLockers = () => {
    setView('lockers');
    setSelectedLocker(null);
    setDoors([]);
  };

  const handleOccupiedDoorClick = (door) => {
    setSelectedDoor(door);
  };

  const closeDoorDetails = () => {
    setSelectedDoor(null);
  };

  const goToFullScreenView = () => {
    setView('fullscreen');
  };

  const goBackFromFullScreen = () => {
    setView('doors');
  };

  // --- Effects ---
  useEffect(() => {
    setParticles([...Array(15)].map((_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100, delay: Math.random() * 5, duration: 5 + Math.random() * 3
    })));
    fetchLockers();
  }, [fetchLockers]);

  useEffect(() => {
    if (selectedLocker && view === 'doors') {
      const channel = mockSupabase
        .channel(`locker-doors-${selectedLocker.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'locker_doors', filter: `locker_id=eq.${selectedLocker.id}` },
          (payload) => {
            setDoors(prevDoors =>
              prevDoors.map(door =>
                door.id === payload.new.id
                  ? { ...door, ...payload.new, isOccupied: payload.new.status === 'occupied', currentUser: payload.new.assigned_user_id ? door.currentUser : null }
                  : door
              )
            );
            setLastUpdate(new Date());
          }
        )
        .subscribe();
      return () => { mockSupabase.removeChannel(channel); };
    }
  }, [selectedLocker, view]);

  useEffect(() => {
    if (view === 'fullscreen') {
      const timer = setInterval(() => { setCurrentTime(new Date()); }, 1000);
      return () => clearInterval(timer);
    }
  }, [view]);

  // --- Render UI Component with Props ---
  return (
    <ClientLockerDashboardUI
      clientId={clientId}
      lockers={lockers}
      selectedLocker={selectedLocker}
      doors={doors}
      loading={loading}
      loadingDoors={loadingDoors}
      error={error}
      lastUpdate={lastUpdate}
      particles={particles}
      connectionStatus={connectionStatus}
      view={view}
      selectedDoor={selectedDoor}
      currentTime={currentTime}
      fetchLockers={fetchLockers}
      handleLockerSelect={handleLockerSelect}
      handleBackToLockers={handleBackToLockers}
      handleOccupiedDoorClick={handleOccupiedDoorClick}
      closeDoorDetails={closeDoorDetails}
      goToFullScreenView={goToFullScreenView}
      goBackFromFullScreen={goBackFromFullScreen}
    />
  );
};

export default ClientLockerDashboardData;