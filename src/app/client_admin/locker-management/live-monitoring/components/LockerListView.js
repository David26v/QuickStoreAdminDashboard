// app/components/LockerListView.jsx
import React from 'react';
import { Shield, Eye, ChevronRight } from 'lucide-react';

const LockerListView = ({ lockers, loading, handleLockerSelect }) => {
  return (
    <div className="space-y-8">
      {/* Stats Panel */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{lockers.length}</div>
            <div className="text-gray-600">Total Lockers</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{lockers.filter(l => l.status === 'active').length}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{lockers.filter(l => l.status === 'maintenance').length}</div>
            <div className="text-gray-600">Maintenance</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{lockers.reduce((sum, l) => sum + l.door_count, 0)}</div>
            <div className="text-gray-600">Total Doors</div>
          </div>
        </div>
      </div>

      {/* Lockers Grid */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Lockers</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        ) : lockers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockers.map((locker) => (
              <div
                key={locker.id}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 cursor-pointer group hover:shadow-xl"
                onClick={() => handleLockerSelect(locker)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {locker.locker_number}
                    </h3>
                    <p className="text-sm text-gray-500">{locker.location}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    locker.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {locker.status.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-700">
                    {locker.door_count}
                    <span className="text-sm font-normal text-gray-500 ml-1">doors</span>
                  </div>
                  <Shield className="w-8 h-8 text-gray-300 group-hover:text-orange-400 transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Added {new Date(locker.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-600 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Monitor</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lockers found</p>
            <p className="text-sm text-gray-400 mt-1">Contact support to set up your lockers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerListView;