// app/users/notifications/page.js
"use client";

import React, { useState } from 'react';
// Import Shadcn UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"; // For handling long lists

// Import Lucide React Icons
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Info,
  X,
  Mail,
  Calendar,
  User,
  FileText,
  Settings,
  Trash2,
  Eye,
} from 'lucide-react';

// Mock notification data (would come from an API/context in reality)
const mockNotifications = [
  {
    id: 1,
    title: "Leave Request Approved",
    message: "Your vacation leave request for July 25-29 has been approved by HR.",
    type: "success", // success, warning, info, error
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    category: "leave",
    actionUrl: "/users/leave-requests", // Example URL for the action
  },
  {
    id: 2,
    title: "Payroll Processed",
    message: "Your salary for the period June 16-30 has been successfully processed and deposited.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    category: "payroll",
    actionUrl: "/users/payroll",
  },
  {
    id: 3,
    title: "Pending Time Sheet",
    message: "You have an outstanding timesheet for the week ending July 14th that needs submission.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
    category: "timesheet",
    actionUrl: "#", // Placeholder
  },
  {
    id: 4,
    title: "System Maintenance",
    message: "Scheduled maintenance will occur this Sunday (July 21) from 2 AM to 4 AM. The system might be temporarily unavailable.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    category: "system",
    actionUrl: "#",
  },
  {
    id: 5,
    title: "Profile Update Required",
    message: "Please review and update your emergency contact information in your profile settings.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: false,
    category: "profile",
    actionUrl: "/user/settings", // Example URL
  },
  {
    id: 6,
    title: "New Policy Document",
    message: "The updated Employee Handbook is now available. Please review the changes regarding remote work policies.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    isRead: true,
    category: "policy",
    actionUrl: "#", // Placeholder for document link
  },
  {
    id: 7,
    title: "Performance Review Reminder",
    message: "Your quarterly performance review is scheduled for July 28th at 2 PM with your manager.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    isRead: false,
    category: "performance",
    actionUrl: "#", // Placeholder for calendar link
  },
  {
    id: 8,
    title: "Security Alert",
    message: "A new login was detected on your account from an unrecognized device. If this wasn't you, please change your password immediately.",
    type: "error",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
    isRead: true,
    category: "security",
    actionUrl: "/user/settings/security", // Example URL
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all"); // all, unread, read

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000); // Years
    if (interval >= 1) return `${interval}y ago`;

    interval = Math.floor(seconds / 2592000); // Months
    if (interval >= 1) return `${interval}mo ago`;

    interval = Math.floor(seconds / 86400); // Days
    if (interval >= 1) return `${interval}d ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval >= 1) return `${interval}h ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval >= 1) return `${interval}m ago`;

    return "Just now";
  };

  // Get icon and color based on notification type
  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return { icon: Check, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" };
      case "warning":
        return { icon: AlertCircle, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" };
      case "error":
        return { icon: X, color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" };
      default: // info
        return { icon: Info, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" };
    }
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "leave": return Calendar;
      case "payroll": return FileText; // Or a specific currency icon if available
      case "timesheet": return Clock;
      case "system": return Settings;
      case "profile": return User;
      case "policy": return FileText;
      case "performance": return Target; // Assuming Target icon is imported or available
      case "security": return Shield; // Assuming Shield icon is imported or available
      default: return Bell;
    }
  };

  // Dummy icons for categories not explicitly handled above, assuming they are imported
  const Target = ({ className }) => <Info className={className} />; // Placeholder
  const Shield = ({ className }) => <Info className={className} />; // Placeholder

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true; // "all"
  });

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  // Dismiss a single notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Dismiss all notifications (could be filtered/all)
  const dismissAll = () => {
    if (filter === "all") {
      setNotifications([]);
    } else {
      const idsToDismiss = new Set(filteredNotifications.map(n => n.id));
      setNotifications(notifications.filter(notif => !idsToDismiss.has(notif.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-8 w-8 text-blue-500" />
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Stay updated with important alerts and messages.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={!notifications.some(n => !n.isRead)} // Disable if no unread
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissAll}
                disabled={filteredNotifications.length === 0} // Disable if no notifications to dismiss
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Dismiss All
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs/Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" : "border-gray-300 dark:border-gray-600"}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" : "border-gray-300 dark:border-gray-600"}
          >
            Unread
            <Badge variant="secondary" className="ml-2 bg-white text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              {notifications.filter(n => !n.isRead).length}
            </Badge>
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
            className={filter === "read" ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700" : "border-gray-300 dark:border-gray-600"}
          >
            Read
          </Button>
        </div>

        {/* Notifications List */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Notifications
            </CardTitle>
            <CardDescription>
              {filteredNotifications.length} {filter === "all" ? "total" : filter} notification{filteredNotifications.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-0">
            {filteredNotifications.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => {
                    const TypeIcon = getTypeConfig(notification.type).icon;
                    const typeColorClass = getTypeConfig(notification.type).color;
                    const CategoryIcon = getCategoryIcon(notification.category);

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Notification Icon */}
                          <div className={`flex-shrink-0 mt-0.5 p-2 rounded-full ${typeColorClass}`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  onClick={() => dismissNotification(notification.id)}
                                  aria-label="Dismiss notification"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <CategoryIcon className="h-3.5 w-3.5 mr-1.5" />
                                {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                              </div>
                              <div className="flex items-center space-x-2">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    Mark Read
                                  </Button>
                                )}
                                {notification.actionUrl && notification.actionUrl !== "#" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
                                    asChild
                                  >
                                     <a href={notification.actionUrl}>
                                      <Eye className="h-3.5 w-3.5 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BellOff className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No notifications</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === "unread"
                    ? "You're all caught up! No unread notifications."
                    : filter === "read"
                    ? "No read notifications found."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;