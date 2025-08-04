"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCog,
  User2,
  CalendarDays,
  Wallet,
  Briefcase,
  BarChart,
  Activity,
  Settings,
  FileClock,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Shield,
  CalendarCog,
  Tv,
  TvMinimalPlayIcon,
  Users2,
  Megaphone,
  MessageCircle,
  Mail,
  FileText as FileTextDoc,
  BookOpen,
  Newspaper,
  Settings2,
  Plug,
  DatabaseBackup,
  Calendar,
  MonitorCogIcon,
  Lock,
  MapPin,
  Wrench,
  Clock,
  LocateIcon,
  Settings2Icon,
  UserPlus,
} from "lucide-react";
import { useLoading } from "../providers/LoadingProvider";


const QuickStoreLogo = ({ size = "w-16 h-16" }) => (
  <div className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg overflow-hidden`}>
    <div className="absolute inset-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-inner">
      <Shield className="h-1/2 w-1/2 text-slate-200" />
    </div>
    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
      <Lock className="h-2.5 w-2.5 text-white" />
    </div>
  </div>
);


const AdminSidebar = ({ isOpen, role }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const router = useRouter();
  const { show, hide } = useLoading();

  const handleItemClick = async (item) => {
    setActiveItem(item.label);
    show("Loading module...");
    await new Promise(res => setTimeout(res, 300));
    router.push(item.path);
    setTimeout(() => {
      hide();
    }, 300);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // --- Updated Styles to match QuickStore theme ---
  const activeStyle = "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105";
  const inactiveStyle = "text-gray-600 hover:text-gray-800";
  const groupStyle = "text-gray-700 hover:bg-gray-100";
  // --- End Updated Styles ---

  const client_admin_menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", type: "single" },

    {
      label: "Locker Management", icon: Lock, type: "group", children: [
        { label: "Locker Inventory", icon: LayoutDashboard, path: "/client_admin/locker-management/inventory" },
        { label: "Assign Lockers", icon: UserCog, path: "/client_admin/locker-management/assign" },
        { label: "Locker Session History", icon: FileClock, type: "single", path: "/client_admin/locker-history" },
        { label: "Lockers Settings", icon: Settings2Icon, type: "single", path: "/client_admin/locker-history" },
      ]
    },

    {
      label: "User Management", icon: Users, type: "group", children: [
        { label: "Users", icon: Users2, path: "/client_admin/user-management/users" },
        { label: "Guest", icon: Briefcase, path: "/client_admin/user-management/employees" },
        { label: "Members", icon: Briefcase, path: "/client_admin/user-management/employees" },
      ]
    },
    {
      label: "System Settings", icon: Settings2, type: "group", children: [
        { label: "General Settings", icon: Settings, path: "/client_admin/system-settings/general" },
        { label: "Integrations", icon: Plug, path: "/client_admin/system-settings/integrations" },
        { label: "Backup & Restore", icon: DatabaseBackup, path: "/client_admin/system-settings/backup" },
      ]
    },
    { label: "Profile Settings", icon: Settings, path: "/admin/profile", type: "single" },

  ];
  // --- END UPDATED ADMIN SIDEBAR ---
  const sidebarItems = role === "client_admin" ? client_admin_menu : [];

  const renderMenuItem = (item) => {
    if (item.type === "single") {
      return (
        <div
          key={item.label}
          onClick={() => handleItemClick(item)}
          className={`flex items-center space-x-3 h-12 px-4 rounded-xl cursor-pointer transition-all duration-200 ${activeItem === item.label
              ? activeStyle
              : `${inactiveStyle} hover:bg-gray-50 hover:shadow-sm`
            }`}
        >
          <div className="flex items-center justify-center w-8">
            <item.icon className={`w-5 h-5 ${activeItem === item.label ? 'text-white' : 'text-gray-600'}`} />
          </div>
          {isOpen && <span className="text-sm font-medium">{item.label}</span>}
        </div>
      );
    }
    if (item.type === "group") {
      const isExpanded = expandedGroups[item.label];
      return (
        <div key={item.label} className="mb-1">
          <div
            className={`flex items-center justify-between space-x-3 h-12 px-4 rounded-xl cursor-pointer transition-all duration-200 ${groupStyle}`}
            onClick={() => toggleGroup(item.label)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </div>
            {isOpen && (
              <div className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
          {isOpen && isExpanded && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
              {item.children.map((child) => (
                <div
                  key={child.label}
                  onClick={() => handleItemClick(child)}
                  className={`flex items-center space-x-3 h-10 px-3 rounded-lg cursor-pointer transition-all duration-200 ${activeItem === child.label
                      ? "bg-orange-50 text-orange-600 border-l-2 border-orange-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
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
    return null;
  };

  return (
    <nav className="h-full bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* --- Updated Header with QuickStore Logo and Name --- */}
        <div className={`flex items-center gap-3 p-6 border-b border-gray-100 transition-all duration-300 ${isOpen ? "justify-start" : "justify-center"}`}>
          <QuickStoreLogo size={isOpen ? "w-12 h-12" : "w-10 h-10"} />
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">QuickStore Philippines</span>
              <span className="text-xs text-gray-500 capitalize">{role} Panel</span>
            </div>
          )}
        </div>
        {/* --- End Updated Header --- */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map((item) => renderMenuItem(item))}
          </div>
        </div>
        {isOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 text-center">
              {/* --- Updated Footer Copyright --- */}
              © {new Date().getFullYear()} QuickStore Philippines Locker System. All rights reserved.
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminSidebar;