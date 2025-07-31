"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/providers/AlertProvider";
import supabase, { api } from "@/lib/helper";
import { Building2, FileText, Sparkles } from "lucide-react";

const ActionModal = ({ open, onClose, onSuccess, editData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      showAlert("Please enter a department name", "error");
      return;
    }

    setIsLoading(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      let response;

      if (editData) {
        // UPDATE department
        response = await supabase
          .from("departments")
          .update(payload)
          .eq("id", editData.id);

        if (response.error) throw response.error;

        showAlert("Department updated successfully", "success");
      } else {
        // CREATE new department
        response = await supabase.from("departments").insert([payload]);

        if (response.error) throw response.error;

        showAlert("Department created successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (error) {
      showAlert(error.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {editData ? "Edit Department" : "Create New Department"}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {editData 
                  ? "Update the department information below" 
                  : "Add a new department to your organization"
                }
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Department Name
            </label>
            <Input
              placeholder="e.g., Human Resources, Engineering, Marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <Textarea
              placeholder="Describe the department's role and responsibilities..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent" style={{
                  animation: 'spin 1s linear infinite'
                }}></div>
                {editData ? "Updating..." : "Creating..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {editData ? "Update Department" : "Create Department"}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;