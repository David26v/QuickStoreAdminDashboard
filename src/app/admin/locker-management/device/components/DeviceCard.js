'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Building, Package, Calendar, Key, Lock } from 'lucide-react';

const getStatusBadge = (status) => {
  return status === 'active' ? (
    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
      Active
    </Badge>
  ) : (
    <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
      Inactive
    </Badge>
  );
};

const DeviceCard = ({ device, onDetailsClick, onActionsClick }) => { // Add handlers if needed
  return (
    <Card
      key={device.id}
      className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Smartphone className="h-4 w-4 text-white" />
              </div>
              {device.device_id}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm mt-2">
              <Building className="h-3 w-3 text-orange-500" />
              <span className="text-gray-600">
                {device.clients?.name || 'Unassigned'}
              </span>
            </CardDescription>
          </div>
          {getStatusBadge(device.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Model:</span>
            </div>
            <span className="text-gray-800 font-semibold">
              {device.manufacturer} {device.model}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white/50 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">Android</div>
              <div className="font-semibold text-gray-800">
                {device.android_version || 'N/A'}
              </div>
            </div>
            <div className="p-2 bg-white/50 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">App</div>
              <div className="font-semibold text-gray-800">
                {device.app_version || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 p-2 bg-white/50 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Registered:</span>
            <span className="text-xs font-medium">
              {new Date(device.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600"
          onClick={() => onDetailsClick(device)} // Example handler
        >
          <Key className="w-3 h-3 mr-1" />
          Details
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
          onClick={() => onActionsClick(device)} // Example handler
        >
          <Lock className="w-3 h-3 mr-1" />
          Actions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;