// app/components/FullScreenDoorView.jsx
import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';


const FullScreenDoorView = ({ selectedLocker, doors, loadingDoors, currentTime, goBackFromFullScreen }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col">
      {/* Full Screen Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <QuickStoreLogo size="w-10 h-10" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{selectedLocker?.locker_number}</h1>
            <p className="text-gray-400 text-sm">{selectedLocker?.location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono">{currentTime.toLocaleTimeString()}</div>
          <div className="text-gray-400 text-xs">{currentTime.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Full Screen Door Grid */}
      <div className="flex-1 overflow-auto p-4">
        {loadingDoors ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full animate-ping mx-auto mb-4 opacity-20"></div>
              <p className="text-gray-400">Loading doors...</p>
            </div>
          </div>
        ) : doors.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-4 justify-center">
            {doors.map((door) => (
              <EnhancedDoorUnit key={door.id} door={door} size="large" />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No doors found for this locker</p>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Footer with Back Button */}
      <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
        <button
          onClick={goBackFromFullScreen}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default FullScreenDoorView;