"use client";

import React from 'react';
import { Search, PlusCircle, Lock, Building2, CheckCircle, Key, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickStoreLoadingCompact } from '@/components/ui/QuickStoreLoading';

const LockerListView = ({
  lockers,
  loading,
  searchTerm,
  onSelectLocker,
  onSearchTermChange,
  onRequestNewLocker
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
        <QuickStoreLoadingCompact message="Loading lockers..." />
      </div>
    );
  }

  if (lockers.length === 0 && searchTerm === '') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-3">No Lockers Assigned</h3>
        <p className="text-slate-500 mb-6">You don't have any lockers assigned to your client account yet.</p>
        <Button
          onClick={onRequestNewLocker}
          className="flex items-center justify-center space-x-2 whitespace-nowrap bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 mx-auto"
          variant="default"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request New Locker</span>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Request Button Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lockers (by # or ID)..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={onRequestNewLocker}
          className="flex items-center justify-center space-x-2 whitespace-nowrap bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          variant="default"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request New Locker</span>
        </Button>
      </div>

      {/* Locker Grid */}
      {lockers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockers.map((locker) => (
            <div
              key={locker.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden cursor-pointer"
              onClick={() => onSelectLocker(locker)}
            >
              {/* Locker Header with 3D effect */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Locker #{locker.locker_number}</h3>
                      <p className="text-slate-300 text-sm">Secure Storage Unit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Locker Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 font-medium">Total Doors</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full">
                    <span className="text-blue-800 font-bold">{locker.door_count}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">Status: </span>
                  <span className="text-sm font-semibold text-green-600 capitalize">{locker.status}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg shadow-sm"
                >
                  <span>View All Doors</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Message when search yields no results
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-700 mb-3">No Lockers Found</h3>
          <p className="text-slate-500">Your search for "{searchTerm}" did not match any lockers.</p>
        </div>
      )}
    </div>
  );
};

export default LockerListView;