import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

const EnhancedDoorUnit = ({ door, size = "medium" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  const sizeClasses = {
    large: "w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48",
    medium: "w-20 h-28",
    small: "w-16 h-20"
  };

  useEffect(() => {
    if (door) {
      setIsAnimating(true);
      setPulseEffect(true);
      const animationTimer = setTimeout(() => setIsAnimating(false), 600);
      const pulseTimer = setTimeout(() => setPulseEffect(false), 1000);
      return () => {
        clearTimeout(animationTimer);
        clearTimeout(pulseTimer);
      };
    }
  }, [door?.status, door?.assigned_user_id]);

  if (!door) {
    return (
      <div className={`relative ${sizeClasses[size]} bg-gray-200 animate-pulse rounded-sm`}>
        <div className="absolute inset-2 bg-gray-300 rounded-sm"></div>
      </div>
    );
  }

  const isOccupied = door.status === 'occupied';

  return (
    <div className="relative group">
      {/* Glow effect */}
      {pulseEffect && (
        <div className={`absolute -inset-2 bg-gradient-to-r ${
          isOccupied ? 'from-orange-400 to-orange-600' : 'from-gray-400 to-gray-600'
        } rounded-lg opacity-20 blur-md animate-pulse`}></div>
      )}
      <div
        className={`relative ${sizeClasses[size]} transition-all duration-500 transform cursor-pointer ${
          isAnimating ? 'scale-110' : 'scale-100'
        } group-hover:scale-105`}
      >
        {/* Locker frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm shadow-lg">
          {/* Locker door with enhanced animation */}
          <div
            className={`absolute inset-1 bg-gradient-to-b transition-all duration-500 rounded-sm shadow-inner ${
              isOccupied
                ? 'from-orange-400 to-orange-500 transform translate-x-2 rotate-12 origin-left'
                : 'from-gray-100 to-gray-200'
            } ${isAnimating ? 'animate-pulse' : ''}`}
          >
            {/* Door handle */}
            <div className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500 ${
              isOccupied ? 'bg-orange-600' : 'bg-gray-400'
            }`}></div>
            {/* Enhanced lock indicator */}
            <div className="absolute left-1 top-1 w-3 h-2 bg-gray-500 rounded-sm flex items-center justify-center">
              {isOccupied ? (
                <Unlock className="w-2 h-2 text-green-400 animate-pulse" />
              ) : (
                <Lock className="w-2 h-2 text-red-400" />
              )}
            </div>
          </div>
          {/* Door number */}
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <span className={`font-bold text-gray-600 ${size === 'large' ? 'text-sm md:text-base' : 'text-xs'}`}>{door.door_number}</span>
          </div>
          {/* Enhanced status indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            isOccupied ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
        </div>
        {/* Tooltip on hover (only for medium/small) */}
        {size !== 'large' && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {isOccupied && door.clients_users ? (
              <>Door #{door.door_number} - {door.clients_users.full_name}</>
            ) : (
              <>Door #{door.door_number} - Available</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDoorUnit;