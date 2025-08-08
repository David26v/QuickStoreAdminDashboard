// components/client/lockers/DoorGridView.js
"use client";

import React from 'react';
import { AlertCircle, CheckCircle, Lock, Building2 } from 'lucide-react';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';
import DoorCard from './DoorCard';

const DoorGridView = ({
  locker,
  doors,
  loading,
  onSelectDoor,
  onBack 
}) => {
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
        {/* Updated instruction text */}
        <h3 className="text-lg font-bold text-slate-800 mb-6">Door Layout - Click any door for details</h3>
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

export default DoorGridView;