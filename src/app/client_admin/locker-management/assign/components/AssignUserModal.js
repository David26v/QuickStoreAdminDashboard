'use client'
import React, { useState } from 'react';
import { X, Lock, User, Building, DoorOpen, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import supabase from '@/lib/helper';

const AssignLockerModal = ({ isOpen, onClose, user, availableDoors, onAssigned }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDoorId, setSelectedDoorId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const groupedDoors = availableDoors.reduce((acc, door) => {
    const lockerId = door.locker_id;
    if (!acc[lockerId]) {
      acc[lockerId] = {
        locker: door.locker,
        doors: []
      };
    }
    acc[lockerId].doors.push(door);
    return acc;
  }, {});

  const handleAssign = async () => {
    if (!selectedDoorId) {
      setError('Please select a door to assign');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update the locker door with user assignment
      const { error: updateError } = await supabase
        .from('locker_doors')
        .update({
          assigned_user_id: user.id,
          assigned_at: new Date().toISOString(),
          status: 'occupied'
        })
        .eq('id', selectedDoorId);

      if (updateError) throw updateError;

      // Log admin action (optional)
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase.from('admin_actions').insert([
          {
            admin_id: currentUser.id,
            action_type: 'assign_door',
            target_user_id: user.id,
            locker_door_id: selectedDoorId,
            notes: `Assigned door to ${user.full_name}`
          }
        ]);
      }

      onAssigned();
      onClose();
      setSelectedDoorId('');

    } catch (error) {
      console.error('Error assigning door:', error);
      setError('Failed to assign door. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedDoorId('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-gray-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Locker Door</h2>
              <p className="text-sm text-slate-400">Assign a locker door to {user.full_name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{user.full_name}</h3>
              <p className="text-sm text-slate-400">{user.department} • {user.position}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Door Selection */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800/50 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {availableDoors.length === 0 ? (
            <div className="text-center py-8">
              <DoorOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Available Doors</h3>
              <p className="text-slate-400">All locker doors are currently occupied.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select an Available Door</h3>
              
              {Object.entries(groupedDoors).map(([lockerId, { locker, doors }]) => (
                <div key={lockerId} className="bg-gray-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Locker #{locker?.locker_number}</h4>
                      <p className="text-sm text-slate-400">{doors.length} available doors</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                    {doors.map((door) => (
                      <button
                        key={door.id}
                        onClick={() => setSelectedDoorId(door.id)}
                        className={`aspect-square relative rounded-lg border-2 transition-all duration-200 ${
                          selectedDoorId === door.id
                            ? 'bg-blue-600/50 border-blue-400 ring-2 ring-blue-400/50'
                            : 'bg-gray-900/50 border-slate-600/50 hover:border-blue-500/50'
                        }`}
                        disabled={loading}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center ${
                            selectedDoorId === door.id ? 'bg-blue-400' : 'bg-gray-600'
                          }`}>
                            <DoorOpen className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-white">{door.door_number}</span>
                        </div>
                        
                        {selectedDoorId === door.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {availableDoors.length > 0 && (
          <div className="flex space-x-3 p-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading || !selectedDoorId}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Assign Door</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignLockerModal;