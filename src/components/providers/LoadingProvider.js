"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Lock, Unlock } from "lucide-react";

const LoadingContext = createContext({
  show: (title) => {},
  hide: () => {},
  isLoading: false,
  title: "",
  subtitle: "",
});

export const useLoading = () => useContext(LoadingContext);

const getLoadingText = (title) => {
  switch (title?.toLowerCase()) {
    case "login":
      return {
        title: "Authenticating",
        subtitle: "Verifying credentials & locker access...",
      };
    case "submit":
      return {
        title: "Submitting",
        subtitle: "Saving your data to the secure locker system...",
      };
    case "fetch":
      return {
        title: "Loading Data",
        subtitle: "Gathering locker information...",
      };
    case "saving":
      return {
        title: "Saving",
        subtitle: "Updating locker configurations...",
      };
    default:
      return {
        title: title || "Loading",
        subtitle: "Please wait...",
      };
  }
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("Loading");
  const [subtitle, setSubtitle] = useState("Please wait...");
  const [unlocked, setUnlocked] = useState(false);

  const show = (contextTitle) => {
    const { title, subtitle } = getLoadingText(contextTitle);
    setTitle(title);
    setSubtitle(subtitle);
    setUnlocked(false);
    setIsLoading(true);
    setTimeout(() => {
      setUnlocked(true); // trigger unlock animation after delay
    }, 1500);
  };

  const hide = () => {
    setIsLoading(false);
    setUnlocked(false);
  };

  return (
    <LoadingContext.Provider value={{ show, hide, isLoading, title, subtitle }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-6 border border-orange-300 w-[300px]">
            {/* --- Locker Animation --- */}
            <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-inner">
              <div className="absolute inset-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full" />
              <div className="relative z-10 animate-spin-slow text-orange-500">
                {!unlocked ? (
                  <Lock className="w-10 h-10 animate-bounce-in" />
                ) : (
                  <Unlock className="w-10 h-10 animate-fade-in" />
                )}
              </div>
            </div>

            {/* --- Loading Text --- */}
            <div className="text-center">
              <p className="text-slate-800 font-semibold text-lg">{title}</p>
              <p className="text-gray-500 text-sm">{subtitle}</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
