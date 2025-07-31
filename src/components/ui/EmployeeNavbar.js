// components/EmployeeNavbar.jsx (or your navbar file path)
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// --- Import icons used in FloatingEmployeeSidebar sub-items ---
import { Menu, Search } from "lucide-react";
// --- End of icon imports ---
import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import UserAvatarMenu from "./UserAvatarMenu";
import ZentryNotificationDemo from "./notificationBell";
import supabase from "@/lib/helper";
import { ZentryxCommandMenu } from "./ZentryxCommandMenu";

// Custom Logo Component (Unchanged)
const ZentryxLogoIcon = ({ size = "w-10 h-10" ,goToDashboard }) => (
  <Button
    className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none`}
    aria-label="Open menu"
    type="button"
    onClick={goToDashboard}
  >
    <div className="absolute inset-1.5 bg-white rounded-full shadow-inner">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-0.5 h-2.5 bg-slate-700 rounded-full transform -rotate-45 origin-bottom"></div>
        <div className="absolute w-0.5 h-3 bg-blue-600 rounded-full transform rotate-12 origin-bottom"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full"></div>
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
    </div>
    <div className="absolute inset-0 border border-blue-500 rounded-xl"></div>
  </Button>
);

const EmployeeNavbar = ({ user, onMenuToggle }) => {
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userSettings,setUserSettings] = useState([])
  const router = useRouter();

  // Mock notifications (Unchanged)
  const notifications = [
    {
      id: 1,
      title: "Task assigned",
      message: "You have a new task from your manager",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Meeting reminder",
      message: "Team meeting in 30 minutes",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payroll update",
      message: "Your payroll has been processed",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    router.push("/");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const goToDashboard = () => {
    router.push("/users/dashboard");
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Original Top Navbar Style (Unchanged) */}
      <nav className="bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-900/80 backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-700/70 shadow-sm transition-all duration-300 sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            
             
                <ZentryxLogoIcon 
                  size="w-10 h-10" 
                  goToDashboard ={goToDashboard} 
                />



              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Zentryx
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Employee Dashboard
                </p>
              </div>

              {/* App Launcher Button (if you added it previously) */}

              {/* ... rest of your navbar content ... */}
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div
                onClick={openSearch}
                className="relative flex items-center bg-white dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700/90 rounded-2xl transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700 group cursor-text h-10 px-3"
              >
                <Search className="ml-3 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Search tasks, projects, people...
                </span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <ZentryNotificationDemo
                notificationOpen={notificationOpen}
                setNotificationOpen={setNotificationOpen}
                unreadCount={unreadCount}
                notifications={notifications}
              />

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

              <UserAvatarMenu
                open={open}
                setOpen={setOpen}
                user={user}
                handleLogout={handleLogout}
                getInitials={(first, last) =>
                  `${first?.[0] ?? ""}${last?.[0] ?? ""}`
                }
              />
            </div>
          </div>
        </div>
      </nav>

      <ZentryxCommandMenu
        open={searchOpen}
        onOpenChange={setSearchOpen} // ShadCN handles opening/closing
        onClose={closeSearch} // Callback for when an item is selected
      />
    </>
  );
};

export default EmployeeNavbar;
