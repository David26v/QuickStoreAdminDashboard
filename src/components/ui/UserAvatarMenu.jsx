// components/ui/UserAvatarMenu.jsx (or similar path)
'use client';

import React from 'react';
import Link from 'next/link';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FiShield, FiClock, FiUser } from 'react-icons/fi'; 
import { AiOutlineLogout } from 'react-icons/ai'; 

const UserAvatarMenu = ({
  open,
  setOpen,
  user, 
  handleLogout,
  getInitials, 
}) => {

  const initials = typeof getInitials === 'function' ? getInitials(user?.first_name, user?.last_name) : '??';


  const userFullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User';
  const userEmail = user?.email || 'No email provided';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="focus:outline-none focus:ring-2 focus:ring-orange-500/30 rounded-full transition-all duration-200" 
          aria-label="User Menu"
        >
          <Avatar className="w-11 h-11 ring-2 ring-white dark:ring-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={`Avatar for ${userFullName}`} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-base"> 
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 p-0 mr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl" 
        align="end"
      >
        {/* Header - Using Sidebar Theme */}
        <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-xl"> 
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-white/20"> 
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={`Avatar for ${userFullName}`} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate"> 
                {userFullName}
              </h3>
              <p className="text-sm text-slate-300 truncate"> 
                {userEmail}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={user?.role === 'admin' ? 'default' : 'secondary'}
                  className={`text-xs font-medium ${
                    user?.role === 'admin'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                  }`}
                >
                  <FiShield className="w-3 h-3 mr-1" />
                  {user?.role === 'admin' ? 'Administrator' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Last Login Section - Subtle styling */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span>Last login</span>
            </div>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {user?.last_login 
                ? new Date(user.last_login).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'First time login'}
            </span>
          </div>
        </div>


        <div className="py-2">
          <Link href="/client_admin/profile-settings" passHref> 
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto hover:bg-orange-50 dark:hover:bg-slate-700/50 transition-colors text-slate-800 dark:text-slate-200 group" 
            >
              <FiUser className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
              <div className="text-left">
                <div className="font-medium">Profile Settings</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your account
                </div>
              </div>
            </Button>
          </Link>

          <Separator className="my-1 border-slate-200 dark:border-slate-700/50" />

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 h-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group" 
            onClick={handleLogout}
          >
            <AiOutlineLogout className="w-4 h-4 mr-3 text-red-500 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" /> 
            <div className="text-left">
              <div className="font-medium">Sign Out</div>
              <div className="text-xs opacity-75">End your session</div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatarMenu;