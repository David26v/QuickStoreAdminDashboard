'use client';

import React, { useState } from 'react';
import { Lock, Unlock, User, Key, Activity, AlertCircle, ArrowLeft, Shield, Clock, Settings, Grid, Eye, ChevronRight, Home, Monitor, X } from 'lucide-react';
import LockerListView from './LockerListView';
import DoorDetailView from './DoorDetailView';
import DoorDetailsModal from './DoorDetailsModal';




const ClientLockerDashboardUI = (props) => {

const {
  clientId, lockers, selectedLocker, doors, loading, loadingDoors, error, lastUpdate, particles, connectionStatus, view, selectedDoor,
  currentTime, fetchLockers, handleLockerSelect, handleBackToLockers, handleOccupiedDoorClick, closeDoorDetails, goToFullScreenView, goBackFromFullScreen
} = props;

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800">Invalid Configuration</h3>
          <p className="text-gray-600">Client ID not provided.</p>
        </div>
      </div>
    );
  };

  if (error && view === 'lockers') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLockers}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  };

  if (view === 'fullscreen') {
    return (
      <FullScreenDoorView
        selectedLocker={selectedLocker}
        doors={doors}
        loadingDoors={loadingDoors}
        currentTime={currentTime}
        goBackFromFullScreen={goBackFromFullScreen}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background elements and particles (same as in original) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Key className="absolute top-20 left-10 w-6 h-6 text-orange-300 opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Key className="absolute top-40 right-20 w-4 h-4 text-gray-400 opacity-40 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <Lock className="absolute top-60 right-10 w-4 h-4 text-gray-500 opacity-30 animate-pulse" />
        <Shield className="absolute bottom-32 left-20 w-5 h-5 text-orange-400 opacity-25 animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
                {view === 'lockers' ? (
                  <>
                    <Grid className="text-orange-500" />
                    Locker Management
                  </>
                ) : (
                  <>
                    <Activity className="text-orange-500" />
                    Door Monitor
                  </>
                )}
              </h1>
              <p className="text-slate-600 text-sm md:text-base mt-1">
                {view === 'lockers'
                  ? `Managing ${lockers.length} locker${lockers.length !== 1 ? 's' : ''}`
                  : `${selectedLocker?.locker_number} • ${doors.length} doors • Real-time monitoring`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
              }`}></div>
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </div>
            {view === 'doors' && (
              <button
                onClick={handleBackToLockers}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Lockers</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {view === 'lockers' ? (
            <LockerListView
              lockers={lockers}
              loading={loading}
              handleLockerSelect={handleLockerSelect}
            />
          ) : (
            <DoorDetailView
              selectedLocker={selectedLocker}
              doors={doors}
              loadingDoors={loadingDoors}
              lastUpdate={lastUpdate}
              handleOccupiedDoorClick={handleOccupiedDoorClick}
              goToFullScreenView={goToFullScreenView}
            />
          )}
        </div>
      </div>

      {/* Door Details Modal */}
      {selectedDoor && (
        <DoorDetailsModal
          selectedDoor={selectedDoor}
          selectedLocker={selectedLocker}
          closeDoorDetails={closeDoorDetails}
        />
      )}
    </div>
  );
};

export default ClientLockerDashboardUI;