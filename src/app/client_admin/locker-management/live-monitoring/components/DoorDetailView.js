// app/components/DoorDetailView.jsx
import React from 'react';
import { Shield, Grid, Monitor, User, Key, Clock, Settings, Eye, Unlock } from 'lucide-react';
import EnhancedDoorUnit from './EnhancedDoorUnit';


const DoorDetailView = ({ selectedLocker, doors, loadingDoors, lastUpdate, handleOccupiedDoorClick, goToFullScreenView }) => {
  return (
    <div className="space-y-8">
      {/* Selected Locker Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="text-orange-500" />
              {selectedLocker?.locker_number}
            </h2>
            <p className="text-gray-600">{selectedLocker?.location}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Last Updated</div>
            <div className="text-sm font-mono text-gray-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Door Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{doors.length}</div>
            <div className="text-gray-600">Total Doors</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{doors.filter(d => d.isOccupied).length}</div>
            <div className="text-gray-600">Occupied</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{doors.filter(d => !d.isOccupied).length}</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* Door Grid - Limited to 4 columns x 6 rows */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Grid className="text-orange-500" />
            Door Status Grid (4x6 View)
          </h3>
          <button
            onClick={goToFullScreenView}
            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            <Monitor className="w-4 h-4" />
            <span>Full Screen View</span>
          </button>
        </div>
        {loadingDoors ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full animate-ping mx-auto mb-4 opacity-20"></div>
              <p className="text-gray-500">Loading doors...</p>
            </div>
          </div>
        ) : doors.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {doors.slice(0, 24).map((door) => (
              <div key={door.id} className="flex justify-center">
                <EnhancedDoorUnit door={door} size="medium" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No doors found for this locker</p>
          </div>
        )}
      </div>

      {/* Occupied Doors Detail - Clickable */}
      {doors.filter(d => d.isOccupied).length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User className="text-orange-500" />
            Currently Occupied Doors ({doors.filter(d => d.isOccupied).length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doors
              .filter(door => door.isOccupied)
              .map(door => (
                <div
                  key={door.id}
                  className="bg-white rounded-lg p-4 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOccupiedDoorClick(door)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span>Door #{door.door_number}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </h4>
                      {door.currentUser ? (
                        <p className="text-gray-600 flex items-center gap-1 mt-1">
                          <User className="w-4 h-4" />
                          {door.currentUser.full_name}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm">User info not available</p>
                      )}
                      {door.access_code && (
                        <p className="text-orange-600 flex items-center gap-1 mt-1">
                          <Key className="w-4 h-4" />
                          Code: {door.access_code}
                        </p>
                      )}
                      {door.currentSession && (
                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started: {new Date(door.currentSession.start_time).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                        OCCUPIED
                      </span>
                      <button className="text-orange-500 hover:text-orange-600 text-xs mt-2 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Available Doors Summary */}
      {doors.filter(d => !d.isOccupied).length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Unlock className="text-gray-500" />
            Available Doors ({doors.filter(d => !d.isOccupied).length})
          </h3>
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
            {doors
              .filter(door => !door.isOccupied)
              .map(door => (
                <div
                  key={door.id}
                  className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                  title={`Door #${door.door_number} - Available`}
                >
                  #{door.door_number}
                </div>
              ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              {doors.filter(d => !d.isOccupied).length} doors ready for occupied assignment
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Settings className="text-orange-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={goToFullScreenView}
            className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:border-orange-300 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-800">Full Screen View</span>
            </div>
            <p className="text-sm text-gray-600">View all doors on a large display</p>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-colors text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-800">Access Codes</span>
            </div>
            <p className="text-sm text-gray-600">Manage door access codes</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-300 transition-colors text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-800">Activity Log</span>
            </div>
            <p className="text-sm text-gray-600">View recent door activities</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoorDetailView;