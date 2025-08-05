// components/ui/notificationBell.jsx (or similar path)
'use client';

import React, { useState } from 'react'; // Added useState import for the demo component
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, CheckCheck, X, Clock, AlertTriangle, CheckCircle, Info, Circle } from 'lucide-react';

const NotificationBell = ({
  notificationOpen,
  setNotificationOpen,
  unreadCount,
  notifications = [],
  onMarkAllRead,
  onMarkAsRead,
  onDeleteNotification
}) => {
  const getNotificationIcon = (type) => {
    // Use Lucide React icons
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />; 
    }
  };

  const getNotificationBorder = (type) => {
    switch (type) {
      case 'warning':
        return 'border-l-amber-500';
      case 'success':
        return 'border-l-green-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-slate-300 dark:border-l-slate-600';
    }
  };

  return (
    <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 group" // Changed focus ring to orange-500
          aria-label="Notifications"
        >
          <div className="relative">
            {unreadCount > 0 ? (
              // Use BellRing for active state, keep orange color
              <BellRing className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              // Use Bell for inactive state
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-200" />
            )}
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center p-0 border-2 border-white dark:border-slate-900 animate-pulse" // Changed badge bg to orange-500
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-96 p-0 mr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl" 
        align="end"
      >
        {/* Header - Updated with theme colors */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800 rounded-t-2xl"> 
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Notifications</h3> 
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800" 
                >
                  {unreadCount} new
                </Badge>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllRead}
                  className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 h-6 px-2"
                >
                  <CheckCheck className="w-3 h-3 mr-1" /> 
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-all duration-200 border-l-4 ${getNotificationBorder(notification.type)} ${
                    notification.unread ? 'bg-orange-50/30 dark:bg-orange-900/10' : '' 
                  }`}
                  onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100"> 
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div> 
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {notification.time}
                        </p>
                        {notification.department && (
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600" // Kept slate for department badge
                          >
                            {notification.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification && onDeleteNotification(notification.id);
                      }}
                      className="ml-2 p-1 h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full" // Kept red for delete
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="border-slate-200 dark:border-slate-700" />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">All caught up!</p> 
              <p className="text-xs text-slate-500 dark:text-slate-500">No new notifications</p>
            </div>
          )}
        </div>

        {/* Footer - Updated with theme colors */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800 rounded-b-2xl"> {/* Added gradient and rounded bottom */}
            <Button
              variant="ghost"
              className="w-full text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200" // Changed text/hover colors to orange
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// --- Demo Component ---
const ZentryNotificationDemo = ({ notifications: initialNotifications }) => { 
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications || []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationBell
      notificationOpen={notificationOpen}
      setNotificationOpen={setNotificationOpen}
      unreadCount={unreadCount}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      onMarkAsRead={handleMarkAsRead}
      onDeleteNotification={handleDeleteNotification}
    />
  );
};

export default ZentryNotificationDemo;
