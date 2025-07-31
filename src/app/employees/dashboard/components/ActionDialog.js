import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const ActionDialog = ({
  open,
  onOpenChange,
  currentTime,
  onConfirm,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-full max-w-md sm:max-w-lg overflow-hidden rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 flex flex-col justify-center items-center p-0" // Modified classes
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full p-6" // Added padding and full width
        >
          {/* Background Clock Icon - Keeping this one */}
          <div className="absolute top-4 right-4 opacity-10">
            <Clock className="h-24 w-24 text-emerald-600" />
          </div>

          <DialogHeader className="text-center pt-8 pb-2 relative">
            {/* Removed the clock icon from here */}
            <DialogTitle className="text-2xl font-bold text-gray-900 mt-4">
              Confirm Clock In
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Please verify the current time
            </DialogDescription>
          </DialogHeader>

          {/* Prominent Time Display */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-5 px-4"
          >
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-gray-900 tracking-tight">
                {formattedTime}
              </div>
              <div className="text-sm text-gray-600 mt-2 px-2">
                {formattedDate}
              </div>
            </div>
          </motion.div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 p-5 pt-0 justify-center"> 
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              <XCircle className="h-5 w-5" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md shadow-emerald-100 font-medium"
            >
              <CheckCircle className="h-5 w-5" />
              Confirm Clock In
            </motion.button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;