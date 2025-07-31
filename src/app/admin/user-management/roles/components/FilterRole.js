"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const FilterRole = ({ open, onClose, onApply }) => {
    const [selectedFilter, setSelectedFilter] = useState("");
  
    const handleApply = () => {
      onApply(selectedFilter);
      onClose();
    };
  
    return (
      <Drawer open={open} onOpenChange={(value) => {
        if (!value) onClose(); // Close drawer only when user manually closes it
      }} direction="right">
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Filter Roles</DrawerTitle>
          </DrawerHeader>
  
          <div className="space-y-4 mt-2">
            <label className="block text-sm font-medium">Role Type</label>
            <select
              className="w-full border rounded p-2"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="developer">Developer</option>
            </select>
          </div>
  
          <DrawerFooter className="mt-6 flex justify-end gap-2">
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
            <Button onClick={handleApply}>Apply</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };
  
  

export default FilterRole;
