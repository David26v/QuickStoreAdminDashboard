// components/ModuleLoaders.jsx
"use client";

import React from 'react';
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button"; // Make sure this path is correct for your project

// --- 1. Reusable Loading Skeleton Component ---
export const ModuleSkeletonLoader = ({ message = "Preparing your workspace" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-flex mb-6"> {/* Added margin-bottom for spacing */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600"></div>
          </div>
        </div>
        <div className="mt-4 space-y-4"> {/* Reduced top margin */}
          <div className="h-4 bg-indigo-200 rounded-full animate-pulse mx-auto max-w-xs"></div>
          <div className="h-4 bg-indigo-200 rounded-full animate-pulse mx-auto max-w-md"></div>
        </div>
        <div className="mt-8 space-y-6"> {/* Reduced top margin */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 border border-indigo-100"
              >
                <div className="space-y-3">
                  <div className="h-3 bg-indigo-100 rounded-full animate-pulse"></div>
                  <div className="h-6 bg-indigo-200 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-indigo-100 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100">
            <div className="space-y-4">
              <div className="h-4 bg-indigo-200 rounded-full animate-pulse w-1/4"></div>
              <div className="h-2 bg-indigo-100 rounded-full animate-pulse"></div>
              <div className="h-2 bg-indigo-100 rounded-full animate-pulse w-5/6"></div>
              <div className="h-2 bg-indigo-100 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
        <p className="mt-8 text-gray-600 font-medium">
          {message}
        </p>
        <div className="mt-2 flex justify-center">
          <div className="h-1.5 bg-indigo-200 rounded-full w-32 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};


export const ModuleErrorDisplay = ({ error, onRetry }) => {
  // Ensure error is a string for display
  const errorMessage = typeof error === 'string' ? error : error?.message || "An unknown error occurred.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center border border-gray-200">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Error Loading Module
        </h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <Button
          onClick={onRetry}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto mx-auto"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};