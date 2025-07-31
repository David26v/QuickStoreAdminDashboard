import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, Users, Calendar, Briefcase, Coffee } from "lucide-react";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CreateShiftModal = ({
  isOpen,
  onClose,
  onSubmit,
  newShift,
  setNewShift,
  departments,
}) => {
  const handleInputChange = (field, value) => {
    setNewShift((prev) => ({ ...prev, [field]: value }));
  };

  const toggleWorkDay = (day) => {
    setNewShift((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 -m-6 mb-6 p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              Create New Shift
            </DialogTitle>
            <p className="text-blue-100 mt-1 ml-11">
              Configure your team's work schedule
            </p>
          </DialogHeader>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Shift Name
                </Label>
                <Input
                  placeholder="e.g. Morning Shift"
                  value={newShift.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                Description
                </Label>
                <Input
                placeholder="Optional description (e.g. Covers front desk duties)"
                value={newShift.description || ""}
                onChange={(e) =>
                    handleInputChange("description", e.target.value)
                }
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
            </div>
             
            </div>
          </div>

          {/* Time Configuration Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Time Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  className="border-slate-300 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  End Time
                </Label>
                <Input
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="border-slate-300 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Break Duration (min)
                </Label>
                <Input
                  type="number"
                  value={newShift.breakDuration}
                  onChange={(e) =>
                    handleInputChange("breakDuration", parseInt(e.target.value))
                  }
                  className="border-slate-300 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* Work Schedule Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Work Schedule
              </h3>
            </div>

            <div className="space-y-4">
              {/* Dropdown for quick selection */}
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-slate-700">
                  Quick Select
                </Label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all") {
                      setNewShift((prev) => ({
                        ...prev,
                        workDays: [...weekDays],
                      }));
                    } else if (value === "weekdays") {
                      setNewShift((prev) => ({
                        ...prev,
                        workDays: weekDays.filter(
                          (day) => !["Sunday", "Saturday"].includes(day)
                        ),
                      }));
                    } else if (value === "weekends") {
                      setNewShift((prev) => ({
                        ...prev,
                        workDays: ["Saturday", "Sunday"],
                      }));
                    } else if (value === "none") {
                      setNewShift((prev) => ({ ...prev, workDays: [] }));
                    }
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">-- Select --</option>
                  <option value="all">Select All Days</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="none">Clear Selection</option>
                </select>
              </div>

              <Label className="text-sm font-medium text-slate-700">
                Work Days
              </Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                      newShift.workDays.includes(day)
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-purple-300"
                    }`}
                    onClick={() => toggleWorkDay(day)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Checkbox
                        checked={newShift.workDays.includes(day)}
                        onCheckedChange={() => toggleWorkDay(day)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <span
                        className={`text-xs font-medium ${
                          newShift.workDays.includes(day)
                            ? "text-purple-700"
                            : "text-slate-600"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Settings Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Additional Settings
              </h3>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Checkbox
                id="overtime"
                checked={newShift.overtime}
                onCheckedChange={(checked) =>
                  handleInputChange("overtime", checked)
                }
                className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
              />
              <Label
                htmlFor="overtime"
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Enable Overtime
              </Label>
              <span className="text-xs text-orange-600 ml-auto">
                Allows extended work hours
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              Create Shift
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShiftModal;
