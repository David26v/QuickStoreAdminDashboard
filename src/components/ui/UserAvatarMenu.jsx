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
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-full">
          <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt="User Avatar" />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 p-0 mr-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        align="end"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt="User Avatar" />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    user.role === 'admin'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <FiShield className="w-3 h-3 mr-1" />
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Last Login */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span>Last login</span>
            </div>
            <span className="font-medium">
              {user.last_login
                ? new Date(user.last_login).toLocaleString()
                : 'First time login'}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link href="/admin/profile">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-gray-100"
            >
              <FiUser className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Profile Settings</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your account
                </div>
              </div>
            </Button>
          </Link>

          <Separator className="my-1 border-gray-200 dark:border-gray-700" />

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 h-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            onClick={handleLogout}
          >
            <AiOutlineLogout className="w-4 h-4 mr-3" />
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
