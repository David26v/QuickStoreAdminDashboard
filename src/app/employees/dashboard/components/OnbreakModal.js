// components/OnBreakModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";


const formatBreakDuration = (totalHours) => {
  if (isNaN(totalHours) || totalHours < 0) return '00:00:00';

  const totalSeconds = Math.floor(totalHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to format threshold for display
const formatThreshold = (thresholdHours) => {
  if (thresholdHours >= 1) {
    const hours = Math.floor(thresholdHours);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor(thresholdHours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

const OnBreakModal = ({
  open,
  totalBreakTime,
  breakStartTime,
  breakThresholdHours = 1.0, 
}) => {
  const isBreakOvertime = totalBreakTime > breakThresholdHours;

  // Determine background color based on overtime
  const bgColorClass = isBreakOvertime
    ? "from-red-100 to-orange-100 border-red-200"
    : "from-amber-50 to-amber-100 border-amber-200";

  const textColorClass = isBreakOvertime ? "text-red-700" : "text-amber-700";
  const iconColorClass = isBreakOvertime ? "text-red-600" : "text-amber-600";

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className={`w-full max-w-md sm:max-w-lg overflow-hidden rounded-2xl shadow-2xl border-2 ${bgColorClass}`}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Background Icon */}
          <div className={`absolute top-4 right-4 opacity-10 ${iconColorClass}`}>
            <Coffee className="h-24 w-24" />
          </div>

          <DialogHeader className="text-center pt-8 pb-2 relative">
            <motion.div
              initial={{ y: -15 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mx-auto p-3 rounded-full ${isBreakOvertime ? 'bg-red-100' : 'bg-amber-100'}`}
            >
              <Coffee className={`h-8 w-8 ${iconColorClass}`} />
            </motion.div>
            <DialogTitle className={`text-2xl font-bold ${textColorClass} mt-4`}>
              You Are On Break
            </DialogTitle>
            <DialogDescription className={`${isBreakOvertime ? 'text-red-600' : 'text-amber-600'} mt-2`}>
              {isBreakOvertime ? (
                <span className="font-bold">Break Overtime!</span>
              ) : (
                "Take some time to relax."
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Prominent Break Time Display */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-5 px-4"
          >
            <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-5 border ${isBreakOvertime ? 'border-red-100' : 'border-amber-100'} shadow-sm`}>
              <div className="text-sm text-gray-600 mb-2">Break Duration</div>
              <div className={`text-4xl font-bold tracking-tight ${textColorClass}`}>
                {formatBreakDuration(totalBreakTime)}
              </div>
              <div className="text-sm text-gray-600 mt-4">
                Break started at {breakStartTime ? breakStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </div>
              {isBreakOvertime && (
                <div className="text-xs text-red-500 mt-2 animate-pulse">
                  Your break has exceeded the {formatThreshold(breakThresholdHours)} limit!
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OnBreakModal;