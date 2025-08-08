"use client";

import React from 'react';
import { Lock, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DoorCard = ({ door, onClick }) => {
  // (Color logic remains unchanged)
  let doorColor = "from-slate-100 to-slate-200";
  let doorBorder = "border-slate-300";
  let handleColor = "bg-slate-400";
  let statusColor = "text-slate-600";
  let statusBg = "bg-slate-100";
  // Make all doors clickable by default
  let cursorClass = "cursor-pointer";
  let glowEffect = "hover:shadow-md";

  if (door.status === 'occupied') {
    doorColor = "from-blue-100 to-blue-200";
    doorBorder = "border-blue-300";
    handleColor = "bg-blue-500";
    statusColor = "text-blue-700";
    statusBg = "bg-blue-100";
    glowEffect = "hover:shadow-blue-200";
  } else if (door.status === 'overdue') {
    doorColor = "from-red-100 to-red-200";
    doorBorder = "border-red-300";
    handleColor = "bg-red-500";
    statusColor = "text-red-700";
    statusBg = "bg-red-100";
    glowEffect = "hover:shadow-red-200";
  } else if (door.status === 'available') {
    doorColor = "from-green-50 to-green-100";
    doorBorder = "border-green-200";
    handleColor = "bg-green-400";
    statusColor = "text-green-700";
    statusBg = "bg-green-100";
  }

  return (
    <div
      onClick={onClick} // Simplified onClick
      className={`relative ${cursorClass} transition-all duration-300 ${glowEffect} hover:ring-2 hover:ring-inset hover:ring-blue-400 rounded-lg`}
    >
      {/* Door Frame */}
      <div className={`relative bg-gradient-to-br ${doorColor} border-2 ${doorBorder} rounded-lg p-4 h-32 flex flex-col justify-between shadow-sm transition-all duration-300`}>
        {/* Door Handle */}
        <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 ${handleColor} rounded-full shadow-inner`}>
          <div className="w-1 h-4 bg-white bg-opacity-30 rounded-full ml-1 mt-1"></div>
        </div>
        {/* Door Number */}
        <div className="text-center">
          <div className={`inline-block px-2 py-1 ${statusBg} rounded-md mb-2`}>
            <span className={`text-sm font-bold ${statusColor}`}>#{door.door_number}</span>
          </div>
        </div>
        {/* Door Status */}
        <div className="text-center">
          <div className={`inline-block px-2 py-1 ${statusBg} rounded-full text-xs font-semibold ${statusColor}`}>
            {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
          </div>
          {/* Duration for occupied/overdue doors */}
          {(door.status === 'occupied' || door.status === 'overdue') && door.assigned_at && (
            <div className="mt-1 flex items-center justify-center text-xs text-slate-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDistanceToNow(new Date(door.assigned_at))}</span>
            </div>
          )}
          {/* Hint for available doors */}
          {door.status === 'available' && (
             <div className="mt-1 text-xs text-slate-500 italic">
               Click to assign
             </div>
          )}
        </div>
        {/* Door Panel Lines for realism */}
        <div className="absolute inset-2 border border-opacity-20 border-slate-400 rounded-md pointer-events-none">
          <div className="absolute top-1/3 left-1 right-3 h-px bg-slate-300 bg-opacity-50"></div>
          <div className="absolute bottom-1/3 left-1 right-3 h-px bg-slate-300 bg-opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default DoorCard;