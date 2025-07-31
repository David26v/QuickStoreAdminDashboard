import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Coffee, CheckCircle, XCircle } from "lucide-react";

const BreakInOutModal = ({
  open,
  onOpenChange,
  currentTime,
  onConfirm,
  actionType = "breakOut", // 'breakOut' or 'breakIn'
  disableClose = false, // New prop to prevent closing
}) => {
  // Format time for display
  const formattedTime = currentTime?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const formattedDate = currentTime?.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Dynamic content based on action type
  const title = actionType === "breakIn" ? "Confirm Break End" : "Confirm Break Start";
  const description = actionType === "breakIn" 
    ? "Are you ready to resume work?" 
    : "Are you starting your break now?";
  const confirmText = actionType === "breakIn" ? "End Break" : "Start Break";
  const bgColor = actionType === "breakIn" ? "from-amber-50 to-amber-100" : "from-blue-50 to-blue-100";
  const buttonGradient = actionType === "breakIn" 
    ? "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-100" 
    : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-100";
  const iconColor = actionType === "breakIn" ? "text-amber-600" : "text-blue-600";

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!disableClose) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent 
        className={`w-full max-w-md sm:max-w-lg overflow-hidden rounded-2xl shadow-2xl border-0 bg-gradient-to-br ${bgColor}`}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Background Icon */}
          <div className="absolute top-4 right-4 opacity-10">
            <Coffee className="h-24 w-24 text-current" />
          </div>

          <DialogHeader className="text-center pt-8 pb-2 relative">
            <motion.div
              initial={{ y: -15 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mx-auto p-3 rounded-full ${actionType === "breakIn" ? "bg-amber-100" : "bg-blue-100"}`}
            >
              <Coffee className={`h-8 w-8 ${iconColor}`} />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mt-4">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Prominent Time Display */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-5 px-4"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/50 shadow-sm">
              <div className="text-4xl font-bold text-gray-900 tracking-tight">
                {formattedTime}
              </div>
              <div className="text-sm text-gray-600 mt-2 px-2">
                {formattedDate}
              </div>
            </div>
          </motion.div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 p-5 pt-0">
            {/* Conditionally hide/disable Cancel button */}
            {!disableClose && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
              >
                <XCircle className="h-5 w-5" />
                Cancel
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r ${buttonGradient} text-white rounded-xl transition-all duration-200 shadow-md font-medium`}
            >
              <CheckCircle className="h-5 w-5" />
              {confirmText}
            </motion.button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakInOutModal;