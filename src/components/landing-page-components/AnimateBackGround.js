"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

const floatingIcons = [
  { Icon: Briefcase, delay: 0, duration: 8 },
  { Icon: Users, delay: 2, duration: 10 },
  { Icon: Target, delay: 4, duration: 9 },
  { Icon: TrendingUp, delay: 1, duration: 11 },
  { Icon: Clock, delay: 3, duration: 7 },
  { Icon: CheckCircle, delay: 5, duration: 8 },
];

const AnimatedBackground = ({ isDarkMode, mousePosition }) => {
  const [positions, setPositions] = useState({
    orb1: { left: "20%", top: "20%" },
    orb2: { right: "15%", top: "40%" },
    orb3: { left: "60%", bottom: "20%" },
  });

  useEffect(() => {
    const updatePositions = () => {
      const now = Date.now();
      setPositions({
        orb1: {
          left: `${20 + Math.sin(now * 0.001) * 10}%`,
          top: `${20 + Math.cos(now * 0.0015) * 10}%`,
        },
        orb2: {
          right: `${15 + Math.sin(now * 0.0012) * 8}%`,
          top: `${40 + Math.cos(now * 0.0018) * 12}%`,
        },
        orb3: {
          left: `${60 + Math.sin(now * 0.0008) * 15}%`,
          bottom: `${20 + Math.cos(now * 0.001) * 8}%`,
        },
      });
    };

    updatePositions(); // Initial
    const interval = setInterval(updatePositions, 100); // Update smoothly
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Colorful Animated Orbs */}
      <div className="absolute inset-0">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-500 to-purple-500"
              : "bg-gradient-to-r from-blue-300 to-purple-300"
          }`}
          style={{
            ...positions.orb1,
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-25 ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gradient-to-r from-purple-300 to-pink-300"
          }`}
          style={{
            ...positions.orb2,
            animation: "float 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-500 to-blue-500"
              : "bg-gradient-to-r from-cyan-300 to-blue-300"
          }`}
          style={{
            ...positions.orb3,
            animation: "float 30s ease-in-out infinite",
          }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, delay, duration }, index) => (
          <div
            key={index}
            className={`absolute opacity-10 ${
              isDarkMode ? "text-white" : "text-slate-600"
            }`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
              animation: `floatUpDown ${duration}s ease-in-out infinite ${delay}s`,
              fontSize: "2rem",
            }}
          >
            <Icon size={32} />
          </div>
        ))}
      </div>

      {/* Mouse-following light orb */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-yellow-400 to-orange-400"
            : "bg-gradient-to-r from-yellow-300 to-orange-300"
        }`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Subtle Grid */}
      <div
        className={`absolute inset-0 opacity-5 ${
          isDarkMode ? "bg-white" : "bg-slate-900"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Extra CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes floatUpDown {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
