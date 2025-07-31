import React, { createContext, useContext, useState } from 'react';
import { Clock } from 'lucide-react';

const LoadingContext = createContext({
  show: (title) => {},
  hide: () => {},
  isLoading: false,
  title: '',
  subtitle: '',
});

export const useLoading = () => useContext(LoadingContext);


const getLoadingText = (title) => {
  switch (title?.toLowerCase()) {
    case 'login':
      return {
        title: 'Authenticating',
        subtitle: 'Verifying credentials & access level...',
      };
    case 'submit':
      return {
        title: 'Submitting',
        subtitle: 'Sending data to the server...',
      };
    case 'fetch':
      return {
        title: 'Loading Data',
        subtitle: 'Fetching required information...',
      };
    case 'saving':
      return {
        title: 'Saving',
        subtitle: 'Writing to database...',
      };
    default:
      return {
        title: title || 'Loading',
        subtitle: 'Please wait...',
      };
  }
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('Loading');
  const [subtitle, setSubtitle] = useState('Please wait...');

  const show = (contextTitle) => {
    const { title, subtitle } = getLoadingText(contextTitle);
    setTitle(title);
    setSubtitle(subtitle);
    setIsLoading(true);
  };

  const hide = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ show, hide, isLoading, title, subtitle }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 border border-white/50">
            <div className="relative">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-2 border-4 border-transparent border-t-green-500 rounded-full animate-spin"
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                ></div>
                <div
                  className="absolute inset-4 border-2 border-transparent border-t-purple-500 rounded-full animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
                <div className="absolute inset-6 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-600 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-800 font-semibold text-lg">{title}</p>
              <p className="text-slate-600 text-sm">{subtitle}</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
