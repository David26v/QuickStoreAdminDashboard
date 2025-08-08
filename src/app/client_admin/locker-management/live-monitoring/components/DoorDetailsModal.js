// app/components/DoorDetailsModal.jsx
import React from 'react';
import { X, User, Key, Clock, Eye } from 'lucide-react';
import EnhancedDoorUnit from './EnhancedDoorUnit'; 

const DoorDetailsModal = ({ selectedDoor, selectedLocker, closeDoorDetails }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">Door #{selectedDoor.door_number} Details</h3>
            <button
              onClick={closeDoorDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <EnhancedDoorUnit door={selectedDoor} size="medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-semibold ${selectedDoor.isOccupied ? 'text-green-600' : 'text-gray-600'}`}>
                  {selectedDoor.isOccupied ? 'Occupied' : 'Available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Locker</p>
                <p className="font-semibold">{selectedLocker?.locker_number}</p>
              </div>
            </div>
            {selectedDoor.currentUser && (
              <div>
                <p className="text-sm text-gray-500">Assigned User</p>
                <p className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  {selectedDoor.currentUser.full_name}
                </p>
              </div>
            )}
            {selectedDoor.access_code && (
              <div>
                <p className="text-sm text-gray-500">Access Code</p>
                <p className="font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-600" />
                  {selectedDoor.access_code}
                </p>
              </div>
            )}
            {selectedDoor.currentSession && (
              <div>
                <p className="text-sm text-gray-500">Session Started</p>
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  {new Date(selectedDoor.currentSession.start_time).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-semibold">
                {new Date(selectedDoor.last_opened_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeDoorDetails}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Monitor Door
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoorDetailsModal;