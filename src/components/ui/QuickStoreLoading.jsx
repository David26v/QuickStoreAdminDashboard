import React from 'react';
import { Shield, Lock } from 'lucide-react';

const QuickStoreLoading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-8">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-pulse">
            {/* Main shield container */}
            <div className="absolute inset-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
              <Shield className="h-8 w-8 text-slate-200 animate-bounce" />
            </div>
            
            {/* Orange security badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-spin">
              <Lock className="h-3.5 w-3.5 text-white" />
            </div>
            
            {/* Glowing ring animation */}
            <div className="absolute inset-0 rounded-2xl border-2 border-orange-300 opacity-30 animate-ping"></div>
          </div>
          
          {/* Outer glow effect */}
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
        </div>

        {/* Company Name */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            QuickStore Philippines
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Locker Management System
          </p>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <p className="text-xl text-gray-700 font-medium mb-4">{message}</p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Subtle footer */}
        <div className="mt-12 text-sm text-gray-400">
          Initializing secure connection...
        </div>
      </div>
    </div>
  );
};

// Alternative compact version for smaller loading states
const QuickStoreLoadingCompact = ({ message = "Loading..." }) => {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex flex-col items-center">
        {/* Compact Logo */}
        <div className="relative mb-4">
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-inner">
              <Shield className="h-6 w-6 text-slate-200 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center animate-spin">
              <Lock className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-700 mb-3">{message}</p>
        
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Alternative spinner version
const QuickStoreLoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex flex-col items-center">
        {/* Spinning Logo */}
        <div className="relative mb-4">
          <div className="relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-lg overflow-hidden animate-spin">
            <div className="absolute inset-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-inner">
              <Shield className="h-5 w-5 text-slate-200" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
              <Lock className="h-1.5 w-1.5 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default QuickStoreLoading;
export { QuickStoreLoadingCompact, QuickStoreLoadingSpinner };