'use client';
import React from 'react';

const ZentryxLogo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <>
      <style jsx>{`
        @keyframes rotate-hour {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-minute {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-hour {
          animation: rotate-hour 12s linear infinite;
        }
        .animate-minute {
          animation: rotate-minute 4s linear infinite;
        }
      `}</style>

      <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} rounded-full shadow-lg overflow-hidden bg-gradient-to-br from-white to-slate-100 border-2 border-blue-600`}>
        
        {/* Stylized Background Z */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[2.5rem] font-black text-blue-100 tracking-widest opacity-20 -rotate-12 select-none">
            Z
          </span>
        </div>

        {/* Inner clock face */}
        <div className="absolute inset-[12%] bg-white rounded-full shadow-inner border border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hour hand */}
            <div className="absolute w-0.5 h-3 bg-slate-700 rounded-full origin-bottom animate-hour"></div>
            {/* Minute hand */}
            <div className="absolute w-0.5 h-4 bg-blue-600 rounded-full origin-bottom animate-minute"></div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Markers */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-slate-300"></div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-slate-300"></div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-slate-300"></div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-slate-300"></div>
        </div>

        {/* Glow border */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-20 blur-sm animate-pulse" />
      </div>
    </>
  );
};

export default ZentryxLogo;
