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

const ActionModal = ({ open, onClose, onSuccess, editData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
    const payload = {
      name,
      description,
    };
  
    try {
      let response;
  
      if (editData) {
        // UPDATE role
        response = await supabase
          .from("roles")
          .update(payload)
          .eq("id", editData.id); 
  
        if (response.error) throw response.error;
  
        showAlert("Role updated successfully", "success");
      } else {
        // INSERT new role
        response = await supabase.from("roles").insert([
          {
            ...payload,
          },
        ]);
  
        if (response.error) throw response.error;
  
        showAlert("Role created successfully", "success");
      }
  
      onSuccess();
      onClose();
    } catch (error) {
      showAlert(error.message || "Operation failed", "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Role" : "Create New Role"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="rose" onClick={handleSubmit}>
            {editData ? "Update" : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;
