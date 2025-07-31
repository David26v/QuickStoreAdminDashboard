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