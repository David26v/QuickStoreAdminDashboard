// components/ui/FloatingEmployeeSidebar.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Wallet,
  TrendingUp,
  Shield,
  Bell,
  HelpCircle,
  Settings,
  FileClock,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  UserCheck,
  LayoutDashboard,
  Briefcase,
  Users2,
  X,
  Minus,
  Square,
  Home,
  LogOut,
  AppWindow,
  Grid3X3,
  Phone,
  MessageCircle,
  User,
} from "lucide-react";
import { useLoading } from "../providers/LoadingProvider";

// Custom Logo Component
const ZentryxLogo = ({ size = "w-8 h-8", onClick }) => (
  <button
    onClick={onClick}
    className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none`}
    aria-label="Application menu"
  >
    <div className="absolute inset-1 bg-white rounded-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-0.5 h-2 bg-slate-700 rounded-full transform -rotate-45 origin-bottom"></div>
        <div className="absolute w-0.5 h-2.5 bg-blue-600 rounded-full transform rotate-12 origin-bottom"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full"></div>
    </div>
    <div className="absolute inset-0 border border-blue-500 rounded-lg"></div>
  </button>
);

const FloatingEmployeeSidebar = ({ role, isOpen, onClose, appMode = false, appModeStyle = 'windows' }) => { // Added appModeStyle prop
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const router = useRouter();
  const { show, hide } = useLoading();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar-popup') && !event.target.closest('.app-button')) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = async (item) => {
    setActiveItem(item.label);
    show("Loading module...");
    await new Promise(res => setTimeout(res, 300));
    router.push(item.path);
    setTimeout(() => {
      hide();
    }, 300);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const activeStyle = "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
  const inactiveStyle = "text-gray-700 hover:text-gray-900";
  const groupStyle = "text-gray-700 hover:bg-blue-50";

  const employee = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/employees/dashboard", type: "single" },
    {
      label: "Work Management", icon: ClipboardCheck, type: "group", children: [
        { label: "My Tasks", icon: ClipboardCheck, path: "/employees/task" },
        { label: "Projects", icon: Briefcase, path: "/employees/project" },
        { label: "My Team", icon: Users2, path: "/employees/teams" },
      ]
    },
    {
      label: "Personal", icon: Users2, type: "group", children: [
        { label: "Attendance", icon: CalendarDays, path: "/employees/attendance" },
        { label: "Leave Requests", icon: FileClock, path: "/employees/leave-requests" },
        { label: "My Payroll", icon: Wallet, path: "/employees/payroll" },
      ]
    },
    { label: "Notifications", icon: Bell, path: "/employees/notifications", type: "single" },
    { label: "Help & Support", icon: HelpCircle, path: "/employees/support", type: "single" },
    { label: "Settings", icon: Settings, path: "/employees/settings", type: "single" }, 
  ];

  // Items for iOS style dock (example)
  const iosDockItems = [
    { label: "Phone", icon: Phone, path: "/employees/phone" },
    { label: "Messages", icon: MessageCircle, path: "/employees/messages" },
    { label: "Dashboard", icon: LayoutDashboard, path: "/employees/dashboard" },
    { label: "Profile", icon: User, path: "/employees/profile" },
  ];

  const sidebarItems = employee;

  const renderMenuItem = (item) => {
    if (item.type === "single") {
      return (
        <div
          key={item.label}
          onClick={() => handleItemClick(item)}
          className={`flex items-center space-x-3 h-11 px-4 rounded-lg cursor-pointer transition-all duration-200 ${
            activeItem === item.label
              ? activeStyle
              : `${inactiveStyle} hover:bg-blue-50`
          }`}
        >
          <div className="flex items-center justify-center w-8">
            <item.icon className={`w-5 h-5 ${activeItem === item.label ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      );
    }
    if (item.type === "group") {
      const isExpanded = expandedGroups[item.label];
      return (
        <div key={item.label} className="mb-1">
          <div
            className={`flex items-center justify-between space-x-3 h-11 px-4 rounded-lg cursor-pointer transition-all duration-200 ${groupStyle}`}
            onClick={() => toggleGroup(item.label)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-blue-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </div>
          {isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <div
                  key={child.label}
                  onClick={() => handleItemClick(child)}
                  className={`flex items-center space-x-3 h-10 px-4 rounded-md cursor-pointer transition-all duration-200 ${
                    activeItem === child.label
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <child.icon className="w-4 h-4" />
                  <span className="text-sm">{child.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  // --- iOS Style App Launcher ---
  if (appMode && appModeStyle === 'ios') {
    if (!isOpen) return (
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 app-button p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 hover:bg-white transition-all hover:shadow-xl"
        onClick={() => {}} // Placeholder, handled by parent
      >
        <Grid3X3 className="w-7 h-7 text-blue-600" />
      </button>
    );

    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center pb-6 pointer-events-none">
        <div
          className="sidebar-popup bg-white/80 backdrop-blur-xl border border-gray-200 w-[90%] max-w-md max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto transform transition-all duration-500 ease-out rounded-3xl shadow-2xl"
          style={{
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            opacity: isOpen ? 1 : 0
          }}
        >
          {/* Optional: Search Bar for iOS */}
          {/* <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps..."
                className="w-full p-3 pl-10 text-base bg-gray-100/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div> */}

          {/* Main App Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {employee.filter(item => item.type === "single").map((item) => (
                <div
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center p-3 rounded-2xl cursor-pointer hover:bg-white/50 transition-all duration-200 active:scale-95"
                >
                  <div className="p-4 rounded-2xl bg-white shadow-md mb-2 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-xs text-center text-gray-800 font-medium px-1">
                    {item.label}
                  </span>
                </div>
              ))}

              {/* Group Items as Apps */}
              {employee.filter(item => item.type === "group").map((group) => (
                group.children.map((child) => (
                  <div
                    key={child.label}
                    onClick={() => handleItemClick(child)}
                    className="flex flex-col items-center p-3 rounded-2xl cursor-pointer hover:bg-white/50 transition-all duration-200 active:scale-95"
                  >
                    <div className="p-4 rounded-2xl bg-white shadow-md mb-2 flex items-center justify-center">
                      <child.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-xs text-center text-gray-800 font-medium px-1">
                      {child.label}
                    </span>
                  </div>
                ))
              ))}
            </div>
          </div>

          {/* iOS Style Dock */}
          <div className="p-4 pt-2 bg-gradient-to-t from-white/90 to-white/30">
            <div className="grid grid-cols-4 gap-4 bg-black/5 p-3 rounded-3xl">
              {iosDockItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center p-2 rounded-2xl cursor-pointer hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <div className="p-4 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <item.icon className="w-9 h-9 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close Handle */}
          <div className="flex justify-center pb-3 pt-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }


  // --- Enhanced Windows 11 Style App Launcher (Bigger) ---
  if (appMode && appModeStyle !== 'ios') { // Default to Windows if not iOS
    if (!isOpen) return (
      <button
        className="fixed bottom-5 left-5 z-30 app-button p-4 bg-white rounded-2xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:shadow-xl"
        onClick={() => {}} // Placeholder, handled by parent
      >
        <AppWindow className="w-7 h-7 text-blue-600" />
      </button>
    );
    return (
      <div className="fixed inset-0 z-40 flex items-start justify-start pt-24 pl-6 pointer-events-none">
        <div
          className="sidebar-popup bg-white border border-gray-200 w-96 max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col pointer-events-auto transform transition-all duration-300 ease-out rounded-3xl shadow-2xl"
          style={{
            transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isOpen ? 1 : 0
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 relative rounded-t-3xl">
            <div className="flex items-center gap-4">
              <ZentryxLogo size="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">Zentryx Apps</span>
                <span className="text-sm text-gray-500 capitalize">{role} Workspace</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="p-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                aria-label="Minimize"
              >
                <Minus className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className="p-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                aria-label="Maximize"
              >
                <Square className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps..."
                className="w-full p-3 pl-10 text-base bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* Application Grid */}
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="grid grid-cols-4 gap-5">
              {employee.map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    if (item.type === "single") {
                      handleItemClick(item);
                    } else {
                      // For groups, maybe open the first child or show a submenu?
                      if (item.children && item.children.length > 0) {
                         handleItemClick(item.children[0]);
                      }
                    }
                  }}
                  className="flex flex-col items-center p-4 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all duration-200 group active:scale-95"
                >
                  <div className="p-4 rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors mb-3 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-sm text-center text-gray-800 font-semibold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between rounded-b-3xl">
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-3 rounded-xl hover:bg-gray-200 transition-colors"
              onClick={() => router.push('/')}
            >
              <Home className="w-6 h-6" />
              <span className="text-base">Home</span>
            </button>
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-red-500 p-3 rounded-xl hover:bg-gray-200 transition-colors"
              onClick={() => {
                // Add logout functionality
                router.push('/login');
              }}
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Navigation Sidebar
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-start pt-20 pl-5 pointer-events-none">
      <div
        className="sidebar-popup bg-white border border-gray-200 w-72 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col pointer-events-auto transform transition-all duration-300 ease-out rounded-xl shadow-xl"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
          opacity: isOpen ? 1 : 0
        }}
      >
        {/* Header with Logo and Close Button */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 relative rounded-t-xl">
          <div className="flex items-center gap-3">
            <ZentryxLogo size="w-8 h-8" onClick={onClose} />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800">Zentryx</span>
              <span className="text-xs text-gray-500 capitalize">{role} Panel</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Navigation Items */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => renderMenuItem(item))}
          </div>
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-xs text-gray-500 text-center">
            © 2025 Zentryx - Your Work Force Management System
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingEmployeeSidebar;