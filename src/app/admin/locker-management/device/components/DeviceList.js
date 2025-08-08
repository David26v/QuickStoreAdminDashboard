'use client';

import React from 'react';
import DeviceCard from './DeviceCard';
import { Skeleton } from '@/components/ui/skeleton';


const DeviceList = ({ devices, loading, filteredDevices, onDetailsClick, onActionsClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, index) => (
        //   <DeviceSkeleton key={index} />
          <div key={index} className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-4">
             <div className="space-y-3">
               <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <div className="flex justify-between pt-2">
                 <Skeleton className="h-8 w-20" />
                 <Skeleton className="h-8 w-24" />
               </div>
             </div>
           </div>
        ))}
      </div>
    );
  }

  if (filteredDevices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-white/20 max-w-md">
          <Smartphone className="h-16 w-16 text-orange-400 mb-6 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Devices Found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredDevices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onDetailsClick={onDetailsClick}
          onActionsClick={onActionsClick}
        />
      ))}
    </div>
  );
};

export default DeviceList;