'use client';
import React, { useMemo } from 'react';
import { Key, Lock, Shield } from 'lucide-react';

const generateParticles = (count = 15) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }));
};

const AnimatedBackground = () => {
  const particles = useMemo(() => generateParticles(15), []);

  return (
    <div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
        </div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {/* Floating icons */}
        <Key className="absolute top-20 left-10 w-6 h-6 text-orange-300 opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Key className="absolute top-40 right-20 w-4 h-4 text-gray-400 opacity-40 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <Lock className="absolute top-60 right-10 w-4 h-4 text-gray-500 opacity-30 animate-pulse" />
        <Shield className="absolute bottom-32 left-20 w-5 h-5 text-orange-400 opacity-25 animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>
    </div>
    
  );
};

export default AnimatedBackground;
