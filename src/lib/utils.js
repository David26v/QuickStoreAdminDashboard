import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getStatusBadge = (status) => {
  const baseClasses = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium";
  
  switch (status) {
    case 'present':
      return `${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    case 'late':
      return `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`;
    case 'absent':
      return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
    default:
      return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
  }
};

export  const getStatusIcon = (status) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'late':
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case 'absent':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};


export const getStatusBadgeAttendance = (status) => {
  switch (status) {
    case 'present':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>
    case 'absent':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>
    case 'late':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertCircle className="w-3 h-3 mr-1" />Late</Badge>
    default:
      return <Badge variant="outline">-</Badge>
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'present': return 'bg-green-500'
    case 'absent': return 'bg-red-500'
    case 'late': return 'bg-yellow-500'
    case 'weekend': return 'bg-gray-300'
    default: return 'bg-gray-100'
  }
}

//utils for devices 
export const getStatusColorDevice = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'no_device_yet': return 'text-purple-600 bg-purple-100';
      case 'under_maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'onsite': return 'text-indigo-600 bg-indigo-100';
      case 'in_warehouse': return 'text-gray-600 bg-gray-100';
      case 'arriving_to_client': return 'text-orange-600 bg-orange-100';
      case 'received_by_client': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  export const getStatusBgColorDevice = (status) => {
    switch (status) {
      case 'available': return 'bg-green-50';
      case 'no_device_yet': return 'bg-purple-50';
      case 'under_maintenance': return 'bg-yellow-50';
      case 'onsite': return 'bg-indigo-50';
      case 'in_warehouse': return 'bg-gray-50';
      case 'arriving_to_client': return 'bg-orange-50';
      case 'received_by_client': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  export const getStatusLightColorDevice = (status) => {
      switch (status) {
        case 'available': return 'bg-green-500 shadow-[0_0_8px_2px_rgba(72,187,120,0.5)]';
        case 'no_device_yet':
        case 'received_by_client': return 'bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]';
        case 'under_maintenance': return 'bg-yellow-500 shadow-[0_0_8px_2px_rgba(245,158,11,0.5)]';
        case 'onsite': return 'bg-indigo-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]';
        case 'in_warehouse': return 'bg-gray-500 shadow-[0_0_8px_2px_rgba(107,114,128,0.5)]';
        case 'arriving_to_client': return 'bg-orange-500 shadow-[0_0_8px_2px_rgba(249,115,22,0.5)]';
        default: return 'bg-gray-400';
      }
    };