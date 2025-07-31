'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FiSun, FiMoon } from "react-icons/fi";
import Image from "next/image";
import UserAvatarMenu from "./UserAvatarMenu";
import ZentryNotificationDemo from "./notificationBell";
import supabase from "@/lib/helper";

const Navbar = ({ openSideBar ,user }) => {
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const router = useRouter();



 


  // Mock notifications - replace with actual notifications
  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "Sarah Wilson has joined the platform",
      time: "5 minutes ago",
      unread: true
    },
    {
      id: 2,
      title: "System update",
      message: "Security patches have been applied",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "Backup completed",
      message: "Daily backup finished successfully",
      time: "3 hours ago",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;




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

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-colors duration-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side: Menu and Search */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={openSideBar} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <Image src="/Menu.svg" alt="Menu Icon" width={20} height={20} className="dark:invert" />
            </button>

            <div className="relative flex items-center bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-colors duration-200 min-w-[300px] max-w-md">
              <span className="pl-4 pr-2">
                <Image src="/search.png" alt="Search Icon" width={18} height={18} className="opacity-60 dark:invert" />
              </span>
              <Input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-transparent border-none focus-visible:ring-0 text-gray-700 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3"
              />
            </div>
          </div>

          {/* Right side: Dark Mode Toggle, Notification and Avatar */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
           
            {/* Notification Bell */}
            <ZentryNotificationDemo
              notificationOpen={notificationOpen}
              setNotificationOpen={setNotificationOpen}
              unreadCount={unreadCount}
              notifications={notifications}
            />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            {/* User Avatar */}
            <UserAvatarMenu
              open={open}
              setOpen={setOpen}
              user={user}
              handleLogout={handleLogout}
              getInitials={(first, last) => `${first?.[0] ?? ''}${last?.[0] ?? ''}`}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;