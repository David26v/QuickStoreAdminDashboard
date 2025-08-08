'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, AlertTriangle, X } from 'lucide-react';

const getStatusBadge = (status) => {
  const statusConfig = {
    available: { color: 'bg-gradient-to-r from-green-500 to-green-600', icon: CheckCircle },
    occupied: { color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: Lock },
    maintenance: { color: 'bg-gradient-to-r from-red-500 to-red-600', icon: AlertTriangle },
    offline: { color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: X }
  };
  const config = statusConfig[status] || statusConfig.offline;
  const Icon = config.icon;
  return (
    <Badge className={`${config.color} text-white border-0 flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
    </Badge>
  );
};

export default getStatusBadge; // Exporting the function directly