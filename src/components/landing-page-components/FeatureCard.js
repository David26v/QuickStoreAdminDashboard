'use client'
import React from 'react';

export default function FeatureCard({ feature, isDarkMode }) {
  const IconComponent = feature.icon;
  const isInProgress = feature.status === 'in-progress';

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl p-6 transition-all duration-300 
        h-full flex flex-col
        ${isInProgress 
          ? 'cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
        }
        ${isDarkMode 
          ? 'bg-slate-800 border border-slate-700 hover:border-slate-600' 
          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-lg'
        }
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 ${!isInProgress && 'group-hover:opacity-5'} transition-opacity duration-300`} />

      {IconComponent ? (
        <div className={`relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 ${isInProgress && 'opacity-60'}`}>
          <IconComponent size={24} className="text-white" />
        </div>
      ) : (
        <div className={`relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
          <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'} ${isInProgress && 'opacity-75'}`}>
          {feature.title}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${isInProgress && 'opacity-75'}`}>
          {feature.description}
        </p>

        {/* Learn more or Coming Soon */}
        <div className="mt-auto">
          {isInProgress ? (
            <div className={`flex items-center text-sm font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                <span>Coming Soon</span>
              </div>
            </div>
          ) : (
            <div className={`flex items-center text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} group-hover:text-blue-500 transition-colors`}>
              <span>Learn more</span>
              <svg 
                className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Shine effect on hover */}
      {!isInProgress && (
        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700" />
      )}
    </div>
  );
}
