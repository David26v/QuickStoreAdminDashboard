// app/components/ClientLockerDashboardData.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ClientLockerDashboardUI from './components/ClientLockerDashboardUi';
import { useUser } from '@/components/providers/UserContext';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ClientLockerDashboardData = () => {
  const {clientId} = useUser();
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
  const [subscription, setSubscription] = useState(null);

  // --- Data Fetching Logic ---
  const fetchLockers = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase
        .from('lockers')
        .select(`
          id, 
          name,
          status, 
          door_count, 
          location, 
          created_at,
          color,
          size,
          picture_url
        `)
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
      
      const { data, error } = await supabase
        .from('locker_doors')
        .select(`
          id, 
          door_number, 
          status, 
          assigned_user_id, 
          clients_users!assigned_user_id(full_name), 
          last_opened_at, 
          locker_id,
          locker_sessions(status, start_time)
        `)
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
    
    // Clean up subscription when going back
    if (subscription) {
      supabase.removeChannel(subscription);
      setSubscription(null);
    }
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

      if (subscription) {
        supabase.removeChannel(subscription);
      }
      
      const channel = supabase
        .channel(`locker-doors-${selectedLocker.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'locker_doors',  
            filter: `locker_id=eq.${selectedLocker.id}` 
          },
          (payload) => {
            setDoors(prevDoors =>
              prevDoors.map(door =>
                door.id === payload.new.id
                  ? { 
                      ...door, 
                      ...payload.new, 
                      isOccupied: payload.new.status === 'occupied',
                      currentUser: payload.new.assigned_user_id ? door.currentUser : null
                    }
                  : door
              )
            );
            setLastUpdate(new Date());
          }
        )
        .subscribe();
        
      setSubscription(channel);
      
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [selectedLocker, view]);

  useEffect(() => {
    if (view === 'fullscreen') {
      const timer = setInterval(() => { setCurrentTime(new Date()); }, 1000);
      return () => clearInterval(timer);
    }
  }, [view]);

  useEffect(() => {
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [subscription]);

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