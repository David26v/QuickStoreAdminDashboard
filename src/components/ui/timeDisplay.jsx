'use client';
import React, { useEffect, useState } from 'react';

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const CurrentTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false); 

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hasMounted) return null; 

  return (
    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/30">
      <div className="text-center">
        <div className="text-2xl font-bold text-slate-800 font-mono">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-slate-600 mt-1">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeDisplay;
